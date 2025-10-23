import { useEffect, useState, useMemo } from "react";
import "./heatmap.css";

// Update with your backend API base URL
const API_BASE = "http://localhost:3000";

interface Reading {
  id: number;
  plant_id: number;
  value: number;
  timestamp: string;
  metric_type: string;
}

interface Plant {
  plant_id: number;
  name: string;
  location?: string;
  type?: string;
}

interface HeatmapCell {
  plantId: number;
  plantName: string;
  value: number;
  color: string;
  timestamp: string;
  metricType: string;
}

interface HistoryEntry {
  timestamp: string;
  value: number;
}

export default function Heatmap() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch latest readings
  const fetchReadings = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE}/api/light-readings/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReadings(data);
    } catch (err) {
      console.error("Error fetching readings:", err);
      setError("Failed to fetch sensor readings. Make sure the API server is running.");
    }
  };

  // Fetch plants
  const fetchPlants = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/plants`);
      if (response.ok) {
        const data = await response.json();
        setPlants(data);
      } else {
        setPlants([]);
      }
    } catch (err) {
      console.error("Error fetching plants:", err);
      setPlants([]);
    }
  };

  // Fetch history for a specific sensor-plant combination
  const fetchHistory = async (plantId: number, metricType: string) => {
    try {
      setHistoryLoading(true);
      const response = await fetch(
        `${API_BASE}/api/light-readings/history?plant_id=${plantId}&metric_type=${metricType}&limit=100`
      );
      console.log('metricType:', metricType)
      if (response.ok) {
        const data = await response.json();
        setSelectedHistory(data);
      } else {
        setSelectedHistory([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setSelectedHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle cell click
  const handleCellClick = async (cell: HeatmapCell) => {
    if (cell.value === 0) return; // Don't fetch history for empty cells
    
    setSelectedCell(cell);
    await fetchHistory(cell.plantId, cell.metricType);
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchReadings(), fetchPlants()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Color scale function
  const getColorForValue = (value: number, metricType: string): string => {
    if (metricType === 'lux') {
      // Light intensity color scale
      if (value >= 800) return "#1a9850"; // High light - green
      if (value >= 400) return "#fee08b"; // Medium light - yellow
      if (value >= 100) return "#fd8d3c"; // Low light - orange
      return "#d73027"; // Very low light - red
    } else if (metricType === 'temperature') {
      // Temperature color scale
      if (value >= 30) return "#d73027"; // Hot - red
      if (value >= 25) return "#fd8d3c"; // Warm - orange
      if (value >= 20) return "#1a9850"; // Ideal - green
      if (value >= 15) return "#91cf60"; // Cool - light green
      return "#4575b4"; // Cold - blue
    } else if (metricType === 'humidity') {
      // Humidity color scale
      if (value >= 80) return "#4575b4"; // High humidity - blue
      if (value >= 60) return "#1a9850"; // Good humidity - green
      if (value >= 40) return "#fee08b"; // Low humidity - yellow
      return "#d73027"; // Very low humidity - red
    }
    
    // Default color scale
    const normalized = Math.min(Math.max(value / 1000, 0), 1);
    const hue = (1 - normalized) * 120; // Green to red
    return `hsl(${hue}, 70%, 50%)`;
  };

  // Create heatmap data - only from real database data
  const heatmapData = useMemo(() => {
    if (!plants.length || !readings.length) return [];
    const metricTypes = Array.from(new Set(readings.map(r => r.metric_type))); // Fix this logic eventually when more sensors are created
    const result: HeatmapCell[][] = [];

    metricTypes.forEach((metricType) => {
      
      const row: HeatmapCell[] = [];
      console.log('plant:', plants)
      plants.forEach((plant) => {
        const reading = readings.find(r => r.plant_id === plant.plant_id && r.metric_type === metricType);
        console.log('plant ----', plant)
        if (reading) {
          row.push({
            plantId: plant.plant_id,
            plantName: plant.name,
            value: reading.value,
            color: getColorForValue(reading.value, metricType),
            timestamp: reading.timestamp,
            metricType: reading.metric_type
          });
        } else {
          // Empty cell for plants without readings
          row.push({
            plantId: plant.plant_id,
            plantName: plant.name,
            value: 0,
            color: "#f8f9fa",
            timestamp: "",
            metricType: metricType
          });
        }
      });
      result.push(row);
    });

    return result;
  }, [readings, plants]);

  // Get metric type display name
  const getMetricDisplayName = (metricType: string) => {
    const displayNames: Record<string, string> = {
      'lux': 'Light',
      'temperature': 'Temp',
      'humidity': 'Humidity',
      'moisture': 'Moisture',
      'ph': 'pH'
    };
    return displayNames[metricType] || metricType;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    if (!timestamp) return '';
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatTimestamp(timestamp);
  };

  // Render chart
  const renderChart = (history: HistoryEntry[]) => {
    if (history.length === 0) return <p>No history data available</p>;

    const chartWidth = 400;
    const chartHeight = 200;
    const padding = 40;
    const chartAreaWidth = chartWidth - (padding * 2);
    const chartAreaHeight = chartHeight - (padding * 2);

    // Sort history by timestamp (oldest first)
    const sortedHistory = [...history].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Calculate chart scales
    const values = sortedHistory.map(h => h.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    // Create SVG path for the line
    const points = sortedHistory.map((entry, index) => {
      const x = padding + (index / (sortedHistory.length - 1)) * chartAreaWidth;
      const y = padding + chartAreaHeight - ((entry.value - minValue) / valueRange) * chartAreaHeight;
      return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;

    // Create Y-axis labels
    const yLabels = [];
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (valueRange * i / 4);
      const y = padding + chartAreaHeight - (i / 4) * chartAreaHeight;
      yLabels.push(
        <text key={i} x={padding - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#666">
          {value.toFixed(1)}
        </text>
      );
    }

    // Create X-axis labels (show first, middle, and last timestamps)
    const xLabels = [];
    if (sortedHistory.length > 0) {
      const firstTime = new Date(sortedHistory[0].timestamp).toLocaleTimeString();
      const middleTime = new Date(sortedHistory[Math.floor(sortedHistory.length / 2)].timestamp).toLocaleTimeString();
      const lastTime = new Date(sortedHistory[sortedHistory.length - 1].timestamp).toLocaleTimeString();
      
      xLabels.push(
        <text key="first" x={padding} y={chartHeight - 10} textAnchor="middle" fontSize="10" fill="#666">
          {firstTime}
        </text>,
        <text key="middle" x={padding + chartAreaWidth / 2} y={chartHeight - 10} textAnchor="middle" fontSize="10" fill="#666">
          {middleTime}
        </text>,
        <text key="last" x={padding + chartAreaWidth} y={chartHeight - 10} textAnchor="middle" fontSize="10" fill="#666">
          {lastTime}
        </text>
      );
    }

    return (
      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight} className="history-chart-svg">
          {/* Chart background */}
          <rect x={padding} y={padding} width={chartAreaWidth} height={chartAreaHeight} fill="#f8f9fa" stroke="#e9ecef" />
          
          {/* Grid lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i / 4) * chartAreaHeight}
              x2={padding + chartAreaWidth}
              y2={padding + (i / 4) * chartAreaHeight}
              stroke="#e9ecef"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {yLabels}
          
          {/* X-axis labels */}
          {xLabels}
          
          {/* Data line */}
          <path d={pathData} stroke="#007bff" strokeWidth="2" fill="none" />
          
          {/* Data points */}
          {sortedHistory.map((entry, index) => {
            const x = padding + (index / (sortedHistory.length - 1)) * chartAreaWidth;
            const y = padding + chartAreaHeight - ((entry.value - minValue) / valueRange) * chartAreaHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#007bff"
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
        </svg>
        
        {/* Chart stats */}
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Min:</span>
            <span className="stat-value">{minValue.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Max:</span>
            <span className="stat-value">{maxValue.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg:</span>
            <span className="stat-value">{(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="heatmap-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (!plants.length) {
    return (
      <div className="heatmap-container">
        <div className="no-data">
          <h2>No Plants Found</h2>
          <p>Add plants to your database to see the heatmap.</p>
        </div>
      </div>
    );
  }

  if (!readings.length) {
    return (
      <div className="heatmap-container">
        <div className="no-data">
          <h2>No Sensor Data</h2>
          <p>No sensor readings found. Make sure your sensors are sending data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h1>Plant Monitor</h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <div className="banner-content">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="close-banner">
              ×
            </button>
          </div>
        </div>
      )}

      {heatmapData.length > 0 ? (
        <div className="heatmap-wrapper">
          <div className="heatmap-table">
            <table>
              <thead>
                <tr>
                  <th>Sensor</th>
                  {plants.map((plant) => (
                    <th key={plant.plant_id}>{plant.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, metricIndex) => (
                  <tr key={metricIndex}>
                    <td className="sensor-label">
                      {getMetricDisplayName(readings[metricIndex]?.metric_type || '')}
                    </td>
                    {row.map((cell, plantIndex) => (
                      <td
                        key={`${metricIndex}-${plantIndex}`}
                        className={`heatmap-cell ${cell.value === 0 ? 'empty' : 'has-data clickable'}`}
                        style={{ backgroundColor: cell.color }}
                        onClick={() => handleCellClick(cell)}
                        title={`${cell.plantName}: ${cell.value} (${formatRelativeTime(cell.timestamp)})`}
                      >
                        {cell.value > 0 ? (
                          <div className="cell-content">
                            <div className="cell-value">{cell.value}</div>
                            <div className="cell-timestamp">{formatRelativeTime(cell.timestamp)}</div>
                          </div>
                        ) : (
                          'No Data'
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="heatmap-legend">
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#1a9850" }}></div>
                <span>Optimal</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#fee08b" }}></div>
                <span>Good</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#fd8d3c" }}></div>
                <span>Warning</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#d73027" }}></div>
                <span>Critical</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <p>No data available</p>
        </div>
      )}

      {/* History Modal */}
      {selectedCell && (
        <div className="history-modal" onClick={() => setSelectedCell(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                History for {selectedCell.plantName} - {getMetricDisplayName(selectedCell.metricType)}
              </h3>
              <button 
                className="close-button"
                onClick={() => setSelectedCell(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="current-value">
                <span className="value-label">Current Value:</span>
                <span className="value-display">
                  {selectedCell.value}
                </span>
                <span className="timestamp">
                  {formatTimestamp(selectedCell.timestamp)}
                </span>
              </div>
              
              <div className="history-chart">
                <h4>Last 100 Readings</h4>
                {historyLoading ? (
                  <div className="history-loading">
                    <div className="spinner"></div>
                    <p>Loading history...</p>
                  </div>
                ) : (
                  renderChart(selectedHistory)
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

