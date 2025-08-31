import React from 'react';

interface TrustScoreProps {
  score?: number;
  size?: 'small' | 'medium' | 'large';
}

export const RealisticTrustScore: React.FC<TrustScoreProps> = ({ score = 4.8 }) => {
  // stub component after Trustpilot removal - lightweight placeholder
  return (
    <div className="inline-flex items-center space-x-2">
      <span className="text-white font-semibold">Score: {score.toFixed(1)}</span>
    </div>
  );
};
