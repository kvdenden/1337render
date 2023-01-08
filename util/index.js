import { XMLParser } from "fast-xml-parser";
import _ from "lodash";
import sharp from "sharp";
import { skulls } from "../web3/contracts";

export const getLayerIndex = (layer) => {
  switch (layer) {
    case "5p3c141":
    case "special":
      return 0;
    case "0v32":
    case "over":
      return 1;
    case "3y35":
    case "eyes":
      return 2;
    case "und32":
    case "under":
      return 3;
    case "5ku115":
    case "skulls":
      return 4;
    case "84ck920und":
    case "background":
      return 5;
    default:
      const index = parseInt(layer);
      return index >= 0 && index <= 5 ? index : -1;
  }
};

const decodeURI = (dataURI, mimeType = "application/json") =>
  Buffer.from(dataURI.replace(`data:${mimeType};base64,`, ""), "base64");

export const generatePNG = async (hash, size, { layerIndices = [] }) => {
  const parser = new XMLParser({ ignoreAttributes: false });

  const uriRegexp = /url\((?<dataURI>data:(?<mimeType>image\/.*?);base64,.*?\))/g;

  return skulls
    .hashToSVG(hash)
    .then((svg) => decodeURI(svg, "image/svg+xml"))
    .then((imageData) => parser.parse(imageData).svg["@_style"].matchAll(uriRegexp)) // extract css background images
    .then((matches) => Array.from(matches, (match) => decodeURI(match.groups.dataURI, match.groups.mimeType)))
    .then((layers) => (layerIndices.length === 0 ? layers : layerIndices.map((i) => layers[i])))
    .then((layers) => Promise.all(layers.map((layer) => sharp(layer).toFormat("png").toBuffer()).reverse()))
    .then(([first, ...rest]) =>
      sharp(first)
        .composite(rest.map((layer) => ({ input: layer })))
        .toBuffer()
    )
    .then((imageBuffer) => sharp(imageBuffer).resize(size, size, { kernel: "nearest" }).toFormat("png").toBuffer());
};
