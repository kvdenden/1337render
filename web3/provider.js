import { ethers } from "ethers";

export default new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URI);
