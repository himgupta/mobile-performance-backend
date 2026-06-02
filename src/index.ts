import express from 'express';
import cors from 'cors';
import { telemetryRouter } from './routes/telemetry.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Use CORS
app.use(cors());

// Limit payload to 500KB as requested to mitigate DoS risks
app.use(express.json({ limit: '500kb' }));

// Serve static files from the public directory
// Note: when running from dist/index.js, __dirname is dist/. We need to go up one level.
app.use(express.static(path.join(__dirname, '../public')));

// Mount routes (Triggers CD pipeline with updated GCP IAM roles)
app.use('/', telemetryRouter);

// Mock data endpoint for dashboard
app.get('/api/metrics', (req, res) => {
    // Generate some mock telemetry data following the required structure
    const mockData = [
        {
            "screen_name": "/portfolio_details",
            "app_version": "1.9.8",
            "device_model": "iPhone 15 Pro",
            "os_version": "iOS 17.4",
            "total_frames": 350,
            "jank_frames": 12,
            "jank_rate": 0.0342,
            "worst_frame_ms": 48.5,
            "avg_build_ms": 6.2,
            "avg_raster_ms": 9.1,
            "time_to_first_frame_ms": 180
        },
        {
            "screen_name": "/home_feed",
            "app_version": "1.9.8",
            "device_model": "Pixel 7",
            "os_version": "Android 14",
            "total_frames": 1200,
            "jank_frames": 85,
            "jank_rate": 0.0708,
            "worst_frame_ms": 65.2,
            "avg_build_ms": 22.5,
            "avg_raster_ms": 14.1,
            "time_to_first_frame_ms": 250
        },
        {
            "screen_name": "/settings",
            "app_version": "1.9.7",
            "device_model": "iPhone 13",
            "os_version": "iOS 16.5",
            "total_frames": 150,
            "jank_frames": 1,
            "jank_rate": 0.0066,
            "worst_frame_ms": 22.0,
            "avg_build_ms": 4.1,
            "avg_raster_ms": 5.5,
            "time_to_first_frame_ms": 90
        },
        {
            "screen_name": "/market_overview",
            "app_version": "1.9.8",
            "device_model": "Galaxy S23",
            "os_version": "Android 14",
            "total_frames": 800,
            "jank_frames": 45,
            "jank_rate": 0.0562,
            "worst_frame_ms": 55.4,
            "avg_build_ms": 12.4,
            "avg_raster_ms": 28.3,
            "time_to_first_frame_ms": 310
        }
    ];
    res.json(mockData);
});

// Basic healthcheck
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
