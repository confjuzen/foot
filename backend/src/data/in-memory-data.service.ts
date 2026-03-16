import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Player, CreatePlayerDto } from '../player/player.entity';
import { Match, CreateMatchDto } from '../match/match.entity';
import { Performance, CreatePerformanceDto } from '../performance/performance.entity';

interface MatchPerformanceDocument {
  id: number;
  player: Player;
  goals: number;
  assists: number;
  rating: number;
}

interface MatchDocument extends Match {
  performances: MatchPerformanceDocument[];
}

interface DatabaseDocument {
  players: Player[];
  matches: MatchDocument[];
}

@Injectable()
export class InMemoryDataService {
  private readonly dataDir = process.env.DATA_DIR ? process.env.DATA_DIR : join(process.cwd(), '..', 'data');
  private readonly dbFile = join(this.dataDir, 'db.json');

  constructor() {
    this.ensureStorage();
  }

  private ensureStorage() {
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }

    if (existsSync(this.dbFile)) {
      return;
    }

    const emptyDb: DatabaseDocument = { players: [], matches: [] };
    writeFileSync(this.dbFile, JSON.stringify(emptyDb, null, 2) + '\n', 'utf8');
  }

  private readDatabase(): DatabaseDocument {
    this.ensureStorage();
    const raw = readFileSync(this.dbFile, 'utf8').trim();
    if (raw === '') {
      return { players: [], matches: [] };
    }
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== 'object') {
      return { players: [], matches: [] };
    }
    const db = parsed as Partial<DatabaseDocument>;
    return {
      players: Array.isArray(db.players) ? (db.players as Player[]) : [],
      matches: Array.isArray(db.matches) ? (db.matches as MatchDocument[]) : [],
    };
  }

  private writeDatabase(value: DatabaseDocument) {
    this.ensureStorage();
    writeFileSync(this.dbFile, JSON.stringify(value, null, 2) + '\n', 'utf8');
  }

  private nextId(items: Array<{ id: number }>): number {
    if (items.length === 0) return 1;
    return Math.max(...items.map((i) => i.id)) + 1;
  }

  private get players(): Player[] {
    return this.readDatabase().players;
  }
  private set players(value: Player[]) {
    const db = this.readDatabase();
    this.writeDatabase({ ...db, players: value });
  }

  private get matches(): MatchDocument[] {
    return this.readDatabase().matches;
  }
  private set matches(value: MatchDocument[]) {
    const db = this.readDatabase();
    this.writeDatabase({ ...db, matches: value });
  }

  private get performances(): Performance[] {
    return this.matches.flatMap((m) =>
      (m.performances ?? []).map((p) => ({
        id: p.id,
        matchId: m.id,
        playerId: p.player.id,
        goals: p.goals,
        assists: p.assists,
        rating: p.rating,
      })),
    );
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
    return this.matches.map(({ performances: _performances, ...match }) => match);
  }

  createMatch(createMatchDto: CreateMatchDto): Match {
    const matches = this.matches;
    const match: MatchDocument = { id: this.nextId(matches), ...createMatchDto, performances: [] };
    this.matches = [...matches, match];
    const { performances: _performances, ...matchOnly } = match;
    return matchOnly;
  }

  getMatchById(id: number): Match | undefined {
    const match = this.matches.find((m) => m.id === id);
    if (!match) return undefined;
    const { performances: _performances, ...matchOnly } = match;
    return matchOnly;
  }

  // Performances
  getPerformances(): Performance[] {
    return this.performances;
  }

  getPerformancesByMatchId(matchId: number): Performance[] {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) return [];
    return (match.performances ?? []).map((p) => ({
      id: p.id,
      matchId: match.id,
      playerId: p.player.id,
      goals: p.goals,
      assists: p.assists,
      rating: p.rating,
    }));
  }

  getPerformancesByPlayerId(playerId: number): Performance[] {
    return this.performances.filter((perf) => perf.playerId === playerId);
  }

  createPerformance(createPerformanceDto: CreatePerformanceDto, matchId: number): Performance {
    const matches = this.matches;
    const matchIndex = matches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) {
      throw new Error('Match not found');
    }

    const player = this.getPlayerById(createPerformanceDto.playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const allPerformances = this.performances;
    const nextPerformanceId = this.nextId(allPerformances);

    const match = matches[matchIndex];
    const newPerfDoc: MatchPerformanceDocument = {
      id: nextPerformanceId,
      player,
      goals: createPerformanceDto.goals,
      assists: createPerformanceDto.assists,
      rating: createPerformanceDto.rating,
    };

    const updatedMatch: MatchDocument = {
      ...match,
      performances: [...(match.performances ?? []), newPerfDoc],
    };

    this.matches = [...matches.slice(0, matchIndex), updatedMatch, ...matches.slice(matchIndex + 1)];

    return {
      id: newPerfDoc.id,
      matchId,
      playerId: player.id,
      goals: newPerfDoc.goals,
      assists: newPerfDoc.assists,
      rating: newPerfDoc.rating,
    };
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
