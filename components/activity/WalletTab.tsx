"use client";

type Props = {
  privateKey: string;
  setPrivateKey: (
    value: string
  ) => void;

  mnemonic: string;
  setMnemonic: (
    value: string
  ) => void;

  importPK: () => void;
  importMn: () => void;

  network: string;
  votes: number;
};

export default function WalletTab({
  privateKey,
  setPrivateKey,
  mnemonic,
  setMnemonic,
  importPK,
  importMn,
  network,
  votes,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-[#141826] rounded-2xl border border-white/10">
        <h2 className="font-bold mb-3">
          Import Wallet
        </h2>

        <input
          className="
            w-full
            p-2
            bg-black/30
            rounded
            mb-2
          "
          placeholder="Private Key"
          value={privateKey}
          onChange={(e) =>
            setPrivateKey(
              e.target.value
            )
          }
        />

        <button
          onClick={importPK}
          className="
            w-full
            bg-white/10
            py-2
            rounded-xl
            mb-3
          "
        >
          Import
        </button>

        <textarea
          className="
            w-full
            p-2
            bg-black/30
            rounded
          "
          placeholder="Mnemonic"
          value={mnemonic}
          onChange={(e) =>
            setMnemonic(
              e.target.value
            )
          }
        />

        <button
          onClick={importMn}
          className="
            w-full
            mt-2
            bg-white/10
            py-2
            rounded-xl
          "
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

        <p>{network}</p>

        <p className="text-sm text-gray-400 mt-3">
          Votes
        </p>

        <p>{votes}</p>
      </div>
    </div>
  );
}