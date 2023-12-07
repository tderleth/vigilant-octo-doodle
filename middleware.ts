import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type User = { username: string; password: string };
const users: User[] = [{ username: "user", password: "password" }];

const findUserByUsername = (username: string): User | undefined => {
  return users.find((user) => user.username === username);
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [username, pwd] = atob(authValue).split(":");
    const user = findUserByUsername(username);

    if (user && pwd === user.password) {
      return NextResponse.next();
    }
  }

  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
