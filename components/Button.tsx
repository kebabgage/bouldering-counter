export function Button({
  onClick,
  children,
  color,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  color: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: color }}
      className="flex size-16 items-center justify-center rounded-full border-2 border-black text-2xl font-bold text-black disabled:opacity-50"
    >
      {children}
    </button>
  );
}
