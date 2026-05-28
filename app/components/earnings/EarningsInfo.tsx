import React from 'react';
import { useIntl } from 'react-intl';

export const EarningsInfo: React.FC = () => {
  const intl = useIntl();

  return (
    <div className="rounded-lg p-5 neon-border"
      style={{
        borderImage: "none",
        background: "linear-gradient(160deg, rgba(30, 27, 75, 0.9), rgba(23, 21, 56, 0.9))"
      }}
    >
      <h2 className="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-blue-300">
        {intl.formatMessage({ id: 'components.earningsInfo.title' })}
      </h2>
      <ul className="space-y-3 text-sm text-gray-300">
        <li className="flex">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs mr-2">
            !
          </div>
          <p>{intl.formatMessage({ id: 'components.earningsInfo.claimDaily' })}</p>
        </li>
        <li className="flex">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs mr-2">
            !
          </div>
          <p>{intl.formatMessage({ id: 'components.earningsInfo.lostEarnings' })}</p>
        </li>
      </ul>
    </div>
  );
}; 