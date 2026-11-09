import React from 'react';
import { formatPhoneDisplay } from '../../utils/numberUtils';

interface PhoneNumberProps {
  phone: string | null | undefined;
  className?: string;
  showIcon?: boolean;
}

/**
 * Standard Phone Number Display Component.
 * - Forces Left-to-Right (LTR) direction via <bdi dir="ltr"> to prevent BiDi text reversal in Arabic.
 * - Strictly displays Latin digits (0-9).
 * - Proper monospace typography and copyability.
 */
export const PhoneNumber: React.FC<PhoneNumberProps> = ({
  phone,
  className = '',
}) => {
  if (!phone) return null;

  const formatted = formatPhoneDisplay(phone);

  return (
    <bdi
      dir="ltr"
      className={`inline-block font-mono text-left select-all tabular-nums tracking-wide ${className}`}
      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
    >
      {formatted}
    </bdi>
  );
};

export default PhoneNumber;
