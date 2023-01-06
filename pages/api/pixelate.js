// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sharp from "sharp";
// import svg2png from "svg2png";
import { erc721 } from "../../web3/contracts";

const decodeURI = (dataURI, mimeType = "application/json") =>
  Buffer.from(dataURI.replace(`data:${mimeType};base64,`, ""), "base64");

const fetchMetadata = async (contractAddress, tokenId) => {
  const contract = erc721(contractAddress);
  const tokenURI = await contract.tokenURI(tokenId);

  if (tokenURI.startsWith("data:application/json;base64")) {
    return decodeURI(tokenURI).toString();
  } else {
    return fetch(tokenURI).then((res) => res.text());
  }
};

const fetchImage = async (metadata) => {
  const base64Regexp = /^data:(?<mimeType>image\/.*?);base64/;
  let base64 = metadata.image.match(base64Regexp);
  if (base64) {
    // TODO: generic method to render svg data to png
    return decodeURI(metadata.image, base64.groups.mimeType);
  } else {
    return fetch(metadata.image)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => Buffer.from(arrayBuffer));
  }
};

const pixelate = async (imageBuffer, size) => {
  // if (imageBuffer.toString().startsWith("<svg")) {
  //   imageBuffer = await svg2png(imageBuffer, { width: size });
  // }

  return sharp(imageBuffer).resize(size).toBuffer();
};

export default async function handler(req, res) {
  const { contract, tokenId, size } = req.query;
  const metadata = await fetchMetadata(contract, tokenId).then((metadata) => JSON.parse(metadata));
  const imageBuffer = await fetchImage(metadata);

  const pixelated = await pixelate(imageBuffer, parseInt(size) || 32);

  res.setHeader("Content-Type", "image/png");
  return res.send(pixelated);
}
