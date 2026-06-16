import type { NextFunction, Request, Response } from "express";
import { createSignature, getToken } from "./TokenHelper.js";

function middleware(req: Request, res: Response, next: NextFunction) {
  if (
    req.headers.cookie === undefined ||
    !req.headers.cookie.includes("token=")
  ) {
    console.error("No token found in cookies.");
    res.status(401).send("Unauthorized: No token provided");
    return;
  }
  // Already authenticated, token is valid

  const cookie = req.headers.cookie;
  var token = getToken(cookie!);
  if (!token) {
    console.error("Token extraction failed.");
    res.status(401).send("Unauthorized: No token provided");
    return;
  }

  // Ensure this is a handled algorithm and type
  if (token.header.alg !== "HS256" || token.header.typ !== "JWT") {
    console.error("Unsupported token algorithm or type.");
    res.status(401).send("Unauthorized: Unsupported token algorithm or type");
    return;
  }

  // Check token signature
  const signature = createSignature(token.rawHeader, token.rawPayload);
  if (signature !== token.signature) {
    console.error("Token signature is invalid.");
    res.status(401).send("Unauthorized: Invalid token signature");
    return;
  }

  // Check if token is expired
  if (Date.now() / 1000 > token.payload.exp) {
    console.error("Token has expired.");
    res.status(401).send("Unauthorized: Token has expired");
    return;
  }
  req.userId = token.payload.userId;
  next();
}

export default middleware;
