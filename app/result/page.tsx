"use client";

import { useEffect, useState } from "react";
import { Contract, JsonRpcProvider } from "ethers";

const CONTRACT_ADDRESS =
  "0xA61f6EE9ef28AE31d3585417Ba3cf7030fcA81D5";

const ABI = [
  "function totalVotes() view returns (uint256)",
];

export default function ResultPage() {
  const [votes, setVotes] = useState<string>("...");

  useEffect(() => {
    async function loadVotes() {
      try {
        const provider = new JsonRpcProvider(
          "https://rpc-amoy.polygon.technology"
        );

        const contract = new Contract(
          CONTRACT_ADDRESS,
          ABI,
          provider
        );

        const result = await contract.totalVotes();
        setVotes(result.toString());
      } catch (err) {
        console.error(err);
        setVotes("error");
      }
    }

    loadVotes();
  }, []);

  return (
    <div className="p-10 text-center space-y-4">
      <h1 className="text-2xl font-bold">
        Voting Result
      </h1>

      <p className="text-xl">
        Total Votes: {votes}
      </p>
    </div>
  );
}