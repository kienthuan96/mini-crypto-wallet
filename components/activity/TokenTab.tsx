"use client";

import { useState } from "react";

type TokenInfo = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

type Props = {
  nativeBalance: string;

  tokens: TokenInfo[];

  tokenBalances: Record<string, string>;

  importToken: (
    address: string
  ) => Promise<void>;

  removeToken: (
    token: TokenInfo
  ) => void;

  tokenTo: string;
  setTokenTo: (
    value: string
  ) => void;

  tokenAmount: string;
  setTokenAmount: (
    value: string
  ) => void;

  sendingToken: boolean;

  sendBMT: () => void;
};

export default function TokenTab({
  nativeBalance,
  tokens,
  tokenBalances,
  importToken,
  removeToken,
  tokenTo,
  setTokenTo,
  tokenAmount,
  setTokenAmount,
  sendingToken,
  sendBMT,
}: Props) {
  const [contractAddress, setContractAddress] =
    useState("");

  const [removeTarget, setRemoveTarget] =
    useState<TokenInfo | null>(null);

  return (
    <>
      <div className="space-y-4">
        {/* Assets */}
        <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
          <h2 className="font-bold mb-4">
            Assets
          </h2>

          <div className="space-y-3">
            {/* POL */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex justify-between items-center">
              <div>
                <div className="font-semibold">
                  🟣 POL
                </div>

                <div className="text-xs text-gray-400">
                  Polygon Native Token
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold">
                  {Number(
                    nativeBalance || "0"
                  ).toFixed(4)}
                </div>

                <div className="text-xs text-gray-500">
                  Native
                </div>
              </div>
            </div>

            {/* Imported Tokens */}
            {tokens.map((token) => (
              <div
                key={token.address}
                className="
                  p-4
                  rounded-xl
                  bg-black/30
                  border
                  border-white/10
                  flex
                  justify-between
                  items-center
                "
              >
                <div>
                  <div className="font-semibold">
                    {token.symbol}
                  </div>

                  <div className="text-xs text-gray-400">
                    {token.name}
                  </div>

                  <div className="text-[10px] text-gray-500 mt-1">
                    {token.address.slice(
                      0,
                      6
                    )}
                    ...
                    {token.address.slice(
                      -4
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-green-400">
                      {Number(
                        tokenBalances[
                          token.address
                        ] || "0"
                      ).toLocaleString()}
                    </div>

                    <div className="text-xs text-gray-500">
                      ERC20
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setRemoveTarget(
                        token
                      )
                    }
                    className="
                      text-red-400
                      hover:text-red-300
                      text-lg
                    "
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {tokens.length === 0 && (
              <div className="text-center text-gray-500 py-6">
                No tokens imported
              </div>
            )}
          </div>
        </div>

        {/* Import Token */}
        <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
          <h2 className="font-bold mb-4">
            Import Token
          </h2>

          <input
            value={contractAddress}
            onChange={(e) =>
              setContractAddress(
                e.target.value
              )
            }
            placeholder="Contract Address"
            className="
              w-full
              p-3
              rounded-xl
              bg-black/30
              border
              border-white/10
            "
          />

          <button
            onClick={async () => {
              if (
                !contractAddress.trim()
              )
                return;

              await importToken(
                contractAddress
              );

              setContractAddress("");
            }}
            className="
              mt-3
              w-full
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-500
            "
          >
            Import Token
          </button>
        </div>

        {/* Send Token */}
        <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
          <h2 className="font-bold mb-4">
            Send BMT
          </h2>

          <div className="space-y-3">
            <input
              value={tokenTo}
              onChange={(e) =>
                setTokenTo(
                  e.target.value
                )
              }
              placeholder="Receiver Address"
              className="
                w-full
                p-3
                rounded-xl
                bg-black/30
                border
                border-white/10
              "
            />

            <input
              value={tokenAmount}
              onChange={(e) =>
                setTokenAmount(
                  e.target.value
                )
              }
              placeholder="Amount"
              className="
                w-full
                p-3
                rounded-xl
                bg-black/30
                border
                border-white/10
              "
            />

            <button
              disabled={
                sendingToken
              }
              onClick={sendBMT}
              className="
                w-full
                py-3
                rounded-xl
                bg-green-600
                hover:bg-green-500
                disabled:opacity-50
              "
            >
              {sendingToken
                ? "Sending..."
                : "Send BMT"}
            </button>
          </div>
        </div>
      </div>

      {/* Remove Modal */}
      {removeTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-[380px] bg-[#141826] rounded-2xl border border-white/10 p-6">
            <h3 className="font-bold text-lg">
              Remove Token
            </h3>

            <p className="mt-3 text-gray-400">
              Remove{" "}
              <span className="text-white font-semibold">
                {removeTarget.symbol}
              </span>{" "}
              from wallet?
            </p>

            <p className="text-xs text-gray-500 mt-2 break-all">
              {removeTarget.address}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  setRemoveTarget(
                    null
                  )
                }
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-white/10
                  hover:bg-white/20
                "
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  removeToken(
                    removeTarget
                  );

                  setRemoveTarget(
                    null
                  );
                }}
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-red-600
                  hover:bg-red-500
                "
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}