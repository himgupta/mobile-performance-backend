import { GoogleGenAI } from '@google/genai';
import type { TelemetryPayload } from '../models/telemetry.model.js';

const PERFORMANCE_DIAGNOSTIC_SYSTEM_PROMPT = `
You are an expert Performance Diagnostic System.
Your task is to analyze incoming mobile application performance telemetry and identify the root cause of rendering lags.

Analyze the provided telemetry metrics and application information.
Evaluate if the rendering lag is primarily UI-thread bound or Raster-thread bound based on the averages (ui_thread_build_ms vs raster_thread_ms).

Using the provided source code for the associated page identifier, formulate a technical refactoring proposal to optimize the performance and reduce jank frames.

Your response should be structured and include:
1. Diagnosis: Is it UI-thread or Raster-thread bound?
2. Analysis: A brief explanation of why based on the metrics.
3. Refactoring Proposal: Specific code changes or architectural recommendations to resolve the issue based on the provided source code.
`;

const aiClient = new GoogleGenAI({}); // Initialize with environment variables (e.g. GEMINI_API_KEY)

// Mock function to simulate looking up source code files based on page_identifier
async function getSourceCodeForPage(pageIdentifier: string): Promise<string> {
    // In a real application, this might query a database or access a file system/repository
    return `
// Mock Source Code for ${pageIdentifier}
// Found some nested components and heavy synchronous operations.
function render() {
  // Simulating an expensive build operation
  expensiveOperation();
}
`;
}

export class AIService {
    async analyzePerformance(payload: TelemetryPayload): Promise<void> {
        try {
            const sourceCode = await getSourceCodeForPage(payload.metrics.page_identifier);

            const prompt = `
Payload:
${JSON.stringify(payload, null, 2)}

Source Code:
${sourceCode}
`;

            const response = await aiClient.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    systemInstruction: PERFORMANCE_DIAGNOSTIC_SYSTEM_PROMPT,
                }
            });

            console.log(`[AI Analysis for ${payload.metrics.page_identifier}]:`, response.text);
            // In a real system, we might save this analysis back to the database or trigger an alert
        } catch (error) {
            console.error('[AIService] Failed to analyze performance:', error);
            // Don't throw the error, just log it so the worker can continue
        }
    }
}

export const aiService = new AIService();
