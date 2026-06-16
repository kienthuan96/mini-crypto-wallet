import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";

const client = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
});

const ERC20_ABI = [
  {
    type: "function",
    stateMutability: "view",
    name: "balanceOf",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "decimals",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
  },
] as const;

export async function getTokenBalance(
  tokenAddress: `0x${string}`,
  walletAddress: `0x${string}`
) {
  const balance = await client.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [walletAddress],
  });

  const decimals = await client.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  return (
    Number(balance) /
    Math.pow(10, Number(decimals))
  ).toString();
}