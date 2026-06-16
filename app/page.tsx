"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Sidebar from "@/components/sidebar/Sidebar";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletTab from "@/components/activity/WalletTab";
import ActivityTab from "@/components/activity/ActivityTab";
import TokenTab from "@/components/activity/TokenTab";

import { sendToken } from "@/lib/token";

import { useWallet } from "@/hooks/useWallet";
import { useBalance } from "@/hooks/useBalance";
import { useTxHistory } from "@/hooks/useTxHistory";

export default function HomePage() {
  const [tab, setTab] = useState<"wallet" | "activity" | "tokens">("wallet");
  const [collapsed, setCollapsed] = useState(false);
  const [network, setNetwork] = useState("Polygon Amoy");

  const [tokenTo, setTokenTo] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [sendingToken, setSendingToken] = useState(false);

  // ---------------- HOOKS ----------------
  const { balance, bmtBalance, votes, loadWalletData } = useBalance();

  const {
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
  } = useWallet(loadWalletData);

  const { history, addTx } = useTxHistory();

  // ---------------- SEND TOKEN ----------------
  const sendBMT = async () => {
    if (!walletInfo) return toast.error("No wallet");

    try {
      setSendingToken(true);

      const hash = await sendToken(
        "0xc61ff70FeB6a55c20840742Ce00F3D89743c0fdD",
        walletInfo.privateKey,
        tokenTo,
        tokenAmount
      );

      addTx({
        hash,
        type: "send",
        timestamp: Date.now(),
        status: "success",
        amount: tokenAmount,
        to: tokenTo,
      });

      await loadWalletData(walletInfo.address);

      toast.success("BMT sent");
    } catch (e: any) {
      toast.error(e?.message || "Send failed");
    } finally {
      setSendingToken(false);
    }
  };

  const openExplorer = (hash: string) => {
    window.open(
      `https://amoy.polygonscan.com/tx/${hash}`,
      "_blank"
    );
  };

  return (
    <main className="h-screen flex bg-[#0b0e17] text-white">
      <Toaster />

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        tab={tab}
        setTab={setTab}
        network={network}
        setNetwork={setNetwork}
        create={create}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <WalletHeader
          walletInfo={walletInfo}
          balance={balance}
          copyAddress={copyAddress}
        />

        {tab === "wallet" && (
          <WalletTab
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            mnemonic={mnemonic}
            setMnemonic={setMnemonic}
            importPK={importPK}
            importMn={importMn}
            network={network}
            votes={votes}
          />
        )}

        {tab === "activity" && (
          <ActivityTab
            history={history}
            openExplorer={openExplorer}
          />
        )}

        {tab === "tokens" && (
          <TokenTab
            bmtBalance={bmtBalance}
            tokenTo={tokenTo}
            setTokenTo={setTokenTo}
            tokenAmount={tokenAmount}
            setTokenAmount={setTokenAmount}
            sendingToken={sendingToken}
            sendBMT={sendBMT}
          />
        )}
      </div>
    </main>
  );
}