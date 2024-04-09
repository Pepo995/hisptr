import { SHA256 } from "crypto-js";
import { prisma } from "@db";
import { type users_type } from "@prisma/client";

export const isValidToken = async (tokenReceived?: string | string[], userType?: users_type) => {
  if (typeof tokenReceived !== "string") return false;

  const tokenWithoutId = tokenReceived.substring(tokenReceived?.indexOf("|") + 1 ?? 0);
  const hashedToken = hashToken(tokenWithoutId);

  const where: { token: string; user?: { type: users_type } } = {
    token: hashedToken,
  };

  if (userType) {
    where.user = {
      type: userType,
    };
  }

  const tokenFound = await prisma.personalAccessToken.findUnique({
    where,
    select: {
      id: true,
    },
  });

  return tokenFound !== null;
};

const hashToken = (token: string) => {
  return token && SHA256(token).toString();
};
