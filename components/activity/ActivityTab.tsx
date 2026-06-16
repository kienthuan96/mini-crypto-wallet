"use client";

type TxItem = {
  hash: string;
  type: "send" | "vote";
  timestamp: number;
  status: "success" | "failed";
  amount?: string;
  to?: string;
};

type Props = {
  history: TxItem[];
  openExplorer: (
    hash: string
  ) => void;
};

export default function ActivityTab({
  history,
  openExplorer,
}: Props) {
  return (
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
            className="
              p-3
              mb-2
              bg-black/30
              rounded-xl
              border
              border-white/10
            "
          >
            <div className="flex justify-between">
              <p>
                {tx.type === "send"
                  ? "📤 Send"
                  : "🗳 Vote"}
              </p>

              <span
                onClick={() =>
                  openExplorer(
                    tx.hash
                  )
                }
                className="
                  text-blue-400
                  text-xs
                  cursor-pointer
                "
              >
                Explorer ↗
              </span>
            </div>

            <p className="text-xs text-gray-400 break-all mt-2">
              {tx.hash}
            </p>
          </div>
        ))
      )}
    </div>
  );
}