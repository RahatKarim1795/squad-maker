export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export interface Player {
  id: string;
  name: string;
  positions: Position[];
  rating: number;
  isSelected?: boolean;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  averageRating?: number;
} 