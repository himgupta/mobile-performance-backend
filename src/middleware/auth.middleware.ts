import type { Request, Response, NextFunction } from 'express';

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKeyHeader = req.header('X-AppInsights-QA-Key');
    const expectedApiKey = process.env.QA_API_KEY;

    if (!expectedApiKey) {
        // If no API key is configured in the environment, we might want to fail securely,
        // or allow bypass depending on environment. For safety, we reject.
        console.warn('QA_API_KEY environment variable is not set.');
        res.status(500).json({ error: 'Server configuration error.' });
        return;
    }

    if (!apiKeyHeader || apiKeyHeader !== expectedApiKey) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
    }

    next();
}
