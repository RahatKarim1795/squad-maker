'use client';

import { Team, Position } from '@/types';
import TeamCard from './TeamCard';
import { useState } from 'react';

interface TeamDisplayProps {
  teams: [Team, Team];
  onReset: () => void;
  onRegenerate: () => void;
}

const TeamDisplay = ({ teams, onReset, onRegenerate }: TeamDisplayProps) => {
  const [teamA, teamB] = teams;
  const [showStats, setShowStats] = useState(false);
  
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
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Generated Teams</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium border border-slate-300"
            >
              {showStats ? 'Hide' : 'Show'} Comparison
            </button>
            
            <button
              onClick={onRegenerate}
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
        
        {/* Teams display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamCard team={teamA} />
          <TeamCard team={teamB} />
        </div>
      </div>
    </div>
  );
};

export default TeamDisplay; 