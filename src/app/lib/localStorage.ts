import { Player } from '@/types';

const SELECTED_PLAYERS_KEY = 'squad-maker-selected-players';

/**
 * Save selected players to localStorage
 */
export function saveSelectedPlayers(players: Player[]): void {
  if (typeof window === 'undefined') return;
  
  const selectedPlayers = players
    .filter(player => player.isSelected)
    .map(player => player.id);
  
  localStorage.setItem(SELECTED_PLAYERS_KEY, JSON.stringify(selectedPlayers));
}

/**
 * Load selected player IDs from localStorage
 */
export function loadSelectedPlayerIds(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedData = localStorage.getItem(SELECTED_PLAYERS_KEY);
    if (!savedData) return [];
    
    return JSON.parse(savedData) as string[];
  } catch (error) {
    console.error('Error loading selected players from localStorage:', error);
    return [];
  }
}

/**
 * Apply selected status to players based on localStorage data
 */
export function applySelectedStatus(players: Player[]): Player[] {
  const selectedIds = loadSelectedPlayerIds();
  
  return players.map(player => ({
    ...player,
    isSelected: selectedIds.includes(player.id)
  }));
} 