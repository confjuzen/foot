import React from 'react';
import { Performance } from '../types';

interface PerformanceListProps {
  performances: Performance[];
}

const PerformanceList: React.FC<PerformanceListProps> = ({ performances }) => {
  return (
    <div>
      <h3>Player Performances</h3>
      {performances.length === 0 ? (
        <p>No performances recorded for this match</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Player</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Goals</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Assists</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {performances.map((performance) => (
              <tr key={performance.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {performance.playerName || `Player ${performance.playerId}`}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{performance.goals}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{performance.assists}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{performance.rating}/10</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PerformanceList;
