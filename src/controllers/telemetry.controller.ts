import type { Request, Response } from 'express';
import { queueService } from '../services/queue.service.js';
import type { TelemetryPayload } from '../models/telemetry.model.js';

export class TelemetryController {
    async handleReport(req: Request, res: Response): Promise<void> {
        // Validation middleware guarantees req.body is of type TelemetryPayload
        const payload = req.body as TelemetryPayload;

        const enqueued = queueService.enqueue(payload);

        if (enqueued) {
            res.status(202).json({ message: 'Accepted' });
        } else {
            res.status(429).json({ error: 'Too Many Requests', message: 'Queue is currently full. Please try again later.' });
        }
    }
}

export const telemetryController = new TelemetryController();
