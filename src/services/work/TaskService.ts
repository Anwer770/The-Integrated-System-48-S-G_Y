import { Task, Commitment } from '../../types';
import { suiteTaskRepository, commitmentRepository } from '../../database/repositories/WorkTaskRepository';
import { auditService } from '../../core/audit/AuditService';
import { Outbox } from '../../sync/Outbox';

export class TaskService {
  public getAllTasks(): Task[] {
    return suiteTaskRepository.getAll();
  }

  public getAllCommitments(): Commitment[] {
    return commitmentRepository.getAll();
  }

  public saveTask(task: Task): Task {
    const isNew = !suiteTaskRepository.getById(task.id);
    let saved: Task;

    if (isNew) {
      saved = suiteTaskRepository.add(task);
      auditService.log({
        action: 'Create',
        entity: 'Task',
        recordId: task.id,
        details: `إنشاء مهمة جديدة: ${task.title} (${task.pri || ''})`,
        newValue: task,
      });
      Outbox.enqueue('Task', 'INSERT', task.id, task);
    } else {
      const old = suiteTaskRepository.getById(task.id);
      saved = suiteTaskRepository.update(task.id, task) || task;
      auditService.log({
        action: 'Update',
        entity: 'Task',
        recordId: task.id,
        details: `تحديث المهمة: ${task.title} - الحالة: ${task.status}`,
        oldValue: old,
        newValue: task,
      });
      Outbox.enqueue('Task', 'UPDATE', task.id, task);
    }

    return saved;
  }

  public deleteTask(id: string): boolean {
    const old = suiteTaskRepository.getById(id);
    if (!old) return false;

    const res = suiteTaskRepository.delete(id);
    if (res) {
      auditService.log({
        action: 'Delete',
        entity: 'Task',
        recordId: id,
        details: `حذف المهمة: ${old.title}`,
        oldValue: old,
      });
      Outbox.enqueue('Task', 'DELETE', id, old);
    }
    return res;
  }

  public saveCommitment(commitment: Commitment): Commitment {
    const isNew = !commitmentRepository.getById(commitment.id);
    let saved: Commitment;

    if (isNew) {
      saved = commitmentRepository.add(commitment);
      Outbox.enqueue('Commitment', 'INSERT', commitment.id, commitment);
    } else {
      saved = commitmentRepository.update(commitment.id, commitment) || commitment;
      Outbox.enqueue('Commitment', 'UPDATE', commitment.id, commitment);
    }

    return saved;
  }

  public deleteCommitment(id: string): boolean {
    const res = commitmentRepository.delete(id);
    if (res) {
      Outbox.enqueue('Commitment', 'DELETE', id, null);
    }
    return res;
  }
}

export const taskService = new TaskService();
