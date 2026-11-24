import { useEffect, useState } from 'react';
import api from '../services/api';

export default function History() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/predictions').then((r) => setItems(r.data)).catch(() => setError('Backend unavailable'));
  }, []);
  if (error) return <p className="error">{error}</p>;
  if (!items.length) return <p>No history yet.</p>;
  return (
    <table className="card">
      <thead><tr><th>Time</th><th>Type</th><th>Input</th><th>Label</th><th>Score</th></tr></thead>
      <tbody>
        {items.map((d, i) => (
          <tr key={i}>
            <td>{new Date(d.created_at).toLocaleString()}</td>
            <td>{d.type}</td><td>{d.text}</td><td>{d.label}</td><td>{d.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
