import React from 'react';
import { Match } from '../types';

interface MatchListProps {
  matches: Match[];
  selectedMatchId?: number;
  onSelectMatch?: (matchId: number) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, selectedMatchId, onSelectMatch }) => {
  return (
    <div>
      <h3>Match List</h3>
      {matches.length === 0 ? (
        <p>No matches found</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Team A</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Team B</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr
                key={match.id}
                style={match.id === selectedMatchId ? { backgroundColor: '#eef6ff' } : undefined}
                onClick={onSelectMatch ? () => onSelectMatch(match.id) : undefined}
                role={onSelectMatch ? 'button' : undefined}
                tabIndex={onSelectMatch ? 0 : undefined}
                onKeyDown={
                  onSelectMatch
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectMatch(match.id);
                        }
                      }
                    : undefined
                }
              >
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{match.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{match.teamA}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{match.teamB}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{match.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MatchList;
