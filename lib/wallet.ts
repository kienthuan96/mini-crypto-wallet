// src/lib/wallet.ts

import { HDNodeWallet, Wallet } from "ethers";

export function createWallet() {
  const wallet = Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || "",
  };
}

export function importFromPrivateKey(privateKey: string) {
  const wallet = new Wallet(privateKey);

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

export function importFromMnemonic(mnemonic: string) {
  const wallet = HDNodeWallet.fromPhrase(mnemonic);

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: mnemonic,
  };
}