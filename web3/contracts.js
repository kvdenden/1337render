import { ethers } from "ethers";
import provider from "./provider";

import Skulls from "../abi/1337Skulls.json";
import IERC721Metadata from "../abi/IERC721Metadata.json";

const getContract = (address, abi) => {
  return new ethers.Contract(address, abi, provider);
};

export const erc721 = (address) => getContract(address, IERC721Metadata, provider);
export const skulls = getContract(process.env.NEXT_PUBLIC_1337_SKULLS_CONTRACT_ADDRESS, Skulls, provider);
