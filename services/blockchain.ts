import { getBalance } from "@/lib/blockchain";
import { getVotes } from "@/lib/voting";
import {
  getTokenBalance,
  sendToken,
} from "@/lib/token";

const TOKENS = {
  BMT: process.env.NEXT_PUBLIC_BMT_ADDRESS!,
};

export const blockchain = {
  // ---------------- CORE ----------------
  getNativeBalance: async (address: string) => {
    return await getBalance(address);
  },

  getVotes: async () => {
    return await getVotes();
  },

  // ---------------- TOKEN ----------------
  getBMTBalance: async (address: string) => {
    return await getTokenBalance(
      TOKENS.BMT as `0x${string}`,
      address as `0x${string}`
    );
  },

  sendBMT: async (
    privateKey: string,
    to: string,
    amount: string
  ) => {
    return await sendToken(
      TOKENS.BMT,
      privateKey,
      to,
      amount
    );
  },
};