import { useState, useEffect } from "react";
import { blockchain } from "@/services/blockchain";

export function useBalance() {
  const [balance, setBalance] = useState("0");
  const [bmtBalance, setBmtBalance] = useState("0");
  const [votes, setVotes] = useState(0);

  const loadVotes = async () => {
    const v = await blockchain.getVotes();
    setVotes(v);
  };

  const loadBalance = async (address: string) => {
    const b = await blockchain.getNativeBalance(address);
    setBalance(b);
  };

  const loadTokens = async (address: string) => {
    const bmt = await blockchain.getBMTBalance(address);
    setBmtBalance(bmt);
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