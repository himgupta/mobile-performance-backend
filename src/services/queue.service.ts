import type { TelemetryPayload } from '../models/telemetry.model.js';
import { telemetryRepository } from '../repositories/telemetry.repository.js';
import { aiService } from './ai.service.js';

const MAX_QUEUE_SIZE = 5000;

class QueueService {
    private queue: TelemetryPayload[] = [];
    private isProcessing: boolean = false;

    /**
     * Enqueues a payload for processing.
     * @returns true if enqueued successfully, false if queue is full.
     */
    enqueue(payload: TelemetryPayload): boolean {
        if (this.queue.length >= MAX_QUEUE_SIZE) {
            console.warn(`[QueueService] Queue is full (limit: ${MAX_QUEUE_SIZE}). Rejecting payload.`);
            return false;
        }

        this.queue.push(payload);

        if (!this.isProcessing) {
            this.startProcessing();
        }

        return true;
    }

    private startProcessing() {
        this.isProcessing = true;
        // Use setImmediate to process the queue asynchronously and not block the event loop
        setImmediate(() => this.processNext());
    }

    private async processNext() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        const payload = this.queue.shift();

        if (payload) {
            try {
                // 1. Save to database
                await telemetryRepository.saveTelemetry(payload);

                // 2. Perform AI analysis
                await aiService.analyzePerformance(payload);
            } catch (error) {
                console.error('[QueueService] Error processing telemetry payload:', error);
                // We swallow the error to ensure the worker loop doesn't crash
            }
        }

        // Schedule next item
        setImmediate(() => this.processNext());
    }
}

export const queueService = new QueueService();
