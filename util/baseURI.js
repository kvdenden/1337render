export const baseURI =
  process.env.NEXT_PUBLIC_BASE_URI ||
  (process.env.VERCEL === "1" ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL : "http://localhost:3000");
