import { z } from 'zod';

export const AppInfoSchema = z.object({
  version: z.string().trim().min(1),
  platform: z.string().trim().min(1),
  device_model: z.string().trim().min(1),
  rendering_engine: z.string().trim().min(1),
});

export const AveragesSchema = z.object({
  ui_thread_build_ms: z.number(),
  raster_thread_ms: z.number(),
});

export const MetricsSchema = z.object({
  page_identifier: z.string().trim().min(1),
  time_to_first_frame_ms: z.number(),
  total_monitored_frames: z.number(),
  jank_frames_detected: z.number(),
  worst_offending_frame_ms: z.number(),
  averages: AveragesSchema,
});

export const TelemetryPayloadSchema = z.object({
  app_info: AppInfoSchema,
  metrics: MetricsSchema,
});

export type AppInfo = z.infer<typeof AppInfoSchema>;
export type Averages = z.infer<typeof AveragesSchema>;
export type Metrics = z.infer<typeof MetricsSchema>;
export type TelemetryPayload = z.infer<typeof TelemetryPayloadSchema>;
