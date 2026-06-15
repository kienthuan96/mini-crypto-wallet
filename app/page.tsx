"use client";

import { useEffect, useState } from "react";
import {
  createWallet,
  importFromMnemonic,
  importFromPrivateKey,
} from "@/lib/wallet";
import { getBalance } from "@/lib/blockchain";
import { sendPOL } from "@/lib/transaction";
import {
  getVotes,
  vote,
} from "@/lib/voting";

type WalletInfo = {
  address: string;
  privateKey: string;
  mnemonic?: string;
};

export default function HomePage() {
  const [walletInfo, setWalletInfo] =
    useState<WalletInfo | null>(null);

  const [balance, setBalance] =
    useState("0");

  const [votes, setVotes] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [privateKey, setPrivateKey] =
    useState("");

  const [mnemonic, setMnemonic] =
    useState("");

  const [toAddress, setToAddress] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [txHash, setTxHash] =
    useState("");

  useEffect(() => {
    loadVotes();
  }, []);

  const loadVotes = async () => {
    try {
      const total =
        await getVotes();

      setVotes(total);
    } catch (error) {
      console.error(error);
    }
  };

  const loadBalance = async (
    address: string
  ) => {
    try {
      setLoading(true);

      const walletBalance =
        await getBalance(address);

      setBalance(walletBalance);
    } catch (error) {
      console.error(error);
      setBalance("0");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet =
    async () => {
      const wallet =
        createWallet();

      setWalletInfo(wallet);

      await loadBalance(
        wallet.address
      );
    };

  const handleImportPrivateKey =
    async () => {
      try {
        const wallet =
          importFromPrivateKey(
            privateKey
          );

        setWalletInfo(wallet);

        await loadBalance(
          wallet.address
        );
      } catch {
        alert(
          "Private Key không hợp lệ"
        );
      }
    };

  const handleImportMnemonic =
    async () => {
      try {
        const wallet =
          importFromMnemonic(
            mnemonic
          );

        setWalletInfo(wallet);

        await loadBalance(
          wallet.address
        );
      } catch {
        alert(
          "Mnemonic không hợp lệ"
        );
      }
    };

  const handleRefreshBalance =
    async () => {
      if (!walletInfo) return;

      await loadBalance(
        walletInfo.address
      );
    };

  const handleSendPOL =
    async () => {
      if (!walletInfo) return;

      try {
        setLoading(true);

        const hash =
          await sendPOL(
            walletInfo.privateKey,
            toAddress,
            amount
          );

        setTxHash(hash);

        await loadBalance(
          walletInfo.address
        );

        alert(
          "Gửi POL thành công"
        );
      } catch (error: any) {
        console.error(error);

        alert(
          error?.shortMessage ||
            error?.message ||
            "Gửi thất bại"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleVote =
    async () => {
      if (!walletInfo) {
        alert(
          "Vui lòng tạo hoặc import ví"
        );
        return;
      }

      try {
        setLoading(true);

        const hash =
          await vote(
            walletInfo.privateKey
          );

        console.log(
          "Vote tx:",
          hash
        );

        await loadVotes();

        await loadBalance(
          walletInfo.address
        );

        alert(
          "Vote thành công"
        );
      } catch (error: any) {
        console.error(error);

        alert(
          error?.shortMessage ||
            error?.message ||
            "Vote thất bại"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Mini Crypto Wallet
      </h1>

      <button
        onClick={handleCreateWallet}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Create Wallet
      </button>

      <div className="space-y-2">
        <input
          value={privateKey}
          onChange={(e) =>
            setPrivateKey(
              e.target.value
            )
          }
          placeholder="Private Key"
          className="w-full border p-2 rounded"
        />

        <button
          onClick={
            handleImportPrivateKey
          }
          className="px-4 py-2 border rounded"
        >
          Import Private Key
        </button>
      </div>

      <div className="space-y-2">
        <textarea
          value={mnemonic}
          onChange={(e) =>
            setMnemonic(
              e.target.value
            )
          }
          placeholder="Mnemonic"
          className="w-full border p-2 rounded"
        />

        <button
          onClick={
            handleImportMnemonic
          }
          className="px-4 py-2 border rounded"
        >
          Import Mnemonic
        </button>
      </div>

      <div className="border rounded p-4 space-y-3">
        <h2 className="text-xl font-bold">
          Voting DApp
        </h2>

        <p>
          Total Votes: {votes}
        </p>

        <button
          onClick={handleVote}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Vote
        </button>

        <button
          onClick={loadVotes}
          className="ml-2 px-4 py-2 border rounded"
        >
          Refresh Votes
        </button>
      </div>

      {walletInfo && (
        <div className="border rounded p-4 space-y-4">
          <div>
            <strong>
              Address:
            </strong>
            <p className="break-all">
              {walletInfo.address}
            </p>
          </div>

          <div>
            <strong>
              Balance:
            </strong>
            <p>
              {loading
                ? "Loading..."
                : `${balance} POL`}
            </p>
          </div>

          <button
            onClick={
              handleRefreshBalance
            }
            className="px-3 py-2 border rounded"
          >
            Refresh Balance
          </button>

          <hr />

          <div className="space-y-2">
            <h2 className="font-bold">
              Send POL
            </h2>

            <input
              value={toAddress}
              onChange={(e) =>
                setToAddress(
                  e.target.value
                )
              }
              placeholder="Receiver Address"
              className="w-full border p-2 rounded"
            />

            <input
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="0.1"
              className="w-full border p-2 rounded"
            />

            <button
              onClick={
                handleSendPOL
              }
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Send POL
            </button>

            {txHash && (
              <p className="break-all">
                {txHash}
              </p>
            )}
          </div>

          <hr />

          <div>
            <strong>
              Private Key:
            </strong>
            <p className="break-all">
              {
                walletInfo.privateKey
              }
            </p>
          </div>

          {walletInfo.mnemonic && (
            <div>
              <strong>
                Mnemonic:
              </strong>
              <p>
                {
                  walletInfo.mnemonic
                }
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}