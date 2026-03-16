import React, { useState } from 'react';
import { playerService } from '../services/api';

interface PlayerFormProps {
  onPlayerCreated: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onPlayerCreated }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    setLoading(true);
    try {
      await playerService.createPlayer({ name, position });
      setName('');
      setPosition('');
      onPlayerCreated();
    } catch (error) {
      console.error('Error creating player:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h3>Add Player</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '150px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default PlayerForm;
