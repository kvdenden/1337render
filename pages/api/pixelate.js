// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sharp from "sharp";
import _ from "lodash";
import { skulls } from "../../web3/contracts";
import { getLayerIndex, generatePNG } from "../../util";

const hex = (r, g, b, a) => "#" + [r, g, b, a].map((i) => i.toString(16).padStart(2, "0")).join("");
const rgb = (r, g, b) => `rgb(${r},${g},${b})`;
const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${+(a / 255).toFixed(2)})`;
const numeric = (r, g, b, a) => ((r << 24) | (b << 16) | (g << 8) | a) >>> 0;

const formatColor = (channels, format) => {
  switch (format) {
    case "hex":
      return hex(...channels);
    case "rgb":
      return rgb(...channels);
    case "rgba":
      return rgba(...channels);
    default:
      return numeric(...channels);
  }
};

export default async function handler(req, res) {
  const { tokenId, format = "hex", layers } = req.query;

  const hash = tokenId ? await skulls.tokenIdToHash(tokenId) : req.query.hash;
  const layerIndices = layers
    ?.split(",")
    .map(getLayerIndex)
    .filter((i) => i >= 0);
  const image = await generatePNG(hash, 32, { layerIndices });
  const pixels = await sharp(image)
    .raw()
    .toBuffer()
    .then((buffer) => _.chunk(Array.from(buffer.values()), 4).map((channels) => formatColor(channels, format)));

  return res.send(pixels);
}
