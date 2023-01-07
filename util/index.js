import { XMLParser } from "fast-xml-parser";
import sharp from "sharp";
import { skulls } from "../web3/contracts";

const decodeURI = (dataURI, mimeType = "application/json") =>
  Buffer.from(dataURI.replace(`data:${mimeType};base64,`, ""), "base64");

export const generatePNG = async (hash, size) => {
  const parser = new XMLParser({ ignoreAttributes: false });

  const uriRegexp = /url\((?<dataURI>data:(?<mimeType>image\/.*?);base64,.*?\))/g;

  return skulls
    .hashToSVG(hash)
    .then((svg) => decodeURI(svg, "image/svg+xml"))
    .then((imageData) => parser.parse(imageData).svg["@_style"].matchAll(uriRegexp)) // extract css background images
    .then((matches) => Array.from(matches, (match) => decodeURI(match.groups.dataURI, match.groups.mimeType)).reverse())
    .then((layers) => Promise.all(layers.map((layer) => sharp(layer).toFormat("png").toBuffer())))
    .then(([background, ...layers]) =>
      sharp(background)
        .composite(layers.map((layer) => ({ input: layer })))
        .toBuffer()
    )
    .then((imageBuffer) => sharp(imageBuffer).resize(size, size, { kernel: "nearest" }).toFormat("png").toBuffer());
};
