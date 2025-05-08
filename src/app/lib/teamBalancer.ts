import { Player, Team } from '@/types';

/**
 * Generate two balanced teams from a list of selected players
 */
export function balanceTeams(selectedPlayers: Player[]): [Team, Team] {
  if (selectedPlayers.length < 2) {
    throw new Error('Need at least 2 players to create teams');
  }

  // Sort players by rating (highest to lowest)
  const sortedPlayers = [...selectedPlayers].sort((a, b) => b.rating - a.rating);

  const teamA: Team = { id: 'A', name: 'Team A', players: [] };
  const teamB: Team = { id: 'B', name: 'Team B', players: [] };

  // First, distribute goalkeepers evenly
  const goalkeepers = sortedPlayers.filter(player => 
    player.positions.includes('Goalkeeper')
  );
  
  const outfieldPlayers = sortedPlayers.filter(player => 
    !player.positions.includes('Goalkeeper')
  );

  // Distribute goalkeepers
  if (goalkeepers.length >= 2) {
    teamA.players.push(goalkeepers[0]);
    teamB.players.push(goalkeepers[1]);
    
    // Add remaining goalkeepers to outfield players
    if (goalkeepers.length > 2) {
      outfieldPlayers.push(...goalkeepers.slice(2));
    }
  } else if (goalkeepers.length === 1) {
    // If there's only one goalkeeper, assign to the first team
    teamA.players.push(goalkeepers[0]);
  }

  // Function to calculate team rating
  const getTeamRating = (team: Team): number => {
    if (team.players.length === 0) return 0;
    return team.players.reduce((sum, player) => sum + player.rating, 0) / team.players.length;
  };

  // Distribute remaining players using alternating selection
  // but always give the next player to the team with the lower average rating
  for (const player of outfieldPlayers) {
    const teamARating = getTeamRating(teamA);
    const teamBRating = getTeamRating(teamB);
    
    if (teamARating <= teamBRating) {
      teamA.players.push(player);
    } else {
      teamB.players.push(player);
    }
  }

  // Calculate average ratings
  teamA.averageRating = getTeamRating(teamA);
  teamB.averageRating = getTeamRating(teamB);

  return [teamA, teamB];
} 