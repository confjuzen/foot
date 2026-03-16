import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Player, CreatePlayerDto } from '../player/player.entity';
import { Match, CreateMatchDto } from '../match/match.entity';
import { Performance, CreatePerformanceDto } from '../performance/performance.entity';

@Injectable()
export class InMemoryDataService {
  private readonly dataDir = process.env.DATA_DIR ? process.env.DATA_DIR : join(process.cwd(), '..', 'data');
  private readonly playersFile = join(this.dataDir, 'players.json');
  private readonly matchesFile = join(this.dataDir, 'matches.json');
  private readonly performancesFile = join(this.dataDir, 'performances.json');

  constructor() {
    this.ensureStorage();
  }

  private ensureStorage() {
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }

    if (!existsSync(this.playersFile)) {
      writeFileSync(this.playersFile, '[]\n', 'utf8');
    }
    if (!existsSync(this.matchesFile)) {
      writeFileSync(this.matchesFile, '[]\n', 'utf8');
    }
    if (!existsSync(this.performancesFile)) {
      writeFileSync(this.performancesFile, '[]\n', 'utf8');
    }
  }

  private readJsonArrayFile<T>(filePath: string): T[] {
    this.ensureStorage();
    const raw = readFileSync(filePath, 'utf8').trim();
    if (raw === '') return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as T[];
  }

  private writeJsonArrayFile<T>(filePath: string, value: T[]) {
    this.ensureStorage();
    writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
  }

  private nextId(items: Array<{ id: number }>): number {
    if (items.length === 0) return 1;
    return Math.max(...items.map((i) => i.id)) + 1;
  }

  private get players(): Player[] {
    return this.readJsonArrayFile<Player>(this.playersFile);
  }
  private set players(value: Player[]) {
    this.writeJsonArrayFile<Player>(this.playersFile, value);
  }

  private get matches(): Match[] {
    return this.readJsonArrayFile<Match>(this.matchesFile);
  }
  private set matches(value: Match[]) {
    this.writeJsonArrayFile<Match>(this.matchesFile, value);
  }

  private get performances(): Performance[] {
    return this.readJsonArrayFile<Performance>(this.performancesFile);
  }
  private set performances(value: Performance[]) {
    this.writeJsonArrayFile<Performance>(this.performancesFile, value);
  }

  // Players
  getPlayers(): Player[] {
    return this.players;
  }

  createPlayer(createPlayerDto: CreatePlayerDto): Player {
    const players = this.players;
    const player: Player = { id: this.nextId(players), ...createPlayerDto };
    this.players = [...players, player];
    return player;
  }

  getPlayerById(id: number): Player | undefined {
    return this.players.find((player) => player.id === id);
  }

  // Matches
  getMatches(): Match[] {
    return this.matches;
  }

  createMatch(createMatchDto: CreateMatchDto): Match {
    const matches = this.matches;
    const match: Match = { id: this.nextId(matches), ...createMatchDto };
    this.matches = [...matches, match];
    return match;
  }

  getMatchById(id: number): Match | undefined {
    return this.matches.find((match) => match.id === id);
  }

  // Performances
  getPerformances(): Performance[] {
    return this.performances;
  }

  getPerformancesByMatchId(matchId: number): Performance[] {
    return this.performances.filter((perf) => perf.matchId === matchId);
  }

  getPerformancesByPlayerId(playerId: number): Performance[] {
    return this.performances.filter((perf) => perf.playerId === playerId);
  }

  createPerformance(createPerformanceDto: CreatePerformanceDto, matchId: number): Performance {
    const performances = this.performances;
    const performance: Performance = {
      id: this.nextId(performances),
      matchId,
      ...createPerformanceDto,
    };
    this.performances = [...performances, performance];
    return performance;
  }

  getPlayerAverageRating(playerId: number): number {
    const playerPerformances = this.performances.filter((perf) => perf.playerId === playerId);
    if (playerPerformances.length === 0) {
      return 0;
    }
    const totalRating = playerPerformances.reduce((sum, perf) => sum + perf.rating, 0);
    return Math.round((totalRating / playerPerformances.length) * 10) / 10;
  }

  getAllPlayersWithAverageRating() {
    return this.players.map((player) => ({
      ...player,
      averageRating: this.getPlayerAverageRating(player.id),
    }));
  }
}
