
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameMode = "Timed" | "Endless" | "Challenge";

interface User {
  name: string;
  age: number;
  points: number;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  selectedGameMode: GameMode | null;
  setSelectedGameMode: (mode: GameMode) => void;
  addPoints: (points: number) => void;
  spendPoints: (points: number) => void;
  resetProgressForMode: (mode: GameMode) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>({ name: '', age: 0, points: 0 });
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };
  
  const addPoints = (points: number) => {
    setUserState(currentUser => ({...currentUser, points: currentUser.points + points}));
  }

  const spendPoints = (points: number) => {
    setUserState(currentUser => ({...currentUser, points: Math.max(0, currentUser.points - points)}));
  }

  const resetProgressForMode = (mode: GameMode) => {
    // In a real app, you might have mode-specific progress
    // For now, this is a placeholder.
    console.log(`Resetting progress for ${mode} mode.`);
  }

  return (
    <UserContext.Provider value={{ user, setUser, selectedGameMode, setSelectedGameMode, addPoints, spendPoints, resetProgressForMode }}>
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
