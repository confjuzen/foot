import React, { useState } from 'react';
import { matchService } from '../services/api';

interface MatchFormProps {
  onMatchCreated: () => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ onMatchCreated }) => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB || !date) return;

    setLoading(true);
    try {
      await matchService.createMatch({ teamA, teamB, date });
      setTeamA('');
      setTeamB('');
      setDate('');
      onMatchCreated();
    } catch (error) {
      console.error('Error creating match:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h3>Create Match</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Team A"
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '150px' }}
        />
        <input
          type="text"
          placeholder="Team B"
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '150px' }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default MatchForm;
