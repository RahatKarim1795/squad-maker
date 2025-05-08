'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Player } from '@/types';
import { players } from './data/players';
import { balanceTeams } from './lib/teamBalancer';
import PlayerSelection from './components/PlayerSelection';
import TeamDisplay from './components/TeamGeneration/TeamDisplay';
import Header from './components/UI/Header';
import Container from './components/UI/Container';

export default function Home() {
  const router = useRouter();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<ReturnType<typeof balanceTeams> | null>(null);
  
  const handleGenerateTeams = (players: Player[]) => {
    if (players.length < 2) return;
    
    try {
      const generatedTeams = balanceTeams(players);
      setTeams(generatedTeams);
      setSelectedPlayers(players);
    } catch (error) {
      console.error('Failed to generate teams:', error);
      alert('Failed to generate teams. Please make sure you have selected at least 2 players.');
    }
  };
  
  const handleReset = () => {
    setTeams(null);
  };
  
  return (
    <main className="min-h-screen bg-slate-100">
      <Header 
        title="Squad Maker" 
        subtitle="Create balanced teams for your football match" 
      />
      
      <Container>
        {teams ? (
          <TeamDisplay 
            teams={teams} 
            onReset={handleReset} 
          />
        ) : (
          <PlayerSelection 
            initialPlayers={players} 
            onGenerateTeams={handleGenerateTeams} 
          />
        )}
      </Container>
    </main>
  );
}
