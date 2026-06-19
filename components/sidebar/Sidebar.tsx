import MenuItem from "../common/MenuItem";

type Props = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;

  tab: string;
  setTab: (v: any) => void;

  network: string;
  setNetwork: (v: string) => void;

  create: () => void;
};

export default function Sidebar({
  collapsed,
  setCollapsed,
  tab,
  setTab,
  network,
  setNetwork,
  create,
}: Props) {
  return (
    <div
      className={`
      bg-[#101422]
      border-r
      border-white/10
      flex
      flex-col
      transition-all
      duration-300
      ${collapsed ? "w-20" : "w-64"}
    `}
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between">
          {!collapsed && (
            <h1 className="font-bold">
              🐭 MouseWallet
            </h1>
          )}

          <button
            onClick={() =>
              setCollapsed(!collapsed)
            }
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      <div className="p-3">
        {!collapsed && (
          <select
            value={network}
            onChange={(e) =>
              setNetwork(
                e.target.value
              )
            }
          >
            <option>
              Polygon Amoy
            </option>
            <option>
              Ethereum
            </option>
          </select>
        )}
      </div>

      <div className="flex-1 p-2 space-y-2">
        <MenuItem
          label={
            collapsed
              ? "W"
              : "Wallet"
          }
          active={tab === "wallet"}
          onClick={() =>
            setTab("wallet")
          }
        />

        <MenuItem
          label={
            collapsed
              ? "A"
              : "Activity"
          }
          active={
            tab === "activity"
          }
          onClick={() =>
            setTab("activity")
          }
        />

        <MenuItem
          label={
            collapsed
              ? "T"
              : "Tokens"
          }
          active={
            tab === "tokens"
          }
          onClick={() =>
            setTab("tokens")
          }
        />
      </div>

      <div className="p-3">
        <button
          onClick={create}
          className="w-full bg-blue-600 py-2 rounded-xl"
        >
          Create Wallet
        </button>
      </div>
    </div>
  );
}