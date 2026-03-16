import axios from 'axios';
import { Player, CreatePlayerDto, Match, CreateMatchDto, Performance, CreatePerformanceDto } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const playerService = {
  getPlayers: async (): Promise<Player[]> => {
    const response = await api.get('/players');
    return response.data;
  },
  
  getPlayersWithStats: async (): Promise<Player[]> => {
    const response = await api.get('/players/stats');
    return response.data;
  },
  
  createPlayer: async (player: CreatePlayerDto): Promise<Player> => {
    const response = await api.post('/players', player);
    return response.data;
  },
};

export const matchService = {
  getMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches');
    return response.data;
  },
  
  createMatch: async (match: CreateMatchDto): Promise<Match> => {
    const response = await api.post('/matches', match);
    return response.data;
  },
  
  getMatchById: async (id: number): Promise<Match> => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },
};

export const performanceService = {
  getPerformancesByMatch: async (matchId: number): Promise<Performance[]> => {
    const response = await api.get(`/matches/${matchId}/performances`);
    return response.data;
  },

  getPerformances: async (): Promise<Performance[]> => {
    const response = await api.get('/performances');
    return response.data;
  },

  getPerformancesByPlayer: async (playerId: number): Promise<Performance[]> => {
    const response = await api.get(`/players/${playerId}/performances`);
    return response.data;
  },
  
  createPerformance: async (matchId: number, performance: CreatePerformanceDto): Promise<Performance> => {
    const response = await api.post(`/matches/${matchId}/performances`, performance);
    return response.data;
  },
};
