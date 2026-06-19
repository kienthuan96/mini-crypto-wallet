"use client";

type TokenInfo = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

type Props = {
  nativeBalance: string;
  bmtBalance: string;

  tokens: TokenInfo[];

  tokenBalances: Record<
    string,
    string
  >;

  tokenTo: string;
  setTokenTo: (value: string) => void;

  tokenAmount: string;
  setTokenAmount: (
    value: string
  ) => void;

  sendingToken: boolean;

  sendBMT: () => void;
};

export default function TokenTab({
  nativeBalance,
  bmtBalance,
  tokens,
  tokenBalances,
  tokenTo,
  setTokenTo,
  tokenAmount,
  setTokenAmount,
  sendingToken,
  sendBMT,
}: Props) {
  return (
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
                {nativeBalance}
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
                  {token.address.slice(0, 6)}
                  ...
                  {token.address.slice(-4)}
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-green-400">
                  {tokenBalances[
                    token.address
                  ] || "0"}
                </div>

                <div className="text-xs text-gray-500">
                  ERC20
                </div>
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
            disabled={sendingToken}
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
  );
}