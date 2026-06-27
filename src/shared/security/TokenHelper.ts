import { config } from "../../config.js";
import { createHmac } from "node:crypto";
import { HttpError } from "../errors/HttpError.js";

type JwtToken = {
  rawHeader: string;
  rawPayload: string;
  header: {
    alg: string;
    typ: string;
  };
  payload: {
    userId: string;
    mail: string;
    token: string;
    iat: number;
    exp: number;
  };
  signature: string;
};
const jwtSecretKey = config.JWT_SECRET_KEY! as string;
const jwtExpirationTime = 8 * 60 * 60 * 1000; // 4 hours
export function createSignature(header: string, payload: string): string {
  return createHmac("sha256", jwtSecretKey)
    .update(header + "." + payload)
    .digest("hex");
}

export function getUserId(token: string): string {
  if (!token || token.trim() === "" || !token.includes("token=")) {
    throw new HttpError(401, "No token provided");
  }
  const jwtToken = getToken(token);
  return jwtToken.payload.userId;
}

export function getToken(cookie: string): JwtToken {
  const splitToken = cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.trim()
    ?.substring("token=".length);
  if (!splitToken) {
    throw new HttpError(401, "No token provided");
  }
  const [tokenHeader, tokenPayload, tokenSignature] = splitToken.split(".");
  if (!tokenHeader || !tokenPayload || !tokenSignature) {
    throw new HttpError(401, "No token provided");
  }

  return {
    rawHeader: tokenHeader,
    rawPayload: tokenPayload,
    header: JSON.parse(Buffer.from(tokenHeader, "base64url").toString("utf8")),
    payload: JSON.parse(
      Buffer.from(tokenPayload, "base64url").toString("utf8"),
    ),
    signature: tokenSignature,
  };
}

export function createToken(userId: string, mail: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      userId: userId,
      mail: mail,
      token: "faketoken",
      iat: now,
      exp: now + jwtExpirationTime,
    }),
  ).toString("base64url");
  const signature = createSignature(header, payload);
  return header + "." + payload + "." + signature;
}

export function getExpirationTime(): number {
  return jwtExpirationTime;
}
