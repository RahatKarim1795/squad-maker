'use client';

import { Player, Position } from '@/types';
import { useState } from 'react';
import PlayerCard from './PlayerCard';

interface PlayerGridProps {
  players: Player[];
  onSelectPlayer: (playerId: string, isSelected: boolean) => void;
}

const PlayerGrid = ({ players, onSelectPlayer }: PlayerGridProps) => {
  const [positionFilter, setPositionFilter] = useState<Position | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPlayers = players.filter(player => {
    // Apply position filter
    const matchesPosition = positionFilter === 'All' || player.positions.includes(positionFilter as Position);
    
    // Apply search filter
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPosition && matchesSearch;
  });
  
  const positions: ('All' | Position)[] = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  // Get position button color
  const getPositionButtonColor = (position: 'All' | Position, isActive: boolean) => {
    if (isActive) {
      switch(position) {
        case 'All': return 'bg-slate-700 text-white';
        case 'Goalkeeper': return 'bg-amber-600 text-white';
        case 'Defender': return 'bg-blue-700 text-white';
        case 'Midfielder': return 'bg-emerald-700 text-white';
        case 'Forward': return 'bg-red-700 text-white';
        default: return 'bg-slate-700 text-white';
      }
    }
    
    return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };
  
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-slate-100 p-4 rounded-lg">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">Search Players</label>
          <input
            id="search"
            type="text"
            placeholder="Type a name..."
            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-1">
          <p className="block text-sm font-medium text-slate-700">Filter by Position</p>
          <div className="flex flex-wrap gap-2">
            {positions.map(position => (
              <button
                key={position}
                onClick={() => setPositionFilter(position)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap
                  ${getPositionButtonColor(position, positionFilter === position)}
                  transition-colors
                `}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Grid of players */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPlayers.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            onSelect={onSelectPlayer}
          />
        ))}
      </div>
      
      {/* Show message if no players match the filter */}
      {filteredPlayers.length === 0 && (
        <div className="text-center py-8 bg-slate-100 rounded-lg">
          <p className="text-slate-700 font-medium">No players found matching your filters</p>
          <button 
            onClick={() => {
              setPositionFilter('All');
              setSearchTerm('');
            }}
            className="mt-2 text-sm text-slate-600 underline hover:text-slate-800"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerGrid; 