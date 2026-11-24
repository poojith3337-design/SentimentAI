
import { useEffect, useState } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import ChartPanel from '../components/ChartPanel';
import ConfusionMatrix from '../components/ConfusionMatrix';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [recordsError, setRecordsError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const [statsResult, recordsResult] = await Promise.allSettled([
        api.get('/stats'),
        api.get('/predictions'),
      ]);

      if (!active) return;

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value.data);
      } else {
        setStatsError('Could not load statistics.');
      }

      if (recordsResult.status === 'fulfilled') {
        const result = recordsResult.value.data;
        const list = Array.isArray(result)
          ? result
          : result.predictions || [];

        setRecords(list);
      } else {
        setRecordsError('Could not load prediction records.');
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const countLabel = (label) =>
    records.filter(
      (record) => record.label?.toLowerCase() === label
    ).length;

  const positive = countLabel('positive');
  const negative = countLabel('negative');
  const neutral = countLabel('neutral');

  const total = stats?.total ?? records.length;

  const averageScore =
    stats?.avg_score ??
    (records.length
      ? records.reduce(
          (sum, record) => sum + Number(record.score || 0),
          0
        ) / records.length
      : 0);

  const recentRecords = records.slice(0, 10);
  const chartRecords = records.slice(0, 7).reverse();

  const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString();
  };

  if (loading) {
    return <p>Loading your dashboard...</p>;
  }

  return (
    <div className="dashboard-content">

      {/* OVERVIEW */}
      <section>
        <h2 className="section-heading">Overview</h2>

        {statsError && <p className="error">{statsError}</p>}

        <div className="grid">
          <StatCard title="Total Predictions" value={total} />
          <StatCard title="Positive" value={positive} />
          <StatCard title="Negative" value={negative} />
          <StatCard title="Neutral" value={neutral} />
        </div>

        <div className="grid">
          <StatCard
            title="Average Score"
            value={Number(averageScore).toFixed(2)}
          />

          <StatCard
            title="Prediction Classes"
            value={stats?.labels?.length ?? 0}
          />
        </div>
      </section>

      {/* SENTIMENT ANALYTICS */}
      <section>
        <h2 className="section-heading">Sentiment Analytics</h2>

        <div className="chart-grid">
          <ChartPanel
            type="line"
            title="Recent Prediction Scores"
            labels={chartRecords.map((_, index) => `#${index + 1}`)}
            data={chartRecords.map((record) =>
              Number(record.score || 0)
            )}
          />

          <ChartPanel
            type="bar"
            title="Sentiment Distribution"
            labels={['Positive', 'Negative', 'Neutral']}
            data={[positive, negative, neutral]}
          />
        </div>
      </section>

      {/* CONFUSION MATRIX */}
      <section>
        <ConfusionMatrix />
      </section>

      {/* RECENT ANALYSIS RECORDS */}
      <section className="card table-card">
        <h2 className="section-heading">
          Recent Analysis Records
        </h2>

        {recordsError && (
          <p className="error">{recordsError}</p>
        )}

        {!recordsError && records.length === 0 && (
          <div className="empty-state">
            No saved predictions yet. Try Sentiment Analysis first.
          </div>
        )}

        {recentRecords.length > 0 && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Input Text</th>
                  <th>Sentiment</th>
                  <th>Score</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentRecords.map((record, index) => {
                  const label = (
                    record.label || 'unknown'
                  ).toLowerCase();

                  return (
                    <tr key={record._id || index}>
                      <td>{record.text || '—'}</td>

                      <td>
                        <span
                          className={`sentiment-pill sentiment-${label}`}
                        >
                          {label}
                        </span>
                      </td>

                      <td>
                        {Number(record.score || 0).toFixed(2)}
                      </td>

                      <td>{record.type || '—'}</td>

                      <td>{formatDate(record.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}