import React from 'react';
import { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  showStats?: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, showStats = false }) => {
  return (
    <div>
      <h3>Player List</h3>
      {players.length === 0 ? (
        <p>No players found</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Position</th>
              {showStats && (
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Average rating</th>
              )}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{player.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{player.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{player.position}</td>
                {showStats && (
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {player.averageRating != null ? `${player.averageRating}/10` : 'N/A'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayerList;
