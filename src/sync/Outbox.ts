import { indexedDBStorage } from '../database/adapters/IndexedDBAdapter';
import { auditService } from '../core/audit/AuditService';

export interface OutboxMutation {
  id: string;
  deviceId: string;
  entity: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  recordId: string;
  payload: any;
  timestamp: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'RESOLVED';
}

const OUTBOX_KEY = 'suite_sync_outbox_v1';

export class Outbox {
  public static enqueue(
    entity: string,
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    recordId: string,
    payload: any
  ): OutboxMutation {
    const mutation: OutboxMutation = {
      id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      deviceId: auditService.getDeviceId(),
      entity,
      operation,
      recordId,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'PENDING',
    };

    const queue = Outbox.getAll();
    queue.push(mutation);
    indexedDBStorage.setItemSync(OUTBOX_KEY, queue);
    return mutation;
  }

  public static getAll(): OutboxMutation[] {
    const data = indexedDBStorage.getItemSync<OutboxMutation[]>(OUTBOX_KEY);
    return Array.isArray(data) ? data : [];
  }

  public static remove(mutationId: string): void {
    const queue = Outbox.getAll().filter((m) => m.id !== mutationId);
    indexedDBStorage.setItemSync(OUTBOX_KEY, queue);
  }

  public static markFailed(mutationId: string): void {
    const queue = Outbox.getAll().map((m) =>
      m.id === mutationId ? { ...m, status: 'FAILED' as const, retryCount: m.retryCount + 1 } : m
    );
    indexedDBStorage.setItemSync(OUTBOX_KEY, queue);
  }

  public static clear(): void {
    indexedDBStorage.setItemSync(OUTBOX_KEY, []);
  }

  public static count(): number {
    return Outbox.getAll().length;
  }
}
