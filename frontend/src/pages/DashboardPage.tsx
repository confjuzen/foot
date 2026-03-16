import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Match, Performance, Player } from '../types';
import { matchService, performanceService, playerService } from '../services/api';
import MatchForm from '../components/MatchForm';
import MatchList from '../components/MatchList';
import PerformanceForm from '../components/PerformanceForm';
import PlayerForm from '../components/PlayerForm';
import PlayerList from '../components/PlayerList';

const DashboardPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerPerformances, setPlayerPerformances] = useState<Performance[]>([]);

  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingPerformances, setLoadingPerformances] = useState(true);
  const [loadingPlayerDetail, setLoadingPlayerDetail] = useState(false);

  const selectedPlayer = useMemo(() => {
    if (selectedPlayerId == null) return null;
    return players.find((p) => p.id === selectedPlayerId) ?? null;
  }, [players, selectedPlayerId]);

  const selectedPlayerAverageRating = useMemo(() => {
    if (playerPerformances.length === 0) return null;
    const total = playerPerformances.reduce((sum, perf) => sum + perf.rating, 0);
    return Math.round((total / playerPerformances.length) * 10) / 10;
  }, [playerPerformances]);

  const playerPerformancesWithMatch = useMemo(() => {
    return playerPerformances
      .map((perf) => {
        const match = matches.find((m) => m.id === perf.matchId);
        return {
          ...perf,
          matchLabel: match ? `${match.teamA} vs ${match.teamB}` : `Match ${perf.matchId}`,
          matchDate: match?.date,
        };
      })
      .sort((a, b) => (a.matchDate ?? '').localeCompare(b.matchDate ?? ''));
  }, [matches, playerPerformances]);

  const loadPlayers = useCallback(async () => {
    setLoadingPlayers(true);
    try {
      const playersData = await playerService.getPlayers();
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoadingPlayers(false);
    }
  }, []);

  const loadPerformances = useCallback(async () => {
    setLoadingPerformances(true);
    try {
      const performancesData = await performanceService.getPerformances();
      setPerformances(performancesData);
    } catch (error) {
      console.error('Error loading performances:', error);
      setPerformances([]);
    } finally {
      setLoadingPerformances(false);
    }
  }, []);

  const loadMatches = useCallback(async () => {
    setLoadingMatches(true);
    try {
      const matchesData = await matchService.getMatches();
      setMatches(matchesData);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  const loadSelectedPlayer = useCallback(async (playerId: number) => {
    setLoadingPlayerDetail(true);
    try {
      const performancesData = await performanceService.getPerformancesByPlayer(playerId);
      setPlayerPerformances(performancesData);
    } catch (error) {
      console.error('Error loading player performances:', error);
      setPlayerPerformances([]);
    } finally {
      setLoadingPlayerDetail(false);
    }
  }, []);

  useEffect(() => {
    loadPlayers();
    loadMatches();
    loadPerformances();
  }, [loadMatches, loadPerformances, loadPlayers]);

  useEffect(() => {
    if (selectedPlayerId == null) {
      setPlayerPerformances([]);
      return;
    }

    loadSelectedPlayer(selectedPlayerId);
  }, [loadSelectedPlayer, selectedPlayerId]);

  useEffect(() => {
    if (selectedPlayerId != null) return;
    if (players.length === 0) return;
    setSelectedPlayerId(players[0].id);
  }, [players, selectedPlayerId]);

  const onPerformanceCreated = useCallback(async () => {
    if (selectedPlayerId != null) {
      await loadSelectedPlayer(selectedPlayerId);
    }
    await loadPerformances();
  }, [loadPerformances, loadSelectedPlayer, selectedPlayerId]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Club Dashboard</h1>
          <div style={{ color: '#666', marginTop: '6px' }}>Players, matches, and performance tracking</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ marginTop: 0 }}>Players</h2>
          <PlayerForm onPlayerCreated={async () => {
            await loadPlayers();
          }} />
          {loadingPlayers ? <p>Loading...</p> : <PlayerList players={players} />}
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ marginTop: 0 }}>Player Statistics</h2>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#444' }}>Selected player</div>
            <select
              value={selectedPlayerId ?? 0}
              onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
              style={{ padding: '8px', width: '260px' }}
              disabled={players.length === 0}
            >
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.position})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div style={{ fontWeight: 600 }}>{selectedPlayer ? selectedPlayer.name : 'No player selected'}</div>
            <div style={{ color: '#666', marginTop: '4px' }}>
              Average rating: {selectedPlayerAverageRating == null ? '-' : `${selectedPlayerAverageRating}/10`}
            </div>
          </div>

          <h3 style={{ marginTop: 0 }}>Match-by-match</h3>
          {loadingPlayerDetail ? (
            <p>Loading...</p>
          ) : playerPerformancesWithMatch.length === 0 ? (
            <p>No performances recorded for this player</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Match</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Goals</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Assists</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {playerPerformancesWithMatch.map((perf) => (
                  <tr key={perf.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.matchLabel}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.matchDate ?? '-'}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.goals}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.assists}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.rating}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ marginTop: 0 }}>Performances</h2>
          <PerformanceForm matches={matches} players={players} onPerformanceCreated={onPerformanceCreated} />

          {loadingPerformances ? (
            <p>Loading...</p>
          ) : performances.length === 0 ? (
            <p>No performances recorded</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Match ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Player ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Goals</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Assists</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {performances.map((perf) => (
                  <tr key={perf.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.matchId}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.playerId}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.goals}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.assists}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{perf.rating}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ marginTop: 0 }}>Matches</h2>
          <MatchForm onMatchCreated={async () => {
            await loadMatches();
          }} />
          {loadingMatches ? (
            <p>Loading...</p>
          ) : (
            <MatchList matches={matches} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
