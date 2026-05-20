import express from 'express';
import cors from 'cors';
import { telemetryRouter } from './routes/telemetry.route.js';

const app = express();

// Use CORS
app.use(cors());

// Limit payload to 500KB as requested to mitigate DoS risks
app.use(express.json({ limit: '500kb' }));

// Mount routes
app.use('/', telemetryRouter);

// Basic healthcheck
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
