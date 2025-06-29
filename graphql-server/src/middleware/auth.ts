import { MiddlewareFn } from "type-graphql";
import jwt from "jsonwebtoken";

interface Context {
  req: {
    headers: {
      authorization?: string;
    };
  };
  userId?: string;
}

export const AuthMiddleware: MiddlewareFn<Context> = async ({ context }, next) => {
  const authorization = context.req.headers.authorization;

  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any;
    context.userId = payload.userId;
  } catch (err) {
    throw new Error("Not authenticated");
  }

  return next();
};