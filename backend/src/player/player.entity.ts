export interface Player {
  id: number;
  name: string;
  position: string;
}

export interface CreatePlayerDto {
  name: string;
  position: string;
}
