import React, { useMemo, useState, useEffect } from 'react';
import { Match, Player } from '../types';
import { matchService, performanceService, playerService } from '../services/api';

interface PerformanceFormProps {
  matchId?: number;
  matches?: Match[];
  players?: Player[];
  onPerformanceCreated: () => void;
}

const PerformanceForm: React.FC<PerformanceFormProps> = ({ matchId, matches, players: playersProp, onPerformanceCreated }) => {
  const [selectedMatchId, setSelectedMatchId] = useState<number>(matchId ?? 0);
  const [playerId, setPlayerId] = useState<number>(0);
  const [goals, setGoals] = useState<number>(0);
  const [assists, setAssists] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [availableMatches, setAvailableMatches] = useState<Match[]>(matches ?? []);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canChooseMatch = useMemo(() => (matchId == null ? true : false), [matchId]);

  useEffect(() => {
    if (playersProp) {
      setPlayers(playersProp);
      return;
    }

    loadPlayers();
  }, [playersProp]);

  useEffect(() => {
    if (players.length === 0) {
      setPlayerId(0);
      return;
    }

    const stillExists = players.some((p) => p.id === playerId);
    if (!stillExists) {
      setPlayerId(players[0].id);
    }
  }, [playerId, players]);

  useEffect(() => {
    if (matchId != null) {
      setSelectedMatchId(matchId);
    }
  }, [matchId]);

  useEffect(() => {
    if (matches) {
      setAvailableMatches(matches);

      if (matchId == null && selectedMatchId === 0 && matches.length > 0) {
        setSelectedMatchId(matches[0].id);
      }
    }
  }, [matchId, matches, selectedMatchId]);

  useEffect(() => {
    if (!canChooseMatch) return;
    if (matches) return;

    const loadMatches = async () => {
      try {
        const matchesData = await matchService.getMatches();
        setAvailableMatches(matchesData);
        if (selectedMatchId === 0 && matchesData.length > 0) {
          setSelectedMatchId(matchesData[0].id);
        }
      } catch (error) {
        console.error('Error loading matches:', error);
      }
    };

    loadMatches();
  }, [canChooseMatch, matches, selectedMatchId]);

  const loadPlayers = async () => {
    try {
      const playersData = await playerService.getPlayers();
      setPlayers(playersData);
      if (playersData.length > 0) {
        setPlayerId(playersData[0].id);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playerId === 0) return;
    if (selectedMatchId === 0) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      await performanceService.createPerformance(selectedMatchId, { playerId, goals, assists, rating });
      setGoals(0);
      setAssists(0);
      setRating(0);
      onPerformanceCreated();
    } catch (error) {
      const message = (error as any)?.response?.data?.message;
      setErrorMessage(typeof message === 'string' ? message : 'Error creating performance');
      console.error('Error creating performance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h3>Add Performance</h3>
      {errorMessage ? <div style={{ marginBottom: '10px', color: '#b00020' }}>{errorMessage}</div> : null}
      <div style={{ marginBottom: '10px' }}>
        {canChooseMatch ? (
          <>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#444' }}>Match</div>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(Number(e.target.value))}
              style={{ padding: '8px', marginRight: '10px', width: '260px' }}
            >
              {availableMatches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.teamA} vs {match.teamB} ({match.date})
                </option>
              ))}
            </select>
          </>
        ) : null}

        <div style={{ marginTop: canChooseMatch ? '10px' : 0, marginBottom: '8px', fontSize: '14px', color: '#444' }}>Player</div>
        <select
          value={playerId}
          onChange={(e) => setPlayerId(Number(e.target.value))}
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        >
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.position})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Goals"
          value={goals}
          onChange={(e) => setGoals(Number(e.target.value))}
          min="0"
          style={{ padding: '8px', marginRight: '10px', width: '80px' }}
        />
        <input
          type="number"
          placeholder="Assists"
          value={assists}
          onChange={(e) => setAssists(Number(e.target.value))}
          min="0"
          style={{ padding: '8px', marginRight: '10px', width: '120px' }}
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ padding: '8px', marginRight: '10px', width: '130px' }}
        >
          {Array.from({ length: 11 }).map((_, i) => (
            <option key={i} value={i}>
              Rating: {i}/10
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default PerformanceForm;
