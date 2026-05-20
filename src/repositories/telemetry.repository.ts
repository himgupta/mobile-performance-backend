import { Firestore, FieldValue } from '@google-cloud/firestore';
import type { TelemetryPayload } from '../models/telemetry.model.js';

// Initialize Firestore. It will automatically use ADC (Application Default Credentials)
// such as the GOOGLE_APPLICATION_CREDENTIALS environment variable.
const firestore = new Firestore();

export class TelemetryRepository {
  private collectionName = 'telemetry_reports';

  async saveTelemetry(payload: TelemetryPayload): Promise<void> {
    const collection = firestore.collection(this.collectionName);

    // Create a time-series optimized document
    const document = {
      ...payload,
      timestamp: FieldValue.serverTimestamp(),
    };

    // We can use a generated ID
    await collection.add(document);
  }
}

export const telemetryRepository = new TelemetryRepository();
