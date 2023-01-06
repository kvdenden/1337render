// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { skulls } from "../../../web3/contracts";
import { baseURI } from "../../../util/baseURI";

const IMAGE_BASE_URI = process.env.NEXT_PUBLIC_IMAGE_BASE_URI || baseURI + "/api/image/";

export default async function handler(req, res) {
  const { tokenId } = req.query;

  const metadata = await skulls
    .tokenURI(tokenId)
    .then((tokenURI) => Buffer.from(tokenURI.replace("data:application/json;base64,", ""), "base64"))
    .then((buffer) => JSON.parse(buffer.toString()));

  const { name, description, attributes } = metadata;
  const image = IMAGE_BASE_URI + `${tokenId}.png`;

  return res.send({
    name,
    description,
    image,
    attributes,
  });
}
