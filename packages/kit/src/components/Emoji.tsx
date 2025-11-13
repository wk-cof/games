export type EmojiProps = {
  symbol: string;
  size?: string;
  label?: string;
};

export function Emoji({ symbol, size, label }: EmojiProps) {
  return (
    <span
      className="em-emoji"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={size ? { fontSize: size } : undefined}
    >
      {symbol}
    </span>
  );
}
