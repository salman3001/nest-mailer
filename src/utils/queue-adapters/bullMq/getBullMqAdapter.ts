import type { QueueOptions } from 'bullmq';
import { NestMailError } from '../../../exceptions/NestMailError';
import { BullMqAdapter } from './BullMqAdapter';

export const getBullMqAdapter = async (config: QueueOptions) => {
  try {
    const { Queue } = await import('bullmq');
    const emailQueue = new Queue('email-queue', {
      blockingConnection: false,
      ...config,
    });
    return new BullMqAdapter(emailQueue);
  } catch (error) {
    throw new NestMailError(
      'Bullmq error. Is BullMq installed? is Redis running',
    );
  }
};
