import React from 'react';
import { Activity, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

interface FlightUpdate {
  flight_number: string;
  carrier: string;
  current_delay_minutes: number;
  cascade_probability?: number;
  risk_level?: string;
}

interface StreamStatus {
  is_streaming: boolean;
  current_index: number;
  total_updates: number;
  replay_speed: number;
}

interface StatsPanelProps {
  activeFlights: FlightUpdate[];
  streamStatus: StreamStatus | null;
  isStreaming: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ activeFlights, streamStatus, isStreaming }) => {
  const delayedFlights = activeFlights.filter(f => f.current_delay_minutes > 0);
  const highRiskFlights = activeFlights.filter(f => f.risk_level === 'High');
  const avgDelay = activeFlights.length > 0
    ? activeFlights.reduce((sum, f) => sum + f.current_delay_minutes, 0) / activeFlights.length
    : 0;

  const progress = streamStatus 
    ? (streamStatus.current_index / streamStatus.total_updates) * 100
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Active Flights */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Active Flights</span>
          <Activity className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-white">
          {activeFlights.length}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {isStreaming ? 'Live updates' : 'Paused'}
        </div>
      </div>

      {/* Delayed Flights */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Delayed ({'>'}15m)</span>
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="text-2xl font-bold text-white">
          {delayedFlights.length}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {activeFlights.length > 0 
            ? `${((delayedFlights.length / activeFlights.length) * 100).toFixed(1)}% of fleet`
            : 'No data'
          }
        </div>
      </div>

      {/* High Risk */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">High Risk</span>
          <TrendingUp className="w-4 h-4 text-red-400" />
        </div>
        <div className="text-2xl font-bold text-white">
          {highRiskFlights.length}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Cascade probability &gt; 60%
        </div>
      </div>

      {/* Avg Delay */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Avg Delay</span>
          <Zap className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-2xl font-bold text-white">
          {avgDelay.toFixed(0)}m
        </div>
        <div className="text-xs text-slate-500 mt-1">
          All active flights
        </div>
      </div>

      {/* Stream Progress - Full Width */}
      {streamStatus && (
        <div className="col-span-2 md:col-span-4 bg-slate-800/30 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Stream Progress</span>
            <span className="text-xs text-slate-500">
              {streamStatus.current_index.toLocaleString()} / {streamStatus.total_updates.toLocaleString()} updates
              {' • '}
              {streamStatus.replay_speed}x speed
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {progress.toFixed(1)}% complete
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;