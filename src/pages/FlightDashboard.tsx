import React, { useState, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import FlightTable from '../components/FlightTable';
import { Clock as ClockIcon, AlertTriangle, Activity, Layers } from 'lucide-react';

// --- Interfaces ---
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
  // --- State ---
  const [activeFlights, setActiveFlights] = useState<FlightUpdate[]>([]);
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [connected, setConnected] = useState(false);
  
  // New State for Tabs & Simulation Time
  const [activeTab, setActiveTab] = useState<string>('Delayed');
  const [simulatedTime, setSimulatedTime] = useState<Date | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Socket Connection ---
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
      // 1. Update Simulation Clock
      setSimulatedTime(new Date(update.update_time));

      // 2. Update Active Flights List
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
    });

    newSocket.on('stream_restart', () => {
      // Clear flights on auto-restart so we don't see old data
      setActiveFlights([]); 
    });

    newSocket.on('stream_reset', () => {
      setActiveFlights([]);
      setSimulatedTime(null);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // --- Computed Data ---

  // 1. Unique Carriers (for Tabs)
  const uniqueCarriers = useMemo(() => {
    const carriers = new Set(activeFlights.map(f => f.carrier));
    return Array.from(carriers).sort();
  }, [activeFlights]);

  // 2. Statistics (Fixes Negative Avg Issue)
  const stats = useMemo(() => {
    const delayedFlights = activeFlights.filter(f => f.current_delay_minutes > 0);
    const totalDelay = delayedFlights.reduce((acc, f) => acc + f.current_delay_minutes, 0);
    
    return {
      total: activeFlights.length,
      delayed: delayedFlights.length,
      avgDelay: delayedFlights.length > 0 ? (totalDelay / delayedFlights.length).toFixed(1) : '0.0',
      highRisk: activeFlights.filter(f => f.risk_level === 'High').length
    };
  }, [activeFlights]);

  // 3. Filtered Flights based on Active Tab
  const filteredFlights = useMemo(() => {
    let filtered = [];

    switch (activeTab) {
      case 'Delayed':
        filtered = activeFlights.filter(f => f.current_delay_minutes > 0);
        break;
      case 'High Risk':
        filtered = activeFlights.filter(f => f.risk_level === 'High');
        break;
      case 'All':
        filtered = activeFlights;
        break;
      default:
        // Assume activeTab is a Carrier Name
        filtered = activeFlights.filter(f => f.carrier === activeTab);
        break;
    }

    // Always sort by delay descending (worst first)
    return filtered.sort((a, b) => b.current_delay_minutes - a.current_delay_minutes);
  }, [activeFlights, activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* --- HEADER --- */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Title & Clock */}
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Flight Operations Center
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              </h1>
              
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-200">
                    {simulatedTime 
                      ? simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                      : '--:--:--'}
                  </span>
                </div>
                {streamStatus && (
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-blue-200 border border-slate-700">
                    {streamStatus.replay_speed}x Speed
                  </span>
                )}
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="flex gap-4 md:gap-8 text-sm bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800">
               <div>
                 <span className="text-slate-500 block text-xs uppercase tracking-wider">Avg Delay</span>
                 <span className="text-yellow-400 font-mono font-bold text-lg">{stats.avgDelay}m</span>
               </div>
               <div>
                 <span className="text-slate-500 block text-xs uppercase tracking-wider">High Risk</span>
                 <span className="text-red-400 font-mono font-bold text-lg">{stats.highRisk}</span>
               </div>
               <div>
                 <span className="text-slate-500 block text-xs uppercase tracking-wider">Delayed</span>
                 <span className="text-white font-mono font-bold text-lg">{stats.delayed}</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- SCROLLABLE TABS --- */}
        <div className="container mx-auto px-4 mt-4">
          <div 
            ref={scrollContainerRef}
            className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide border-b border-slate-800"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Summary Tabs */}
            <TabButton 
              label="Delayed" 
              count={stats.delayed} 
              isActive={activeTab === 'Delayed'} 
              onClick={() => setActiveTab('Delayed')} 
              icon={<AlertTriangle className="w-3 h-3" />}
              activeColor="text-yellow-400 border-yellow-400"
            />
            <TabButton 
              label="High Risk" 
              count={stats.highRisk} 
              isActive={activeTab === 'High Risk'} 
              onClick={() => setActiveTab('High Risk')}
              icon={<Activity className="w-3 h-3" />} 
              activeColor="text-red-400 border-red-400"
            />
            <TabButton 
              label="All Flights" 
              count={stats.total} 
              isActive={activeTab === 'All'} 
              onClick={() => setActiveTab('All')}
              icon={<Layers className="w-3 h-3" />} 
            />

            {/* Vertical Divider */}
            <div className="w-px bg-slate-800 mx-2 my-1" />

            {/* Carrier Tabs */}
            {uniqueCarriers.map(carrier => (
              <TabButton
                key={carrier}
                label={carrier}
                isActive={activeTab === carrier}
                onClick={() => setActiveTab(carrier)}
                // Show count of delayed flights for this carrier if meaningful, else just show dot
                count={activeFlights.filter(f => f.carrier === carrier && f.current_delay_minutes > 0).length || undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        {filteredFlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <p className="text-lg">No flights match the current filter.</p>
            {activeTab === 'Delayed' && <p className="text-sm mt-2">Great news! No delays reported.</p>}
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {/* Table Header Context */}
            <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-semibold text-slate-200 flex items-center gap-2">
                {activeTab === 'Delayed' || activeTab === 'High Risk' || activeTab === 'All' 
                  ? activeTab 
                  : `Carrier: ${activeTab}`
                }
                <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">
                  {filteredFlights.length}
                </span>
              </h2>
            </div>
            
            {/* The Existing Flight Table Component */}
            <FlightTable flights={filteredFlights} />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Helper Components ---

interface TabButtonProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  activeColor?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ 
  label, 
  count, 
  isActive, 
  onClick, 
  icon,
  activeColor = "text-blue-400 border-blue-400"
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2
      ${isActive 
        ? `${activeColor} bg-slate-800/50` 
        : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
      }
    `}
  >
    {icon}
    {label}
    {count !== undefined && (
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-slate-900/50' : 'bg-slate-800'}`}>
        {count}
      </span>
    )}
  </button>
);

export default FlightDashboard;