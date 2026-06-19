import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";

import {
  Contract,
  Wallet,
  parseUnits,
} from "ethers";

import { provider } from "./provider";

export const client =
  createPublicClient({
    chain: polygonAmoy,
    transport: http(),
  });

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "uint8",
      },
    ],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "bool",
      },
    ],
  },
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
] as const;

export async function getTokenBalance(
  tokenAddress: `0x${string}`,
  walletAddress: `0x${string}`
) {
  const balance =
    await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [walletAddress],
    });

  const decimals =
    await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    });

  return (
    Number(balance) /
    10 ** Number(decimals)
  ).toString();
}

export async function sendToken(
  tokenAddress: string,
  privateKey: string,
  to: string,
  amount: string
) {
  const wallet = new Wallet(
    privateKey,
    provider
  );

  const contract = new Contract(
    tokenAddress,
    [
      "function transfer(address to,uint256 amount) returns(bool)",
      "function decimals() view returns(uint8)",
    ],
    wallet
  );

  const decimals =
    await contract.decimals();

  const tx =
    await contract.transfer(
      to,
      parseUnits(
        amount,
        Number(decimals)
      )
    );

  await tx.wait();

  return tx.hash;
}

export async function getTokenInfo(
  tokenAddress: `0x${string}`
) {
  const [name, symbol, decimals] =
    await Promise.all([
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "name",
      }),
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "symbol",
      }),
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);

  return {
    address: tokenAddress,
    name,
    symbol,
    decimals: Number(decimals),
  };
}