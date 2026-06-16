export const config = {
  JWT_SECRET_KEY:
    process.env.JWT_SECRET_KEY ??
    (() => {
      throw new Error("JWT_SECRET_KEY is not defined");
    }),
  MONGO_URI:
    process.env.MONGO_URI ??
    (() => {
      throw new Error("MONGO_URI is not defined");
    }),
};
