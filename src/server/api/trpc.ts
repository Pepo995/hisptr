/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { createHash } from "crypto";
/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "@db";
import { type NextApiRequest } from "next";
import * as Sentry from "@sentry/nextjs";

type CreateContextOptions = Record<string, never>;

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (
  _opts: CreateContextOptions,
  req?: NextApiRequest,
  resHeaders?: Record<string, string>,
) => ({
  prisma,
  req,
  resHeaders,
});

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({}, _opts.req);
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const sentryMiddleware = t.middleware(
  Sentry.Handlers.trpcMiddleware({
    attachRpcInput: true,
  }),
);

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(sentryMiddleware);

export const protectedProcedure = t.procedure.use(async ({ next, ctx }) => {
  if (!ctx.req) {
    throw new Error("Missing request object");
  }
  const token = ctx.req.cookies.token;
  if (!token) {
    throw new Error("No token found in cookies");
  }
  const hashedtoken = createHash("sha256").update(token.split("|")[1]).digest("hex");
  try {
    const user = await ctx.prisma.personalAccessToken
      .findUnique({
        where: { token: hashedtoken },
        select: {
          user: {
            select: { id: true, firstName: true, lastName: true, type: true },
          },
        },
      })
      .then((res) => {
        return res?.user ?? null;
      });
    if (!user) {
      throw new Error("No user found with that token");
    }
    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error("Error fetching user from database");
  }
});

export const adminProtectedProcedure = protectedProcedure.use(async ({ next, ctx }) => {
  if (ctx.user.type !== "superadmin") {
    throw new Error("User is not an admin");
  }
  return next({ ctx });
});

export const customerProtectedProcedure = protectedProcedure.use(async ({ next, ctx }) => {
  if (ctx.user.type !== "customer") {
    throw new Error("User is not a customer");
  }
  return next({ ctx });
});
