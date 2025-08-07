// Heatmap.tsx
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface Reading {
  id: number;
  source: string;
  value: number;
  timestamp: string;
  metric_type: string;
}

const API_BASE = import.meta.env.VITE_API_URL;

const Heatmap: React.FC = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalData, setModalData] = useState<Reading[] | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  useEffect(() => {
    fetch(`${API_BASE}/api/light-readings/latest`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch latest readings');
        return res.json();
      })
      .then((data) => setReadings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = async (sensor: string, metric: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/light-readings/history?source=${sensor}&metric_type=${metric}`
      );
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setModalData(data);
      setModalTitle(`${metric} history for ${sensor}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const sensors = Array.from(new Set(readings.map((r) => r.source)));
  const metrics = Array.from(new Set(readings.map((r) => r.metric_type)));

  if (loading) return <div className="text-center p-4">Loading heatmap...</div>;
  if (error) return <div className="text-center text-red-600 p-4">Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="table-fixed border-collapse w-full text-center">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-200">Metric / Sensor</th>
            {sensors.map((sensor) => (
              <th key={sensor} className="border p-2 bg-gray-100">
                {sensor}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric}>
              <td className="border p-2 font-semibold bg-gray-100">{metric}</td>
              {sensors.map((sensor) => {
                const reading = readings.find(
                  (r) => r.source === sensor && r.metric_type === metric
                );
                const value = reading?.value ?? 0;
                const opacity = Math.min(value, 1000) / 1000;

                return (
                  <td
                    key={`${sensor}-${metric}`}
                    onClick={() => handleClick(sensor, metric)}
                    className="border p-2 cursor-pointer hover:brightness-90"
                    style={{
                      backgroundColor: `rgba(255, 255, 0, ${opacity})`,
                    }}
                    title={`Click for history of ${metric} from ${sensor}`}
                  >
                    {reading ? value.toFixed(2) : 'N/A'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chart Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-4xl max-h-[90%] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">{modalTitle}</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={modalData.map((d) => ({
                  ...d,
                  timestamp: new Date(d.timestamp).toLocaleTimeString(),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#facc15" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setModalData(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Heatmap;

