// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { XMLParser } from "fast-xml-parser";
import sharp from "sharp";
import { skulls } from "../../../web3/contracts";

const decodeURI = (dataURI, mimeType = "application/json") =>
  Buffer.from(dataURI.replace(`data:${mimeType};base64,`, ""), "base64");

const generatePNG = async (tokenId, size = 1024) => {
  const parser = new XMLParser({ ignoreAttributes: false });

  const uriRegexp = /url\((?<dataURI>data:(?<mimeType>image\/.*?);base64,.*?\))/g;

  return skulls
    .tokenIdToSVG(tokenId)
    .then((svg) => decodeURI(svg, "image/svg+xml"))
    .then((imageData) => parser.parse(imageData).svg["@_style"].matchAll(uriRegexp)) // extract css background images
    .then((matches) => Array.from(matches, (match) => decodeURI(match.groups.dataURI, match.groups.mimeType)).reverse())
    .then(([background, ...layers]) =>
      sharp(background)
        .composite(layers.map((layer) => ({ input: layer })))
        .toBuffer()
    )
    .then((imageBuffer) => sharp(imageBuffer).resize(size, size, { kernel: "nearest" }).toFormat("png").toBuffer());
};

export default async function handler(req, res) {
  const { tokenId } = req.query;
  const image = await generatePNG(tokenId);

  res.setHeader("Content-Type", "image/png");
  return res.send(image);
}
