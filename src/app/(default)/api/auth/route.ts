import { cookies } from "next/headers";

import { z } from "zod";

const tokenCookie = z.object({
  token: z.string().optional(),
});

export async function POST(request: Request) {
  const { token } = tokenCookie.parse(await request.json());
  const cookieStore = cookies();
  try {
    if (!token) {
      cookieStore.delete("token");
    } else {
      cookieStore.set("token", token);
    }
    return new Response("Token set in cookie", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Error setting token in cookie", { status: 500 });
  }
}
