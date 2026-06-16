import { useState } from "react";
import toast from "react-hot-toast";

import {
  createWallet,
  importFromMnemonic,
  importFromPrivateKey,
} from "@/lib/wallet";

type WalletInfo = {
  address: string;
  privateKey: string;
  mnemonic?: string;
};

export function useWallet(loadWalletData: (addr: string) => Promise<void>) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [privateKey, setPrivateKey] = useState("");
  const [mnemonic, setMnemonic] = useState("");

  const create = async () => {
    const w = createWallet();
    setWalletInfo(w);

    await loadWalletData(w.address);
    toast.success("Wallet created");
  };

  const importPK = async () => {
    try {
      const w = importFromPrivateKey(privateKey);
      setWalletInfo(w);

      await loadWalletData(w.address);
      toast.success("Imported");
    } catch {
      toast.error("Invalid private key");
    }
  };

  const importMn = async () => {
    try {
      const w = importFromMnemonic(mnemonic);
      setWalletInfo(w);

      await loadWalletData(w.address);
      toast.success("Imported");
    } catch {
      toast.error("Invalid mnemonic");
    }
  };

  const copyAddress = () => {
    if (!walletInfo) return;
    navigator.clipboard.writeText(walletInfo.address);
    toast.success("Address copied");
  };

  return {
    walletInfo,
    setWalletInfo,
    privateKey,
    setPrivateKey,
    mnemonic,
    setMnemonic,
    create,
    importPK,
    importMn,
    copyAddress,
  };
}