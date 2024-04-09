import { cookies } from "next/headers";

export function GET(_request: Request) {
  const cookieStore = cookies();
  const identifier = cookieStore.get("identifier")?.value;

  if (identifier) {
    return new Response(identifier);
  }

  cookieStore.set("identifier", (Math.random() + 1).toString(36).substring(7));
  return new Response(cookieStore.get("identifier")?.value);
}
