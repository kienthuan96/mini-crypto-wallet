// src/lib/blockchain.ts

import { formatEther } from "ethers";
import { provider } from "./provider";

export async function getBalance(address: string) {
  const balance = await provider.getBalance(address);

  return formatEther(balance);
}