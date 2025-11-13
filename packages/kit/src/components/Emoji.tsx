import { css } from '@emotion/react';

export type EmojiProps = {
  symbol: string;
  size?: string;
  label?: string;
};

const emojiStyles = css`
  font-size: var(--emoji-emoji-size);
  line-height: 1;
`;

export function Emoji({ symbol, size, label }: EmojiProps) {
  return (
    <span
      css={emojiStyles}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={size ? { fontSize: size } : undefined}
    >
      {symbol}
    </span>
  );
}
