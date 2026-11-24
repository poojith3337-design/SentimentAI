
import { useEffect, useState } from "react";
import api from "../services/api";
import "./ConfusionMatrix.css";

const labels = ["positive", "neutral", "negative"];

export default function ConfusionMatrix() {
  const [predictions, setPredictions] = useState([]);
  const [matrix, setMatrix] = useState(null);
  const [actualLabels, setActualLabels] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");

      const [predictionResponse, matrixResponse] = await Promise.all([
        api.get("/predictions"),
        api.get("/confusion-matrix"),
      ]);

      const predictionData = predictionResponse.data;

      const records = Array.isArray(predictionData)
        ? predictionData
        : predictionData.predictions || [];

      setPredictions(
        records.filter((item) => item.type === "sentiment")
      );

      setMatrix(matrixResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load confusion matrix. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveActualLabel = async (id) => {
    const actual = actualLabels[id];

    if (!actual) {
      setError("Please select the actual sentiment.");
      return;
    }

    try {
      setSavingId(id);
      setError("");

      await api.post(`/predictions/${id}/actual`, {
        actual_sentiment: actual,
      });

      setActualLabels((previous) => ({
        ...previous,
        [id]: "",
      }));

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Could not save actual sentiment."
      );
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="cm-loading">Loading confusion matrix...</div>;
  }

  return (
    <section className="cm-container">
      <div className="cm-header">
        <div>
          <span className="cm-eyebrow">MODEL EVALUATION</span>
          <h2>Confusion Matrix</h2>
          <p>Compare actual sentiment with AI predictions.</p>
        </div>

        <button className="cm-refresh" onClick={loadData}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="cm-error">{error}</div>}

      <div className="cm-info">
        <strong>How it works:</strong> Select the correct actual sentiment
        for each prediction. Only verified records are included in the
        confusion matrix.
      </div>

      <div className="cm-card">
        <h3>Confusion Matrix Analysis</h3>

        {matrix && (
          <>
            <div className="cm-table-wrap">
              <table className="cm-table">
                <thead>
                  <tr>
                    <th>Actual ↓ / Predicted →</th>
                    {labels.map((label) => (
                      <th key={label}>{label}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {labels.map((actual, rowIndex) => (
                    <tr key={actual}>
                      <th>{actual}</th>

                      {labels.map((predicted, colIndex) => (
                        <td
                          key={predicted}
                          className={
                            rowIndex === colIndex
                              ? "cm-correct"
                              : "cm-incorrect"
                          }
                        >
                          {matrix.matrix?.[rowIndex]?.[colIndex] ?? 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="cm-count">
              Evaluated records: {matrix.total_records ?? 0}
            </p>

            <div className="cm-metrics">
              <div className="cm-metric">
                <span>Accuracy</span>
                <strong>{matrix.accuracy ?? 0}%</strong>
              </div>

              <div className="cm-metric">
                <span>Precision</span>
                <strong>{matrix.precision ?? 0}%</strong>
              </div>

              <div className="cm-metric">
                <span>Recall</span>
                <strong>{matrix.recall ?? 0}%</strong>
              </div>

              <div className="cm-metric">
                <span>F1 Score</span>
                <strong>{matrix.f1_score ?? 0}%</strong>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="cm-card">
        <h3>Verify Sentiment Predictions</h3>

        <p className="cm-subtitle">
          Select the actual sentiment and save it for evaluation.
        </p>

        {predictions.length === 0 ? (
          <p className="cm-empty">
            No sentiment predictions found. Analyze some text first.
          </p>
        ) : (
          <div className="cm-records">
            {predictions.map((item) => (
              <div className="cm-record" key={item._id}>
                <div className="cm-record-content">
                  <p className="cm-record-text">
                    {item.text || "No text available"}
                  </p>

                  <span className="cm-predicted">
                    AI prediction: <strong>{item.label}</strong>
                  </span>

                  {item.actual_sentiment && (
                    <span className="cm-predicted">
                      {" "} | Actual: <strong>{item.actual_sentiment}</strong>
                    </span>
                  )}
                </div>

                <div className="cm-record-actions">
                  <select
                    value={
                      actualLabels[item._id] ??
                      item.actual_sentiment ??
                      ""
                    }
                    onChange={(e) =>
                      setActualLabels((previous) => ({
                        ...previous,
                        [item._id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select actual label</option>

                    {labels.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => saveActualLabel(item._id)}
                    disabled={savingId === item._id}
                  >
                    {savingId === item._id ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}