import { Player, Team, Position } from '@/types';

/**
 * Generate two balanced teams from a list of selected players based on:
 * 1. Equal number of players per team
 * 2. Equal number of players per position in each team (when possible)
 * 3. Similar average rating for both teams
 * 4. Each team must have at least 1 goalkeeper if available
 */
export function balanceTeams(selectedPlayers: Player[]): [Team, Team] {
  if (selectedPlayers.length < 2) {
    throw new Error('Need at least 2 players to create teams');
  }

  // Initialize teams
  const teamA: Team = { id: 'A', name: 'Team A', players: [] };
  const teamB: Team = { id: 'B', name: 'Team B', players: [] };

  // Group players by position
  const positions: Position[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  
  const playersByPosition: Record<Position, Player[]> = {
    Goalkeeper: [],
    Defender: [],
    Midfielder: [],
    Forward: []
  };
  
  // Some players may have multiple positions, prioritize positions with fewer players
  // For each player, assign to their primary position (the position with fewest players)
  selectedPlayers.forEach(player => {
    if (player.positions.length === 1) {
      playersByPosition[player.positions[0]].push(player);
    } else {
      // Find the position with the fewest players
      let fewestPosition = player.positions[0];
      let minCount = playersByPosition[fewestPosition].length;
      
      for (const position of player.positions) {
        if (playersByPosition[position].length < minCount) {
          fewestPosition = position;
          minCount = playersByPosition[position].length;
        }
      }
      
      playersByPosition[fewestPosition].push(player);
    }
  });
  
  // Function to calculate team rating
  const getTeamRating = (team: Team): number => {
    if (team.players.length === 0) return 0;
    return team.players.reduce((sum, player) => sum + player.rating, 0) / team.players.length;
  };
  
  // Function to assign player to team with lower rating
  const assignToTeamWithLowerRating = (player: Player) => {
    const teamARating = getTeamRating(teamA);
    const teamBRating = getTeamRating(teamB);
    
    // If equal ratings or team sizes differ by more than 1, favor the team with fewer players
    if (Math.abs(teamARating - teamBRating) < 0.1 && Math.abs(teamA.players.length - teamB.players.length) >= 1) {
      if (teamA.players.length <= teamB.players.length) {
        teamA.players.push(player);
      } else {
        teamB.players.push(player);
      }
    } else if (teamARating <= teamBRating) {
      teamA.players.push(player);
    } else {
      teamB.players.push(player);
    }
  };
  
  // Handle goalkeepers first to ensure each team has at least one if available
  const goalkeepers = [...playersByPosition.Goalkeeper];
  
  if (goalkeepers.length >= 1) {
    // Sort goalkeepers by rating (highest first)
    goalkeepers.sort((a, b) => b.rating - a.rating);
    
    // Assign first goalkeeper to team A
    if (goalkeepers.length >= 1) {
      teamA.players.push(goalkeepers[0]);
    }
    
    // Assign second goalkeeper to team B
    if (goalkeepers.length >= 2) {
      teamB.players.push(goalkeepers[1]);
    }
    
    // If there are more than 2 goalkeepers, they'll be handled with other positions
    const remainingGoalkeepers = goalkeepers.slice(2);
    playersByPosition.Goalkeeper = remainingGoalkeepers;
  }
  
  // Distribute remaining players by position, prioritizing balance
  positions.forEach(position => {
    // Skip Goalkeeper as we've already handled them specially
    if (position === 'Goalkeeper') return;
    
    const positionPlayers = [...playersByPosition[position]];
    
    // Sort by rating (highest first)
    positionPlayers.sort((a, b) => b.rating - a.rating);
    
    // Distribute evenly by "snake draft" (1-2-2-1) for optimal skill distribution
    // but prioritize equal number of players per position
    const playerCount = positionPlayers.length;
    const perTeam = Math.floor(playerCount / 2);
    const remainder = playerCount % 2;
    
    // Handle even distribution first (equal number per team)
    for (let i = 0; i < perTeam * 2; i++) {
      const player = positionPlayers[i];
      // Use snake order (0->A, 1->B, 2->B, 3->A, etc) for optimal skill distribution
      const snakeIndex = i < 2 ? i : (i % 2 === 0 ? 1 : 0);
      
      if (snakeIndex === 0) {
        teamA.players.push(player);
      } else {
        teamB.players.push(player);
      }
    }
    
    // Then handle any remainder based on team rating
    if (remainder > 0) {
      assignToTeamWithLowerRating(positionPlayers[playerCount - 1]);
    }
  });
  
  // Handle remaining goalkeepers (if there were more than 2)
  const remainingGoalkeepers = playersByPosition.Goalkeeper;
  if (remainingGoalkeepers.length > 0) {
    for (const goalkeeper of remainingGoalkeepers) {
      assignToTeamWithLowerRating(goalkeeper);
    }
  }
  
  // Final balance check - ensure equal total number of players
  // If teams have uneven counts, move players to balance
  while (Math.abs(teamA.players.length - teamB.players.length) > 1) {
    if (teamA.players.length > teamB.players.length) {
      // Find the lowest impact player to move from A to B
      // But never move the only goalkeeper
      const nonGkPlayers = teamA.players
        .filter(p => !p.positions.includes('Goalkeeper') || 
                     teamA.players.filter(player => player.positions.includes('Goalkeeper')).length > 1);
      
      if (nonGkPlayers.length > 0) {
        nonGkPlayers.sort((a, b) => a.rating - b.rating);
        const playerToMoveIndex = teamA.players.findIndex(p => p.id === nonGkPlayers[0].id);
        if (playerToMoveIndex !== -1) {
          const playerToMove = teamA.players.splice(playerToMoveIndex, 1)[0];
          teamB.players.push(playerToMove);
        }
      }
    } else {
      // Find the lowest impact player to move from B to A
      // But never move the only goalkeeper
      const nonGkPlayers = teamB.players
        .filter(p => !p.positions.includes('Goalkeeper') || 
                     teamB.players.filter(player => player.positions.includes('Goalkeeper')).length > 1);
      
      if (nonGkPlayers.length > 0) {
        nonGkPlayers.sort((a, b) => a.rating - b.rating);
        const playerToMoveIndex = teamB.players.findIndex(p => p.id === nonGkPlayers[0].id);
        if (playerToMoveIndex !== -1) {
          const playerToMove = teamB.players.splice(playerToMoveIndex, 1)[0];
          teamA.players.push(playerToMove);
        }
      }
    }
  }
  
  // Calculate final average ratings
  teamA.averageRating = getTeamRating(teamA);
  teamB.averageRating = getTeamRating(teamB);
  
  return [teamA, teamB];
} 