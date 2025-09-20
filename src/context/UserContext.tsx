
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type GameMode = "Timed" | "Endless" | "Challenge";

interface User {
  name: string;
  age: number;
  points: number;
}

export interface LeaderboardEntry {
    name: string;
    points: number;
    time: number;
    mode: GameMode;
    date: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  selectedGameMode: GameMode | null;
  setSelectedGameMode: (mode: GameMode) => void;
  addPoints: (points: number) => void;
  spendPoints: (points: number) => void;
  resetProgressForMode: (mode: GameMode) => void;
  leaderboard: LeaderboardEntry[];
  addScoreToLeaderboard: (entry: LeaderboardEntry) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>({ name: '', age: 0, points: 0 });
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    try {
        const savedLeaderboard = localStorage.getItem('riddlemath-leaderboard');
        if (savedLeaderboard) {
            setLeaderboard(JSON.parse(savedLeaderboard));
        }
    } catch (error) {
        console.error("Could not load leaderboard from localStorage", error);
    }
  }, []);

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };
  
  const addPoints = (points: number) => {
    setUserState(currentUser => ({...currentUser, points: currentUser.points + points}));
  }

  const spendPoints = (points: number) => {
    setUserState(currentUser => ({...currentUser, points: Math.max(0, currentUser.points - points)}));
  }
  
  const addScoreToLeaderboard = (entry: LeaderboardEntry) => {
    try {
        const newLeaderboard = [...leaderboard, entry]
            .sort((a, b) => b.points - a.points || a.time - b.time)
            .slice(0, 20); // Keep top 20 scores
        setLeaderboard(newLeaderboard);
        localStorage.setItem('riddlemath-leaderboard', JSON.stringify(newLeaderboard));
    } catch (error) {
        console.error("Could not save score to localStorage", error);
    }
  };

  const resetProgressForMode = (mode: GameMode) => {
    // In a real app, you might have mode-specific progress
    // For now, this is a placeholder.
    console.log(`Resetting progress for ${mode} mode.`);
  }

  return (
    <UserContext.Provider value={{ user, setUser, selectedGameMode, setSelectedGameMode, addPoints, spendPoints, resetProgressForMode, leaderboard, addScoreToLeaderboard }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
