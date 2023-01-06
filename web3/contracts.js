import { ethers } from "ethers";
import provider from "./provider";

import SkullsABI from "../abi/1337Skulls.json";

const getContract = (address, abi) => {
  return new ethers.Contract(address, abi, provider);
};

export const skulls = getContract(process.env.NEXT_PUBLIC_1337_SKULLS_CONTRACT_ADDRESS, SkullsABI, provider);
