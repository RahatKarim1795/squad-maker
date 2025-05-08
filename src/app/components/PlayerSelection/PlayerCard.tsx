'use client';

import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  onSelect: (playerId: string, isSelected: boolean) => void;
}

const PlayerCard = ({ player, onSelect }: PlayerCardProps) => {
  const isSelected = player.isSelected || false;
  
  const handleToggle = () => {
    const newValue = !isSelected;
    onSelect(player.id, newValue);
  };
  
  // Determine badge color based on player position
  const getPositionColor = (position: string) => {
    switch(position) {
      case 'Goalkeeper': return 'bg-amber-600 text-white';
      case 'Defender': return 'bg-blue-700 text-white';
      case 'Midfielder': return 'bg-emerald-700 text-white';
      case 'Forward': return 'bg-red-700 text-white';
      default: return 'bg-gray-700 text-white';
    }
  };
  
  // Determine border color based on player rating
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'border-amber-500';
    if (rating >= 7) return 'border-emerald-500';
    if (rating >= 5) return 'border-blue-500';
    return 'border-gray-500';
  };
  
  return (
    <div 
      className={`
        relative p-4 border-2 rounded-lg shadow-md transition-all
        ${getRatingColor(player.rating)}
        ${isSelected ? 'bg-slate-100' : 'bg-white'}
        hover:shadow-lg cursor-pointer
      `}
      onClick={handleToggle}
    >
      {/* Selection indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-5 h-5 rounded-full border ${isSelected ? 'bg-emerald-600 border-emerald-700' : 'bg-gray-200 border-gray-300'}`}></div>
      </div>
      
      {/* Player name */}
      <h3 className="text-lg font-bold mb-1 text-slate-800">{player.name}</h3>
      
      {/* Rating */}
      <div className="flex items-center mb-2">
        <span className="text-sm font-medium mr-1 text-slate-700">Rating:</span>
        <div className="flex items-center">
          <span className="text-sm font-bold text-slate-800 mr-2">{player.rating}/10</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full mx-0.5 ${i < Math.floor(player.rating/2) ? 'bg-amber-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Positions */}
      <div className="flex flex-wrap gap-1 mt-2">
        {player.positions.map(position => (
          <span 
            key={position} 
            className={`text-xs px-2 py-1 rounded-md font-medium ${getPositionColor(position)}`}
          >
            {position}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlayerCard; 