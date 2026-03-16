export interface Player {
  id: number;
  name: string;
  position: string;
  averageRating?: number;
}

export interface CreatePlayerDto {
  name: string;
  position: string;
}

export interface Match {
  id: number;
  teamA: string;
  teamB: string;
  date: string;
}

export interface CreateMatchDto {
  teamA: string;
  teamB: string;
  date: string;
}

export interface Performance {
  id: number;
  playerId: number;
  matchId: number;
  goals: number;
  assists: number;
  rating: number;
  playerName?: string;
}

export interface CreatePerformanceDto {
  playerId: number;
  goals: number;
  assists: number;
  rating: number;
}
