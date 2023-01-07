// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sharp from "sharp";
import _ from "lodash";
import { skulls } from "../../web3/contracts";
import { generatePNG } from "../../util";

const hex = (r, g, b) => "#" + [r, g, b].map((i) => i.toString(16).padStart(2, "0")).join("");
const rgb = (r, g, b) => `rgb(${r},${g},${b})`;
const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;

const formatColor = (channels, format) => {
  switch (format) {
    case "hex":
      return hex(...channels);
    case "rgb":
      return rgb(...channels);
    default:
      return rgba(...channels);
  }
};

export default async function handler(req, res) {
  const { tokenId, format = "hex" } = req.query;
  const hash = tokenId ? await skulls.tokenIdToHash(tokenId) : req.query.hash;
  const image = await generatePNG(hash, 32);
  const pixels = await sharp(image)
    .raw()
    .toBuffer()
    .then((buffer) => _.chunk(Array.from(buffer.values()), 4).map((channels) => formatColor(channels, format)));

  return res.send(pixels);
}
