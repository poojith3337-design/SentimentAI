import { useState } from 'react';
import api from '../services/api';

export default function ImageClassifier() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function pick(e) {
    const f = e.target.files[0];
    setFile(f); setResult(null); setError('');
    setPreview(f ? URL.createObjectURL(f) : '');
  }

  async function upload() {
    const formData = new FormData();
    formData.append('image', file);
    setLoading(true); setError('');
    try {
      const res = await api.post('/classify', formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Image Classification</h2>
      <input type="file" accept="image/png,image/jpeg" onChange={pick} />
      {preview && <img src={preview} alt="preview" className="preview" />}
      <div><button onClick={upload} disabled={!file || loading}>{loading ? 'Uploading...' : 'Classify'}</button></div>
      {error && <p className="error">{error}</p>}
      {result && <p>Class: <b>{result.label}</b> (confidence {result.confidence})</p>}
    </div>
  );
}
