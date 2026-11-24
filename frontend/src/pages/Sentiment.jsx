import { useState } from 'react';
import api from '../services/api';

export default function Sentiment() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function listen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setError('Speech recognition not supported; type your text instead.');
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = true;
    rec.onresult = (e) =>
      setText(Array.from(e.results).map((r) => r[0].transcript).join(''));
    rec.start();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post('/sentiment', { text });
      setResult(res.data);
    } catch {
      setError('Request failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Sentiment Analysis</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" rows={4} />
      <div>
        <button type="button" onClick={listen}>🎤 Speak</button>{' '}
        <button type="submit" disabled={loading || !text.trim()}>{loading ? 'Analyzing...' : 'Analyze'}</button>
      </div>
      {error && <p className="error">{error}</p>}
      {result && <p>Result: <b>{result.label}</b> (score {result.score})</p>}
    </form>
  );
}
