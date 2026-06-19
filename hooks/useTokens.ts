import { useEffect, useState } from "react";

export type TokenInfo = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance?: string;
};

const STORAGE_KEY = "wallet_tokens";

export function useTokens() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setTokens(JSON.parse(saved));
    }
  }, []);

  const addToken = (token: TokenInfo) => {
    const exists = tokens.some(
      (t) =>
        t.address.toLowerCase() ===
        token.address.toLowerCase()
    );

    if (exists) return;

    const next = [...tokens, token];

    setTokens(next);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );
  };

  return {
    tokens,
    addToken,
  };
}