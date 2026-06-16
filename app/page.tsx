"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import {
  createWallet,
  importFromMnemonic,
  importFromPrivateKey,
} from "@/lib/wallet";

import { getBalance } from "@/lib/blockchain";
import { getVotes, vote } from "@/lib/voting";

type WalletInfo = {
  address: string;
  privateKey: string;
  mnemonic?: string;
};

type TxItem = {
  hash: string;
  type: "send" | "vote";
  timestamp: number;
  status: "success" | "failed";
  amount?: string;
  to?: string;
};

export default function HomePage() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState("0");
  const [votes, setVotes] = useState(0);

  const [history, setHistory] = useState<TxItem[]>([]);
  const [tab, setTab] = useState<"wallet" | "activity" | "tokens">("wallet");

  const [collapsed, setCollapsed] = useState(false);

  const [privateKey, setPrivateKey] = useState("");
  const [mnemonic, setMnemonic] = useState("");

  const [network, setNetwork] = useState("Polygon Amoy");

  useEffect(() => {
    const saved = localStorage.getItem("tx_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    loadVotes();
  }, []);

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

  const addTx = (tx: TxItem) => {
    setHistory((prev) => {
      const updated = [tx, ...prev];
      localStorage.setItem("tx_history", JSON.stringify(updated));
      return updated;
    });
  };

  // ---------------- WALLET ----------------
  const create = async () => {
    const w = createWallet();
    setWalletInfo(w);
    await loadBalance(w.address);
    toast.success("Wallet created");
  };

  const importPK = async () => {
    try {
      const w = importFromPrivateKey(privateKey);
      setWalletInfo(w);
      await loadBalance(w.address);
      toast.success("Imported");
    } catch {
      toast.error("Invalid private key");
    }
  };

  const importMn = async () => {
    try {
      const w = importFromMnemonic(mnemonic);
      setWalletInfo(w);
      await loadBalance(w.address);
      toast.success("Imported");
    } catch {
      toast.error("Invalid mnemonic");
    }
  };

  // ---------------- COPY ----------------
  const copyAddress = () => {
    if (!walletInfo) return;
    navigator.clipboard.writeText(walletInfo.address);
    toast.success("Address copied");
  };

  const openExplorer = (hash: string) => {
    if (hash === "failed") return;
    window.open(
      `https://amoy.polygonscan.com/tx/${hash}`,
      "_blank"
    );
  };

  const MenuItem = ({ label, active, onClick }: any) => (
    <div
      onClick={onClick}
      className={`px-3 py-2 rounded-xl cursor-pointer transition-all text-sm
      ${
        active
          ? "bg-blue-600 text-white scale-[1.02]"
          : "text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </div>
  );

  return (
    <main className="h-screen flex bg-[#0b0e17] text-white">
      <Toaster />

      {/* SIDEBAR */}
      <div
        className={`bg-[#101422] border-r border-white/10 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            {!collapsed && (
              <h1 className="font-bold text-lg">
                🦊 MetaMask Clone
              </h1>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs px-2 py-1 bg-white/10 rounded-lg"
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        {/* NETWORK */}
        <div className="p-3">
          {!collapsed && (
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full bg-black/30 p-2 rounded-lg text-xs"
            >
              <option>Polygon Amoy</option>
              <option>Ethereum</option>
              <option>Localhost</option>
            </select>
          )}
        </div>

        {/* MENU */}
        <div className="flex-1 p-2 space-y-2">
          <MenuItem
            label={collapsed ? "W" : "Wallet"}
            active={tab === "wallet"}
            onClick={() => setTab("wallet")}
          />

          <MenuItem
            label={collapsed ? "A" : "Activity"}
            active={tab === "activity"}
            onClick={() => setTab("activity")}
          />

          <MenuItem
            label={collapsed ? "T" : "Tokens"}
            active={tab === "tokens"}
            onClick={() => setTab("tokens")}
          />
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={create}
            className="w-full bg-blue-600 py-2 rounded-xl text-xs hover:scale-[1.02] transition"
          >
            {collapsed ? "+" : "Create Wallet"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* WALLET HEADER */}
        {walletInfo && (
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
                className="text-xs px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20"
              >
                Copy
              </button>
            </div>

            <div className="mt-3">
              <p className="text-xs text-gray-400">
                Balance
              </p>
              <p className="text-xl font-bold">
                {balance} POL
              </p>
            </div>
          </div>
        )}

        {/* WALLET TAB */}
        {tab === "wallet" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
              <h2 className="font-bold mb-3">
                Import Wallet
              </h2>

              <input
                className="w-full p-2 bg-black/30 rounded mb-2"
                placeholder="Private Key"
                value={privateKey}
                onChange={(e) =>
                  setPrivateKey(e.target.value)
                }
              />

              <button
                onClick={importPK}
                className="w-full bg-white/10 py-2 rounded-xl mb-3 hover:bg-white/20"
              >
                Import
              </button>

              <textarea
                className="w-full p-2 bg-black/30 rounded"
                placeholder="Mnemonic"
                value={mnemonic}
                onChange={(e) =>
                  setMnemonic(e.target.value)
                }
              />

              <button
                onClick={importMn}
                className="w-full mt-2 bg-white/10 py-2 rounded-xl hover:bg-white/20"
              >
                Import Mnemonic
              </button>
            </div>

            <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
              <h2 className="font-bold mb-3">
                Quick Info
              </h2>

              <p className="text-sm text-gray-400">
                Network
              </p>
              <p className="mb-3">{network}</p>

              <p className="text-sm text-gray-400">
                Votes
              </p>
              <p>{votes}</p>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {tab === "activity" && (
          <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
            <h2 className="font-bold mb-4">
              Activity
            </h2>

            {history.length === 0 ? (
              <p className="text-gray-400">
                No transactions yet
              </p>
            ) : (
              history.map((tx, i) => (
                <div
                  key={i}
                  className="p-3 mb-2 bg-black/30 rounded-xl border border-white/10 hover:bg-white/5"
                >
                  <div className="flex justify-between">
                    <p>
                      {tx.type === "send"
                        ? "📤 Send"
                        : "🗳 Vote"}
                    </p>

                    <span
                      className="text-blue-400 text-xs cursor-pointer"
                      onClick={() =>
                        openExplorer(tx.hash)
                      }
                    >
                      Explorer ↗
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 break-all">
                    {tx.hash}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TOKENS TAB */}
        {tab === "tokens" && (
          <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
            <h2 className="font-bold mb-4">
              Tokens
            </h2>

            <div className="text-gray-400 text-sm">
              🪙 POL: {balance}
            </div>

            <div className="text-gray-500 text-xs mt-2">
              (mock token list — upgrade ERC20 later)
            </div>
          </div>
        )}
      </div>
    </main>
  );
}