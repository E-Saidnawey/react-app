import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

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

interface FlightTableProps {
  flights?: FlightUpdate[];
}

const FlightTable: React.FC<FlightTableProps> = ({ flights = [] }) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getRiskBadge = (riskLevel?: string, probability?: number) => {
    if (!riskLevel || !probability) return null;

    const config = {
      Low: { bg: 'bg-green-900/50', text: 'text-green-400', border: 'border-green-700' },
      Medium: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', border: 'border-yellow-700' },
      High: { bg: 'bg-red-900/50', text: 'text-red-400', border: 'border-red-700' }
    };

    const style = config[riskLevel as keyof typeof config] || config.Low;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${style.bg} ${style.border}`}>
        <AlertCircle className={`w-3 h-3 ${style.text}`} />
        <span className={`text-xs font-medium ${style.text}`}>
          {riskLevel}
        </span>
      </div>
    );
  };

  const getDelayReasonsBadges = (reasons?: Record<string, number>) => {
    if (!reasons) return null;

    const reasonLabels: Record<string, string> = {
      carrier_delay: 'Carrier',
      weather_delay: 'Weather',
      nas_delay: 'NAS',
      security_delay: 'Security',
      late_aircraft_delay: 'Late Aircraft'
    };

    return (
      <div className="flex flex-wrap gap-1">
        {Object.entries(reasons).map(([key, value]) => {
          if (value > 0) {
            return (
              <span
                key={key}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700"
              >
                {reasonLabels[key] || key}
              </span>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const getStatusIcon = (status: string, delay: number) => {
    if (status === 'departed') {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    } else if (delay > 15) {
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    } else if (delay > 0) {
      return <Clock className="w-4 h-4 text-yellow-400" />;
    }
    return <CheckCircle className="w-4 h-4 text-slate-500" />;
  };

  // Sort flights by delay descending
  const sortedFlights = [...flights].sort((a, b) => 
    b.current_delay_minutes - a.current_delay_minutes
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              Flight #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              Route
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              Scheduled
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              Actual
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              Delay
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              P(Cascade)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              Risk
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              Delay Reasons
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {sortedFlights.map((flight, index) => (
            <tr 
              key={`${flight.carrier}${flight.flight_number}-${index}`}
              className="hover:bg-slate-800/30 transition-colors"
            >
              {/* Flight Number */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {getStatusIcon(flight.status, flight.current_delay_minutes)}
                  <div>
                    <div className="text-sm font-medium text-white">
                      {flight.carrier} {flight.flight_number}
                    </div>
                    <div className="text-xs text-slate-500">
                      {flight.tail_number}
                    </div>
                  </div>
                </div>
              </td>

              {/* Route */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-slate-300">
                  {flight.origin} → {flight.destination}
                </div>
              </td>

              {/* Scheduled Time */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-slate-300">
                  {formatTime(flight.scheduled_time)}
                </div>
              </td>

              {/* Actual Time */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-slate-300">
                  {flight.actual_time ? formatTime(flight.actual_time) : '-'}
                </div>
              </td>

              {/* Delay */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className={`text-sm font-medium ${
                  flight.current_delay_minutes > 30 ? 'text-red-400' :
                  flight.current_delay_minutes > 15 ? 'text-yellow-400' :
                  flight.current_delay_minutes > 0 ? 'text-yellow-300' :
                  'text-green-400'
                }`}>
                  {flight.current_delay_minutes > 0 
                    ? `+${Math.round(flight.current_delay_minutes)} min`
                    : 'On time'
                  }
                </div>
              </td>

              {/* P(Cascade) */}
              <td className="px-4 py-3 whitespace-nowrap">
                {flight.cascade_probability !== undefined && flight.current_delay_minutes > 0 ? (
                  <div className="text-sm font-mono text-white">
                    {(flight.cascade_probability * 100).toFixed(1)}%
                  </div>
                ) : (
                  <span className="text-slate-600 text-sm">-</span>
                )}
              </td>

              {/* Risk Badge */}
              <td className="px-4 py-3 whitespace-nowrap">
                {flight.current_delay_minutes > 0 && flight.risk_level ? (
                  getRiskBadge(flight.risk_level, flight.cascade_probability)
                ) : (
                  <span className="text-slate-600 text-sm">-</span>
                )}
              </td>

              {/* Delay Reasons */}
              <td className="px-4 py-3">
                {flight.delay_reasons ? (
                  getDelayReasonsBadges(flight.delay_reasons)
                ) : (
                  <span className="text-slate-600 text-sm">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;