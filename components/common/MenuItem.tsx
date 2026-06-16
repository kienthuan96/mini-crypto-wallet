type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export default function MenuItem({
  label,
  active,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        px-3 py-2 rounded-xl
        cursor-pointer
        transition-all
        text-sm
        ${
          active
            ? "bg-blue-600 text-white"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      {label}
    </div>
  );
}