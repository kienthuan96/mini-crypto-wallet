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
  const [tokens, setTokens] = useState<
    TokenInfo[]
  >([]);

  const [
    lastRemoved,
    setLastRemoved,
  ] = useState<TokenInfo | null>(
    null
  );

  useEffect(() => {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (saved) {
      setTokens(JSON.parse(saved));
    }
  }, []);

  const save = (
    next: TokenInfo[]
  ) => {
    setTokens(next);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );
  };

  const addToken = (token: TokenInfo) => {
    setTokens((prev) => {
        const exists = prev.some(
        (t) =>
            t.address.toLowerCase() === token.address.toLowerCase()
        );

        if (exists) return prev;

        const next = [...prev, token];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

        return next;
    });
    };

  const removeToken = (address: string) => {
    setTokens((prev) => {
        const token = prev.find(
            (t) => t.address.toLowerCase() === address.toLowerCase()
            );

            if (!token) return prev;

            setLastRemoved(token);

            const next = prev.filter(
            (t) => t.address.toLowerCase() !== address.toLowerCase()
            );

            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

            return next;
        });
    };

  const restoreToken = () => {
    setTokens((prev) => {
        if (!lastRemoved) return prev;

        const exists = prev.some(
        (t) =>
            t.address.toLowerCase() ===
            lastRemoved.address.toLowerCase()
        );

        if (exists) return prev;

        const next = [...prev, lastRemoved];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

        setLastRemoved(null);

        return next;
    });
    };

  return {
    tokens,
    addToken,
    removeToken,
    restoreToken,
    lastRemoved,
  };
}