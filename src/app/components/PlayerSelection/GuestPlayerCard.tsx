'use client';

import { useState } from 'react';
import { Position, Player } from '@/types';

interface GuestPlayerCardProps {
  onAddGuestPlayer: (player: Player) => void;
}

const GuestPlayerCard = ({ onAddGuestPlayer }: GuestPlayerCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [rating, setRating] = useState<number>(7);
  const [name, setName] = useState<string>('');
  
  const positions: Position[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  
  const handlePositionToggle = (position: Position) => {
    if (selectedPositions.includes(position)) {
      setSelectedPositions(selectedPositions.filter(p => p !== position));
    } else {
      setSelectedPositions([...selectedPositions, position]);
    }
  };
  
  const handleAddGuest = () => {
    if (selectedPositions.length === 0 || !name.trim()) return;
    
    // Create a guest player with random ID
    const guestPlayer: Player = {
      id: `guest-${Date.now()}`,
      name: name.trim(),
      positions: selectedPositions,
      rating: rating,
      isSelected: true, // Auto-select guest players
      isGuest: true
    };
    
    onAddGuestPlayer(guestPlayer);
    
    // Reset form
    setSelectedPositions([]);
    setRating(7);
    setName('');
    setIsModalOpen(false);
  };
  
  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative p-4 border-2 border-dashed border-slate-300 rounded-lg shadow-sm hover:shadow-md hover:border-slate-400 transition-all bg-white h-full flex flex-col items-center justify-center cursor-pointer min-h-[180px]"
      >
        <div className="text-4xl text-slate-400 mb-2">+</div>
        <p className="text-slate-600 font-medium">Add Guest Player</p>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Add Guest Player</h3>
            
            <div className="mb-4">
              <label htmlFor="guestName" className="block text-sm font-medium text-slate-700 mb-1">
                Player Name
              </label>
              <input
                id="guestName"
                type="text"
                placeholder="Enter guest player's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              {isModalOpen && !name.trim() && (
                <p className="text-red-600 text-sm mt-1">Name is required</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Position(s):
              </label>
              <div className="flex flex-wrap gap-2">
                {positions.map(position => (
                  <button
                    key={position}
                    onClick={() => handlePositionToggle(position)}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium
                      ${selectedPositions.includes(position)
                        ? getPositionButtonColor(position)
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                      transition-colors
                    `}
                  >
                    {position}
                  </button>
                ))}
              </div>
              {selectedPositions.length === 0 && (
                <p className="text-red-600 text-sm mt-1">Select at least one position</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rating: {rating.toFixed(1)}
              </label>
              <input
                type="range"
                min="5"
                max="10"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5.0</span>
                <span>10.0</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPositions([]);
                  setRating(7);
                  setName('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGuest}
                disabled={selectedPositions.length === 0 || !name.trim()}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium text-white
                  ${selectedPositions.length === 0 || !name.trim()
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'}
                `}
              >
                Add Player
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper function to get position button colors
const getPositionButtonColor = (position: Position) => {
  switch(position) {
    case 'Goalkeeper': return 'bg-amber-600 text-white';
    case 'Defender': return 'bg-blue-700 text-white';
    case 'Midfielder': return 'bg-emerald-700 text-white';
    case 'Forward': return 'bg-red-700 text-white';
    default: return 'bg-gray-700 text-white';
  }
};

export default GuestPlayerCard; 