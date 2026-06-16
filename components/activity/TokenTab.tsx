"use client";

type Props = {
  bmtBalance: string;

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
  bmtBalance,
  tokenTo,
  setTokenTo,
  tokenAmount,
  setTokenAmount,
  sendingToken,
  sendBMT,
}: Props) {
  return (
    <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
      <h2 className="font-bold mb-4">
        Tokens
      </h2>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-black/30">
          <div className="text-sm text-gray-400">
            Token
          </div>

          <div className="text-xl font-bold">
            🏸 BMT
          </div>

          <div className="text-green-400 mt-1">
            {bmtBalance}
          </div>
        </div>

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
  );
}