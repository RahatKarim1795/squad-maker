'use client';

import { Player } from '@/types';

interface PlayerBadgeProps {
  player: Player;
}

const PlayerBadge = ({ player }: PlayerBadgeProps) => {
  // Determine background color based on primary position
  const getPositionColor = (positions: string[]) => {
    const primaryPosition = positions[0];
    switch(primaryPosition) {
      case 'Goalkeeper': return 'bg-amber-100 border-amber-500 text-amber-800';
      case 'Defender': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'Midfielder': return 'bg-emerald-100 border-emerald-500 text-emerald-800';
      case 'Forward': return 'bg-red-100 border-red-500 text-red-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };
  
  return (
    <div className={`
      px-3 py-2 rounded-md border flex items-center justify-between
      ${getPositionColor(player.positions)}
    `}>
      <span className="font-medium">{player.name}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs px-1.5 py-0.5 bg-white rounded-md border border-gray-300 font-medium">
          {player.rating}
        </span>
        <span className="text-xs font-medium">{player.positions[0]}</span>
      </div>
    </div>
  );
};

export default PlayerBadge; 