// Heatmap.tsx
import React, { useEffect, useState } from 'react';

interface Reading {
  id: number;
  source: string;
  value: number;
  timestamp: string;
  metric_type: string;
}

const Heatmap: React.FC = () => {
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    fetch('https://your-api.fly.dev/api/light-readings/latest')
      .then(res => res.json())
      .then(data => setReadings(data));
  }, []);

  const handleClick = async (sensor: string, metric: string) => {
    const res = await fetch(
      `https://your-api.fly.dev/api/light-readings/history?source=${sensor}&metric_type=${metric}`
    );
    const data = await res.json();
    // open modal or chart here with historical `data`
  };

  const sensors = Array.from(new Set(readings.map(r => r.source)));
  const metrics = Array.from(new Set(readings.map(r => r.metric_type)));

  return (
    <div className="heatmap">
      <table>
        <thead>
          <tr>
            <th>Metric \ Sensor</th>
            {sensors.map(sensor => <th key={sensor}>{sensor}</th>)}
          </tr>
        </thead>
        <tbody>
          {metrics.map(metric => (
            <tr key={metric}>
              <td>{metric}</td>
              {sensors.map(sensor => {
                const reading = readings.find(r => r.source === sensor && r.metric_type === metric);
                return (
                  <td
                    key={`${sensor}-${metric}`}
                    onClick={() => handleClick(sensor, metric)}
                    style={{ backgroundColor: `rgba(255, 255, 0, ${Math.min(reading?.value ?? 0, 1000)/1000})` }}
                  >
                    {reading?.value.toFixed(2) ?? 'N/A'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Heatmap;

