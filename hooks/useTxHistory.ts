import { useState, useEffect } from "react";

type TxItem = {
  hash: string;
  type: "send" | "vote";
  timestamp: number;
  status: "success" | "failed";
  amount?: string;
  to?: string;
};

export function useTxHistory() {
  const [history, setHistory] = useState<TxItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tx_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addTx = (tx: TxItem) => {
    setHistory((prev) => {
      const updated = [tx, ...prev];
      localStorage.setItem("tx_history", JSON.stringify(updated));
      return updated;
    });
  };

  return {
    history,
    addTx,
  };
}