"use client";

import { useState } from "react";

type WalletInfo = {
  address: string;
  privateKey: string;
  mnemonic?: string;
};

type Props = {
  walletInfo: WalletInfo | null;
  balance: string;
  copyAddress: () => void;
};

export default function WalletHeader({
  walletInfo,
  balance,
  copyAddress,
}: Props) {

  const [showMnemonic, setShowMnemonic] = useState(false);

  if (!walletInfo) return null;

  return (
    <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400">
            Address
          </p>

          <p className="font-mono text-green-400 break-all text-sm">
            {walletInfo.address}
          </p>
        </div>

        <button
          onClick={copyAddress}
          className="text-xs px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition"
        >
          Copy
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-400">
          Balance
        </p>

        <p className="text-2xl font-bold">
          {Number(balance).toFixed(4)} POL
        </p>
      </div>

      {walletInfo.mnemonic && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Recovery Phrase
            </p>

            <button
              onClick={() =>
                setShowMnemonic(
                  !showMnemonic
                )
              }
              className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition"
            >
              {showMnemonic
                ? "Hide"
                : "Reveal"}
            </button>
          </div>

          <div className="mt-2 p-3 rounded-xl bg-black/30 border border-white/10">
            {showMnemonic ? (
              <p className="text-sm break-words leading-7">
                {walletInfo.mnemonic}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                ••••• ••••• ••••• •••••
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}