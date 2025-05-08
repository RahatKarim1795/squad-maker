'use client';

import { Player } from '@/types';
import { useEffect, useState } from 'react';
import PlayerGrid from './PlayerGrid';
import { saveSelectedPlayers, applySelectedStatus } from '@/app/lib/localStorage';

interface PlayerSelectionProps {
  initialPlayers: Player[];
  onGenerateTeams: (selectedPlayers: Player[]) => void;
}

const PlayerSelection = ({ initialPlayers, onGenerateTeams }: PlayerSelectionProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [guestPlayers, setGuestPlayers] = useState<Player[]>([]);
  
  // Load player data and apply selected status from localStorage on initial render
  useEffect(() => {
    setPlayers(applySelectedStatus(initialPlayers));
  }, [initialPlayers]);
  
  // Handle player selection/deselection
  const handleSelectPlayer = (playerId: string, isSelected: boolean) => {
    // Check if it's a guest player by the ID prefix
    if (playerId.startsWith('guest-')) {
      const updatedGuestPlayers = guestPlayers.map(player => 
        player.id === playerId ? { ...player, isSelected } : player
      );
      setGuestPlayers(updatedGuestPlayers);
    } else {
      const updatedPlayers = players.map(player => 
        player.id === playerId ? { ...player, isSelected } : player
      );
      
      setPlayers(updatedPlayers);
      saveSelectedPlayers(updatedPlayers);
    }
  };
  
  // Handle adding a guest player
  const handleAddGuestPlayer = (player: Player) => {
    setGuestPlayers([...guestPlayers, player]);
  };
  
  // Get count of selected players (including guests)
  const selectedRegularPlayers = players.filter(p => p.isSelected);
  const selectedGuestPlayers = guestPlayers.filter(p => p.isSelected);
  const selectedCount = selectedRegularPlayers.length + selectedGuestPlayers.length;
  
  // Handle form submission
  const handleGenerateTeams = () => {
    const allSelectedPlayers = [
      ...selectedRegularPlayers,
      ...selectedGuestPlayers
    ];
    
    if (allSelectedPlayers.length < 2) return;
    onGenerateTeams(allSelectedPlayers);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-bold mb-5 text-slate-800 pb-2 border-b border-slate-200">
          Select Players for Today's Match
        </h2>
        
        <PlayerGrid 
          players={players} 
          guestPlayers={guestPlayers}
          onSelectPlayer={handleSelectPlayer} 
          onAddGuestPlayer={handleAddGuestPlayer}
        />
      </div>
      
      {/* Bottom status bar and actions */}
      <div className="sticky bottom-0 bg-white p-5 border border-slate-200 shadow-lg rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-800 flex items-center">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-700 text-white text-sm font-bold mr-2">
                {selectedCount}
              </span>
              players selected
              {guestPlayers.length > 0 && (
                <span className="ml-2 text-sm text-amber-600">
                  (including {guestPlayers.filter(p => p.isSelected).length} guests)
                </span>
              )}
            </span>
            {selectedCount < 2 && (
              <p className="text-red-600 text-sm mt-1">Select at least 2 players to continue</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                const allSelected = players.map(p => ({ ...p, isSelected: true }));
                const allGuestsSelected = guestPlayers.map(p => ({ ...p, isSelected: true }));
                setPlayers(allSelected);
                setGuestPlayers(allGuestsSelected);
                saveSelectedPlayers(allSelected);
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-sm font-medium"
            >
              Select All
            </button>
            
            <button
              onClick={() => {
                const noneSelected = players.map(p => ({ ...p, isSelected: false }));
                const noGuestsSelected = guestPlayers.map(p => ({ ...p, isSelected: false }));
                setPlayers(noneSelected);
                setGuestPlayers(noGuestsSelected);
                saveSelectedPlayers(noneSelected);
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-sm font-medium"
            >
              Clear All
            </button>
            
            {guestPlayers.length > 0 && (
              <button
                onClick={() => {
                  setGuestPlayers([]);
                }}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium"
              >
                Remove Guests
              </button>
            )}
            
            <button
              onClick={handleGenerateTeams}
              disabled={selectedCount < 2}
              className={`
                px-6 py-2 rounded-md text-white font-medium
                ${selectedCount < 2 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
                }
              `}
            >
              Generate Teams
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelection; 