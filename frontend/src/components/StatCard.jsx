
export default function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value ?? 0}</div>
      <div className="stat-note">Based on saved analysis records</div>
    </div>
  );
}