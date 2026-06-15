import { Contract, Wallet } from "ethers";
import { provider } from "./provider";


export const CONTRACT_ADDRESS =
  "0xA61f6EE9ef28AE31d3585417Ba3cf7030fcA81D5";

export const VOTING_ABI = [
  "function vote()",
  "function totalVotes() view returns(uint256)",
];

export async function getVotes() {
  const contract = new Contract(
    CONTRACT_ADDRESS,
    VOTING_ABI,
    provider
  );

  const votes =
    await contract.totalVotes();

  return Number(votes);
}

export async function vote(
  privateKey: string
) {
  const wallet = new Wallet(
    privateKey,
    provider
  );

  const contract = new Contract(
    CONTRACT_ADDRESS,
    VOTING_ABI,
    wallet
  );

  const tx =
    await contract.vote();

  await tx.wait();

  return tx.hash;
}