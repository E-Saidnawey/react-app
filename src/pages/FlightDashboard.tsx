import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import FlightTable from '../components/FlightTable';
import StatsPanel from '../components/StatsPanel';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface FlightUpdate {
  flight_number: string;
  tail_number: string;
  carrier: string;
  origin: string;
  destination: string;
  scheduled_time: string;
  actual_time?: string;
  current_delay_minutes: number;
  update_time: string;
  status: string;
  event_type: string;
  delay_reasons?: Record<string, number>;
  cascade_probability?: number;
  risk_level?: string;
}

interface StreamStatus {
  is_streaming: boolean;
  current_index: number;
  total_updates: number;
  replay_speed: number;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const FlightDashboard: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeFlights, setActiveFlights] = useState<FlightUpdate[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [connected, setConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✓ Connected to telemetry stream');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('✗ Disconnected from telemetry stream');
      setConnected(false);
    });

    newSocket.on('telemetry_update', (update: FlightUpdate) => {
      // Update or add flight to active flights
      setActiveFlights(prev => {
        const index = prev.findIndex(
          f => f.flight_number === update.flight_number && f.carrier === update.carrier
        );
        
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = update;
          return updated;
        } else {
          return [...prev, update];
        }
      });
    });

    newSocket.on('active_flights', (data: { count: number; flights: FlightUpdate[] }) => {
      setActiveFlights(data.flights);
    });

    newSocket.on('stream_status', (status: StreamStatus) => {
      setStreamStatus(status);
      setIsStreaming(status.is_streaming);
    });

    newSocket.on('stream_complete', () => {
      setIsStreaming(false);
      console.log('✓ Stream complete');
    });

    newSocket.on('stream_restart', (data: { message: string; total_updates: number }) => {
      console.log('↻ Stream restarting:', data.message);
      setActiveFlights([]);
      // Keep isStreaming = true, stream continues automatically
    });

    newSocket.on('stream_reset', () => {
      setActiveFlights([]);
      console.log('↻ Stream reset');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleStartStream = useCallback(() => {
    if (socket) {
      socket.emit('start_stream');
      setIsStreaming(true);
    }
  }, [socket]);

  const handlePauseStream = useCallback(() => {
    if (socket) {
      socket.emit('pause_stream');
      setIsStreaming(false);
    }
  }, [socket]);

  const handleResetStream = useCallback(() => {
    if (socket) {
      socket.emit('reset_stream');
      setIsStreaming(false);
      setActiveFlights([]);
    }
  }, [socket]);

  // Group flights by carrier
  const flightsByCarrier = activeFlights.reduce((acc, flight) => {
    if (!acc[flight.carrier]) {
      acc[flight.carrier] = [];
    }
    acc[flight.carrier].push(flight);
    return acc;
  }, {} as Record<string, FlightUpdate[]>);

  const carriers = Object.keys(flightsByCarrier).sort();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Flight Operations Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Real-time delay cascade monitoring
              </p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-slate-400">
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {/* Stream Controls */}
              <div className="flex gap-2">
                {!isStreaming ? (
                  <button
                    onClick={handleStartStream}
                    disabled={!connected}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Stream
                  </button>
                ) : (
                  <button
                    onClick={handlePauseStream}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={handleResetStream}
                  disabled={!connected}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="container mx-auto px-4 py-3">
          <StatsPanel 
            activeFlights={activeFlights}
            streamStatus={streamStatus}
            isStreaming={isStreaming}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {activeFlights.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              {connected 
                ? 'No active flights. Click "Start Stream" to begin.'
                : 'Connecting to telemetry stream...'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {carriers.map(carrier => (
              <div key={carrier} className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
                <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-700">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-blue-400">{carrier}</span>
                    <span className="text-slate-400 text-sm">
                      ({flightsByCarrier[carrier].length} active flights)
                    </span>
                  </h2>
                </div>
                
                <FlightTable flights={flightsByCarrier[carrier]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDashboard;