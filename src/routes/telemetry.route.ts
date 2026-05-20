import { Router } from 'express';
import { requireApiKey } from '../middleware/auth.middleware.js';
import { validateTelemetryPayload } from '../middleware/validation.middleware.js';
import { telemetryController } from '../controllers/telemetry.controller.js';

export const telemetryRouter = Router();

telemetryRouter.post(
    '/v1/perf-report',
    requireApiKey,
    validateTelemetryPayload,
    (req, res, next) => telemetryController.handleReport(req, res).catch(next)
);
