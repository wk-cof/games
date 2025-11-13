import { css } from '@emotion/react';

interface LiveRegionProps {
  message: string;
}

const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export function LiveRegion({ message }: LiveRegionProps) {
  return (
    <div role="status" aria-live="polite" css={srOnly}>
      {message}
    </div>
  );
}
