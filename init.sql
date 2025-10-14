-- Portfolio Database Initialization Script
-- This script sets up the database schema for the plant monitoring system

-- Create plants table
CREATE TABLE IF NOT EXISTS plants (
    plant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'critical')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sensor readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(plant_id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('temperature', 'humidity', 'moisture', 'lux', 'ph')),
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_plant_id ON sensor_readings(plant_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_metric_type ON sensor_readings(metric_type);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp);
CREATE INDEX IF NOT EXISTS idx_plants_status ON plants(status);

-- Insert sample data
INSERT INTO plants (name, location, type, status) VALUES
('Monstera Deliciosa', 'Living Room', 'Tropical', 'healthy'),
('Fiddle Leaf Fig', 'Office', 'Ficus', 'warning'),
('Snake Plant', 'Bedroom', 'Succulent', 'healthy'),
('Peace Lily', 'Kitchen', 'Araceae', 'healthy'),
('Rubber Plant', 'Dining Room', 'Ficus', 'warning')
ON CONFLICT DO NOTHING;

-- Insert sample sensor readings
INSERT INTO sensor_readings (plant_id, metric_type, value, unit, timestamp) VALUES
(1, 'temperature', 22.5, '°C', NOW() - INTERVAL '1 hour'),
(1, 'humidity', 65, '%', NOW() - INTERVAL '1 hour'),
(1, 'moisture', 45, '%', NOW() - INTERVAL '1 hour'),
(1, 'lux', 350, 'lux', NOW() - INTERVAL '1 hour'),
(2, 'temperature', 24.2, '°C', NOW() - INTERVAL '45 minutes'),
(2, 'humidity', 58, '%', NOW() - INTERVAL '45 minutes'),
(2, 'moisture', 38, '%', NOW() - INTERVAL '45 minutes'),
(2, 'lux', 280, 'lux', NOW() - INTERVAL '45 minutes'),
(3, 'temperature', 21.8, '°C', NOW() - INTERVAL '30 minutes'),
(3, 'humidity', 62, '%', NOW() - INTERVAL '30 minutes'),
(3, 'moisture', 52, '%', NOW() - INTERVAL '30 minutes'),
(3, 'lux', 180, 'lux', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_plants_updated_at 
    BEFORE UPDATE ON plants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for latest readings per plant
CREATE OR REPLACE VIEW latest_readings AS
SELECT DISTINCT ON (plant_id, metric_type)
    plant_id,
    metric_type,
    value,
    unit,
    timestamp
FROM sensor_readings
ORDER BY plant_id, metric_type, timestamp DESC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO portfolio_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO portfolio_user;
