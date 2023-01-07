// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { generatePNG } from "../../../util";

export default async function handler(req, res) {
  const { hash, size } = req.query;
  const image = await generatePNG(hash, parseInt(size) || 1024);

  res.setHeader("Content-Type", "image/png");
  return res.send(image);
}
