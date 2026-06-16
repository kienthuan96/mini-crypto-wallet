import { useState, useEffect } from "react";

import { getBalance } from "@/lib/blockchain";
import { getTokenBalance } from "@/lib/token";
import { getVotes } from "@/lib/voting";

const TOKENS = [
  {
    symbol: "BMT",
    address: "0xc61ff70FeB6a55c20840742Ce00F3D89743c0fdD",
  },
];

export function useBalance() {
  const [balance, setBalance] = useState("0");
  const [bmtBalance, setBmtBalance] = useState("0");
  const [votes, setVotes] = useState(0);

  const loadVotes = async () => {
    try {
      const t = await getVotes();
      setVotes(t);
    } catch {}
  };

  const loadBalance = async (addr: string) => {
    try {
      const b = await getBalance(addr);
      setBalance(b);
    } catch {}
  };

  const loadTokens = async (address: string) => {
    try {
      const bmt = await getTokenBalance(
        TOKENS[0].address as `0x${string}`,
        address as `0x${string}`
      );
      setBmtBalance(bmt);
    } catch (e) {
      console.error(e);
    }
  };

  const loadWalletData = async (address: string) => {
    await Promise.all([
      loadBalance(address),
      loadTokens(address),
    ]);
  };

  useEffect(() => {
    loadVotes();
  }, []);

  return {
    balance,
    bmtBalance,
    votes,
    loadWalletData,
  };
}