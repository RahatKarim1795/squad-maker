'use client';

import { Team, Position, Player } from '@/types';
import { useState, useEffect } from 'react';

interface TeamDisplayProps {
  teams: [Team, Team];
  onReset: () => void;
  onRegenerate: () => void;
}

const TeamDisplay = ({ teams: initialTeams, onReset, onRegenerate }: TeamDisplayProps) => {
  const [teams, setTeams] = useState<[Team, Team]>(initialTeams);
  const [teamA, teamB] = teams;
  const [showStats, setShowStats] = useState(false);
  
  // Update local teams state when initialTeams prop changes (for regeneration)
  useEffect(() => {
    setTeams(initialTeams);
  }, [initialTeams]);
  
  // Calculate some basic stats for comparison
  const getPositionCount = (team: Team, position: Position) => {
    return team.players.filter(p => p.positions.includes(position)).length;
  };
  
  // Get position indicator styles
  const getPositionStyle = (position: Position) => {
    switch(position) {
      case 'Goalkeeper': return 'text-amber-800 border-amber-300 bg-amber-50';
      case 'Defender': return 'text-blue-800 border-blue-300 bg-blue-50';
      case 'Midfielder': return 'text-emerald-800 border-emerald-300 bg-emerald-50';
      case 'Forward': return 'text-red-800 border-red-300 bg-red-50';
    }
  };
  
  // Get position color class for badges
  const getPositionColor = (position: Position): string => {
    switch(position) {
      case 'Goalkeeper': return 'bg-amber-600 text-white';
      case 'Defender': return 'bg-blue-700 text-white';
      case 'Midfielder': return 'bg-emerald-700 text-white';
      case 'Forward': return 'bg-red-700 text-white';
      default: return 'bg-gray-700 text-white';
    }
  };
  
  // Get the displayed position of a player (use assignedPosition if available, otherwise primary position)
  const getDisplayPosition = (player: Player): Position => {
    return player.assignedPosition || player.positions[0];
  };
  
  // Sort players by position: GK -> DEF -> MID -> FWD
  const sortPlayersByPosition = (players: Player[]): Player[] => {
    // Define position priority order
    const positionOrder: Position[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
    
    // Create a copy of the players array
    return [...players].sort((a, b) => {
      const posA = getDisplayPosition(a);
      const posB = getDisplayPosition(b);
      
      return positionOrder.indexOf(posA) - positionOrder.indexOf(posB);
    });
  };
  
  // Move player from team A to team B
  const moveToTeamB = (playerIndex: number) => {
    const newTeamA = { ...teamA };
    const newTeamB = { ...teamB };
    
    // Remove player from team A
    const [player] = newTeamA.players.splice(playerIndex, 1);
    
    // Add player to team B
    newTeamB.players.push(player);
    
    // Recalculate ratings
    const calcRating = (team: Team) => {
      if (team.players.length === 0) return 0;
      return team.players.reduce((sum, p) => sum + p.rating, 0) / team.players.length;
    };
    
    newTeamA.averageRating = calcRating(newTeamA);
    newTeamB.averageRating = calcRating(newTeamB);
    
    // Update teams
    setTeams([newTeamA, newTeamB]);
  };
  
  // Move player from team B to team A
  const moveToTeamA = (playerIndex: number) => {
    const newTeamA = { ...teamA };
    const newTeamB = { ...teamB };
    
    // Remove player from team B
    const [player] = newTeamB.players.splice(playerIndex, 1);
    
    // Add player to team A
    newTeamA.players.push(player);
    
    // Recalculate ratings
    const calcRating = (team: Team) => {
      if (team.players.length === 0) return 0;
      return team.players.reduce((sum, p) => sum + p.rating, 0) / team.players.length;
    };
    
    newTeamA.averageRating = calcRating(newTeamA);
    newTeamB.averageRating = calcRating(newTeamB);
    
    // Update teams
    setTeams([newTeamA, newTeamB]);
  };
  
  // Call the parent's onRegenerate and let useEffect update local state
  const handleRegenerate = () => {
    onRegenerate();
  };
  
  // Sort the players by position for display
  const sortedTeamAPlayers = sortPlayersByPosition(teamA.players);
  const sortedTeamBPlayers = sortPlayersByPosition(teamB.players);
  
  // Apply team colors from team_balance_rules.txt
  const teamAColors = "bg-red-700 text-white"; // Team A: red/white
  const teamBColors = "bg-slate-800 text-white"; // Team B: black/blue (using slate-800 for black)
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Generated Teams</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium border border-slate-300"
            >
              {showStats ? 'Hide' : 'Show'} Comparison
            </button>
            
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium"
              title="Create new teams with the same players"
            >
              Regenerate Teams
            </button>
            
            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-md text-sm font-medium"
            >
              Reset & Select Players
            </button>
          </div>
        </div>
        
        {/* Instructions for team adjustments */}
        <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
          <p>
            <span className="font-semibold">Tip:</span> Use the "Move" buttons to adjust players between teams.
          </p>
        </div>
        
        {/* Stats comparison */}
        {showStats && (
          <div className="mb-6 overflow-x-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left py-2 text-slate-700 font-semibold px-3">Stat</th>
                  <th className="text-center py-2 text-slate-700 font-semibold px-3">{teamA.name}</th>
                  <th className="text-center py-2 text-slate-700 font-semibold px-3">{teamB.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-2 text-slate-700 px-3">Players</td>
                  <td className="text-center py-2 font-medium text-slate-800 px-3">{teamA.players.length}</td>
                  <td className="text-center py-2 font-medium text-slate-800 px-3">{teamB.players.length}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2 text-slate-700 px-3">Average Rating</td>
                  <td className="text-center py-2 font-medium text-slate-800 px-3">{teamA.averageRating?.toFixed(1)}</td>
                  <td className="text-center py-2 font-medium text-slate-800 px-3">{teamB.averageRating?.toFixed(1)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className={`py-2 px-3`}>Goalkeepers</td>
                  <td className={`text-center py-2 px-3 ${getPositionStyle('Goalkeeper')}`}>{getPositionCount(teamA, 'Goalkeeper')}</td>
                  <td className={`text-center py-2 px-3 ${getPositionStyle('Goalkeeper')}`}>{getPositionCount(teamB, 'Goalkeeper')}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className={`py-2 px-3`}>Defenders</td>
                  <td className={`text-center py-2 px-3 ${getPositionStyle('Defender')}`}>{getPositionCount(teamA, 'Defender')}</td>
                  <td className={`text-center py-2 px-3 ${getPositionStyle('Defender')}`}>{getPositionCount(teamB, 'Defender')}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className={`py-2 px-3`}>Midfielders</td>
                  <td className={`text-center py-2 px-3 ${getPositionStyle('Midfielder')}`}>{getPositionCount(teamA, 'Midfielder')}</td>
                  <td className={`text-center py-2 px-3 ${getPositionStyle('Midfielder')}`}>{getPositionCount(teamB, 'Midfielder')}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className={`py-2 px-3`}>Forwards</td>
                  <td className={`text-center py-2 px-3 ${getPositionStyle('Forward')}`}>{getPositionCount(teamA, 'Forward')}</td>
                  <td className={`text-center py-2 px-3 ${getPositionStyle('Forward')}`}>{getPositionCount(teamB, 'Forward')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {/* Teams display with move buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className={`${teamAColors} p-3`}>
              <h3 className="font-bold text-lg">{teamA.name}</h3>
              <div className="text-sm opacity-80">
                {teamA.players.length} players • Avg. rating: {teamA.averageRating?.toFixed(1)}
              </div>
            </div>
            <div className="p-3">
              {sortedTeamAPlayers.map((player, index) => {
                // Find original index in unsorted array for moveToTeamB function
                const originalIndex = teamA.players.findIndex(p => p.id === player.id);
                return (
                <div 
                  key={player.id}
                  className={`
                    mb-2 p-3 rounded-lg border bg-white border-slate-200
                    ${player.isGuest ? 'border-dashed' : ''}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {player.name}
                        {player.isGuest && (
                          <span className="ml-2 text-xs font-normal bg-amber-100 text-amber-800 px-1 py-0.5 rounded">
                            Guest
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">
                        Rating: {player.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span 
                        className={`
                          text-xs px-2 py-1 rounded-md font-medium
                          ${getPositionColor(getDisplayPosition(player))}
                        `}
                      >
                        {getDisplayPosition(player)}
                      </span>
                      <button
                        onClick={() => moveToTeamB(originalIndex)}
                        className="ml-2 px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md"
                        title="Move to Team B"
                      >
                        Move →
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className={`${teamBColors} p-3`}>
              <h3 className="font-bold text-lg">{teamB.name}</h3>
              <div className="text-sm opacity-80">
                {teamB.players.length} players • Avg. rating: {teamB.averageRating?.toFixed(1)}
              </div>
            </div>
            <div className="p-3">
              {sortedTeamBPlayers.map((player, index) => {
                // Find original index in unsorted array for moveToTeamA function
                const originalIndex = teamB.players.findIndex(p => p.id === player.id);
                return (
                <div 
                  key={player.id}
                  className={`
                    mb-2 p-3 rounded-lg border bg-white border-slate-200
                    ${player.isGuest ? 'border-dashed' : ''}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {player.name}
                        {player.isGuest && (
                          <span className="ml-2 text-xs font-normal bg-amber-100 text-amber-800 px-1 py-0.5 rounded">
                            Guest
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">
                        Rating: {player.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveToTeamA(originalIndex)}
                        className="px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md"
                        title="Move to Team A"
                      >
                        ← Move
                      </button>
                      <span 
                        className={`
                          text-xs px-2 py-1 rounded-md font-medium
                          ${getPositionColor(getDisplayPosition(player))}
                        `}
                      >
                        {getDisplayPosition(player)}
                      </span>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDisplay; 