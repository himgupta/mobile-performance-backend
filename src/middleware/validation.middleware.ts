import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { TelemetryPayloadSchema } from '../models/telemetry.model.js';

export function validateTelemetryPayload(req: Request, res: Response, next: NextFunction) {
    try {
        const validatedBody = TelemetryPayloadSchema.parse(req.body);
        // Replace req.body with the sanitized and validated object
        req.body = validatedBody;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.issues });
            return;
        }
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
}
