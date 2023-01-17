// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getLayerIndex, generatePNG } from "../../../util";

export default async function handler(req, res) {
  const { hash, size, layers } = req.query;

  const layerIndices = layers
    ?.split(",")
    .map(getLayerIndex)
    .filter((i) => i >= 0);
  const image = await generatePNG(hash, parseInt(size) || 1024, { layerIndices });

  res.setHeader("Content-Type", "image/png");
  return res.send(image);
}
