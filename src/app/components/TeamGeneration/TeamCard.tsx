'use client';

import { Player, Team, Position } from '@/types';
import PlayerBadge from './PlayerBadge';

interface TeamCardProps {
  team: Team;
}

const TeamCard = ({ team }: TeamCardProps) => {
  // Get team stats
  const countPositions = (players: Player[], position: Position) => {
    return players.filter(player => player.positions.includes(position)).length;
  };
  
  const averageRating = team.averageRating || 
    (team.players.reduce((sum, player) => sum + player.rating, 0) / team.players.length || 0);
  
  // Group players by position for display
  const goalkeepers = team.players.filter(p => p.positions.includes('Goalkeeper'));
  const defenders = team.players.filter(p => p.positions.includes('Defender'));
  const midfielders = team.players.filter(p => p.positions.includes('Midfielder'));
  const forwards = team.players.filter(p => p.positions.includes('Forward'));
  
  // Find players who might be in multiple groups and prioritize them
  // (so they only appear in one group based on their primary position)
  const prioritizePositions = (players: Player[]): Player[] => {
    return players.filter(player => player.positions[0] === players[0].positions[0]);
  };
  
  // Get position indicator styles
  const getPositionStyle = (position: Position) => {
    switch(position) {
      case 'Goalkeeper': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Defender': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Midfielder': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Forward': return 'bg-red-100 text-red-800 border-red-200';
    }
  };
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">{team.name}</h3>
        <div className="text-sm bg-slate-100 px-3 py-1.5 rounded-md font-medium text-slate-800 border border-slate-200">
          Average: {averageRating.toFixed(1)}
        </div>
      </div>
      
      {/* Team composition summary */}
      <div className="flex gap-2 mb-5 text-sm flex-wrap">
        <div className={`px-2.5 py-1.5 rounded-md border ${getPositionStyle('Goalkeeper')} font-medium`}>
          GK: {countPositions(team.players, 'Goalkeeper')}
        </div>
        <div className={`px-2.5 py-1.5 rounded-md border ${getPositionStyle('Defender')} font-medium`}>
          DEF: {countPositions(team.players, 'Defender')}
        </div>
        <div className={`px-2.5 py-1.5 rounded-md border ${getPositionStyle('Midfielder')} font-medium`}>
          MID: {countPositions(team.players, 'Midfielder')}
        </div>
        <div className={`px-2.5 py-1.5 rounded-md border ${getPositionStyle('Forward')} font-medium`}>
          FWD: {countPositions(team.players, 'Forward')}
        </div>
      </div>
      
      {/* Players grouped by position */}
      <div className="space-y-4">
        {goalkeepers.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-amber-800 bg-amber-50 px-2 py-1 rounded inline-block">Goalkeepers</h4>
            <div className="space-y-2">
              {goalkeepers.map(player => (
                <PlayerBadge key={player.id} player={player} />
              ))}
            </div>
          </div>
        )}
        
        {defenders.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-blue-800 bg-blue-50 px-2 py-1 rounded inline-block">Defenders</h4>
            <div className="space-y-2">
              {defenders
                .filter(player => player.positions[0] === 'Defender')
                .map(player => (
                  <PlayerBadge key={player.id} player={player} />
                ))
              }
            </div>
          </div>
        )}
        
        {midfielders.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block">Midfielders</h4>
            <div className="space-y-2">
              {midfielders
                .filter(player => player.positions[0] === 'Midfielder')
                .map(player => (
                  <PlayerBadge key={player.id} player={player} />
                ))
              }
            </div>
          </div>
        )}
        
        {forwards.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-red-800 bg-red-50 px-2 py-1 rounded inline-block">Forwards</h4>
            <div className="space-y-2">
              {forwards
                .filter(player => player.positions[0] === 'Forward')
                .map(player => (
                  <PlayerBadge key={player.id} player={player} />
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard; 