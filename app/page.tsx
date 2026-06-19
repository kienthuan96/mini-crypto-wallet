"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "@/components/sidebar/Sidebar";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletTab from "@/components/activity/WalletTab";
import ActivityTab from "@/components/activity/ActivityTab";
import TokenTab from "@/components/activity/TokenTab";

import { blockchain } from "@/services/blockchain";

import { useWallet } from "@/hooks/useWallet";
import { useBalance } from "@/hooks/useBalance";
import { useTxHistory } from "@/hooks/useTxHistory";
import { useTokens } from "@/hooks/useTokens";

export default function HomePage() {
  // ---------------- UI STATE ----------------
  const [tab, setTab] = useState<
    "wallet" | "activity" | "tokens"
  >("wallet");

  const [collapsed, setCollapsed] =
    useState(false);

  const [network, setNetwork] =
    useState("Polygon Amoy");

  const [tokenTo, setTokenTo] =
    useState("");

  const [tokenAmount, setTokenAmount] =
    useState("");

  const [sendingToken, setSendingToken] =
    useState(false);

  // ---------------- HOOKS ----------------
  const {
    balance,
    votes,
    loadWalletData,
  } = useBalance();

  const {
    walletInfo,
    privateKey,
    setPrivateKey,
    mnemonic,
    setMnemonic,
    create,
    importPK,
    importMn,
    copyAddress,
  } = useWallet(loadWalletData);

  const { history, addTx } =
    useTxHistory();

  const {
    tokens,
    addToken,
  } = useTokens();

  // ---------------- TOKEN BALANCES ----------------
  const [tokenBalances, setTokenBalances] =
    useState<Record<string, string>>({});

  useEffect(() => {
    const loadTokenBalances =
      async () => {
        if (!walletInfo) return;

        const balances: Record<
          string,
          string
        > = {};

        for (const token of tokens) {
          try {
            balances[token.address] =
              await blockchain.getTokenBalance(
                token.address,
                walletInfo.address
              );
          } catch {
            balances[token.address] = "0";
          }
        }

        setTokenBalances(balances);
      };

    loadTokenBalances();
  }, [tokens, walletInfo]);

  // ---------------- SEND BMT ----------------
  const sendBMT = async () => {
    if (!walletInfo)
      return toast.error("No wallet");

    try {
      setSendingToken(true);

      const hash =
        await blockchain.sendBMT(
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

      await loadWalletData(
        walletInfo.address
      );

      toast.success("BMT sent");
    } catch (e: any) {
      toast.error(
        e?.message || "Send failed"
      );
    } finally {
      setSendingToken(false);
    }
  };

  const openExplorer = (
    hash: string
  ) => {
    window.open(
      `https://amoy.polygonscan.com/tx/${hash}`,
      "_blank"
    );
  };

  const importToken = async (
    address: string
  ) => {
    try {
      const token =
        await blockchain.getTokenInfo(
          address
        );

      addToken(token);

      toast.success(
        `${token.symbol} imported`
      );
    } catch (e: any) {
      toast.error(
        e?.message ||
          "Invalid token contract"
      );
    }
  };

  return (
    <main className="h-screen flex bg-[#0b0e17] text-white">
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
            nativeBalance={balance}
            tokens={tokens}
            tokenBalances={tokenBalances}
            importToken={importToken}
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