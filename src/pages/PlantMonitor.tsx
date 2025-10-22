import React, { useEffect, useState } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Heatmap from './heatmap';

interface Plant {
  plantId: number;
  name: string;
  location?: string;
  type?: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface PlantSensorData {
  id: number;
  plantId: number;
  plantName: string;
  metricType: 'temperature' | 'humidity' | 'moisture' | 'lux' | 'ph';
  value: number;
  timestamp: string;
  unit: string;
}

const PlantMonitor: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [readings, setReadings] = useState<PlantSensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    
    // Simple mock data - replace with your actual database calls
    const mockPlants: Plant[] = [
      {
        plantId: 1,
        name: 'Monstera Deliciosa',
        location: 'Living Room',
        type: 'Tropical',
        status: 'healthy',
      },
      {
        plantId: 2,
        name: 'Fiddle Leaf Fig',
        location: 'Office',
        type: 'Ficus',
        status: 'warning',
      },
      {
        plantId: 3,
        name: 'Snake Plant',
        location: 'Bedroom',
        type: 'Succulent',
        status: 'healthy',
      },
    ];

    const mockReadings: PlantSensorData[] = [
      {
        id: 1,
        plantId: 1,
        plantName: 'Monstera Deliciosa',
        metricType: 'temperature',
        value: 22.5,
        timestamp: new Date().toISOString(),
        unit: '°C',
      },
      {
        id: 2,
        plantId: 1,
        plantName: 'Monstera Deliciosa',
        metricType: 'humidity',
        value: 65,
        timestamp: new Date().toISOString(),
        unit: '%',
      },
      {
        id: 3,
        plantId: 2,
        plantName: 'Fiddle Leaf Fig',
        metricType: 'temperature',
        value: 24.2,
        timestamp: new Date().toISOString(),
        unit: '°C',
      },
    ];

    setPlants(mockPlants);
    setReadings(mockReadings);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLatestReading = (plantId: number, metricType: string) => {
    return readings.find(
      (r) => r.plantId === plantId && r.metricType === metricType
    );
  };

  if (loading && !plants.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading plant data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Plant Monitor</h1>
            <p className="text-xl text-gray-600">
              Real-time monitoring of your plant ecosystem
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {formatTimestamp(lastUpdated.toISOString())}
              </p>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Mock Data Notice */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-blue-500 mr-2" />
          <p className="text-blue-700">
            Using sample data. Connect to your database to see real plant data.
          </p>
        </div>
      </div>

      {/* Plant Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plants.map((plant) => {
          const latestTemp = getLatestReading(plant.plantId, 'temperature');
          const latestHumidity = getLatestReading(plant.plantId, 'humidity');
          const latestMoisture = getLatestReading(plant.plantId, 'moisture');

          return (
            <div
              key={plant.plantId}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plant.name}
                </h3>
                {getStatusIcon(plant.status)}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Location:</strong> {plant.location}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Type:</strong> {plant.type}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    plant.status
                  )}`}
                >
                  {plant.status.charAt(0).toUpperCase() + plant.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                {latestTemp && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-medium">
                      {latestTemp.value}°C
                    </span>
                  </div>
                )}
                {latestHumidity && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-medium">
                      {latestHumidity.value}%
                    </span>
                  </div>
                )}
                {latestMoisture && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Soil Moisture:</span>
                    <span className="font-medium">
                      {latestMoisture.value}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Sensor Data Heatmap
        </h2>
        <Heatmap />
      </div>
    </div>
  );
};

export default PlantMonitor;
