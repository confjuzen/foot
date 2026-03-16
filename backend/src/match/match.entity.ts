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
