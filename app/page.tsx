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
import {
  useTokens,
  type TokenInfo,
} from "@/hooks/useTokens";

export default function HomePage() {
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
    removeToken,
  } = useTokens();

  const [tokenBalances, setTokenBalances] =
    useState<Record<string, string>>(
      {}
    );

  const [removeTimer, setRemoveTimer] =
    useState<NodeJS.Timeout | null>(
      null
    );

  // ---------------- TOKEN BALANCES ----------------
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
            balances[token.address] =
              "0";
          }
        }

        setTokenBalances(
          balances
        );
      };

    loadTokenBalances();
  }, [tokens, walletInfo]);

  // ---------------- SEND TOKEN ----------------
  const sendBMT = async () => {
    if (!walletInfo)
      return toast.error(
        "No wallet"
      );

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
        e?.message ||
          "Send failed"
      );
    } finally {
      setSendingToken(false);
    }
  };

  // ---------------- EXPLORER ----------------
  const openExplorer = (
    hash: string
  ) => {
    window.open(
      `https://amoy.polygonscan.com/tx/${hash}`,
      "_blank"
    );
  };

  // ---------------- IMPORT TOKEN ----------------
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

  // ---------------- REMOVE TOKEN + UNDO ----------------
  const handleRemoveToken = (
    token: TokenInfo
  ) => {
    removeToken(
      token.address
    );

    if (removeTimer) {
      clearTimeout(
        removeTimer
      );
    }

    const timer = setTimeout(
      () => {},
      5000
    );

    setRemoveTimer(timer);

    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span>
            {token.symbol} removed
          </span>

          <button
            onClick={() => {
              addToken(token);

              clearTimeout(
                timer
              );

              toast.dismiss(
                t.id
              );

              toast.success(
                `${token.symbol} restored`
              );
            }}
            className="
              px-3
              py-1.5
              text-xs
              font-medium
              rounded-md
              bg-blue-600
              text-white
              shadow-sm
              hover:bg-blue-500
              active:scale-95
              transition-all
              duration-150
              focus:outline-none
              focus:ring-2
              focus:ring-blue-400
              focus:ring-offset-1
            "
          >
            Undo
          </button>
        </div>
      ),
      {
        duration: 5000,
      }
    );
  };

  return (
    <main className="h-screen flex bg-[#0b0e17] text-white">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={
          setCollapsed
        }
        tab={tab}
        setTab={setTab}
        network={network}
        setNetwork={
          setNetwork
        }
        create={create}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <WalletHeader
          walletInfo={
            walletInfo
          }
          balance={balance}
          copyAddress={
            copyAddress
          }
        />

        {tab ===
          "wallet" && (
          <WalletTab
            privateKey={
              privateKey
            }
            setPrivateKey={
              setPrivateKey
            }
            mnemonic={
              mnemonic
            }
            setMnemonic={
              setMnemonic
            }
            importPK={
              importPK
            }
            importMn={
              importMn
            }
            network={
              network
            }
            votes={votes}
          />
        )}

        {tab ===
          "activity" && (
          <ActivityTab
            history={
              history
            }
            openExplorer={
              openExplorer
            }
          />
        )}

        {tab ===
          "tokens" && (
          <TokenTab
            nativeBalance={
              balance
            }
            tokens={tokens}
            tokenBalances={
              tokenBalances
            }
            importToken={
              importToken
            }
            removeToken={
              handleRemoveToken
            }
            tokenTo={tokenTo}
            setTokenTo={
              setTokenTo
            }
            tokenAmount={
              tokenAmount
            }
            setTokenAmount={
              setTokenAmount
            }
            sendingToken={
              sendingToken
            }
            sendBMT={
              sendBMT
            }
          />
        )}
      </div>
    </main>
  );
}