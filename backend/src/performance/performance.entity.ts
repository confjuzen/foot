export interface Performance {
  id: number;
  playerId: number;
  matchId: number;
  goals: number;
  assists: number;
  rating: number;
}

export interface CreatePerformanceDto {
  playerId: number;
  goals: number;
  assists: number;
  rating: number;
}

export interface PlayerWithRating {
  id: number;
  name: string;
  position: string;
  averageRating: number;
}
