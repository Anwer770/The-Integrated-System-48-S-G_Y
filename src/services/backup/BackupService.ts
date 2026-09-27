import { createUnifiedBackup, restoreUnifiedBackup, resetAllModuleData } from '../../utils/storage';
import { UnifiedBackupState } from '../../types';
import { auditService } from '../../core/audit/AuditService';

export class BackupService {
  public static createBackup(): UnifiedBackupState {
    const backup = createUnifiedBackup();
    auditService.log({
      action: 'Backup',
      entity: 'SystemBackup',
      details: `تم إنشاء نسخة احتياطية موحدة شاملة لكافة وحدات النظام (الإصدار: ${backup.version})`,
    });
    return backup;
  }

  public static restoreBackup(backup: UnifiedBackupState): boolean {
    try {
      restoreUnifiedBackup(backup);
      auditService.log({
        action: 'Restore',
        entity: 'SystemBackup',
        details: `تم استرجاع النسخة الاحتياطية بنجاح المؤرخة في: ${backup.exportedAt}`,
      });
      return true;
    } catch (e) {
      console.error('BackupService: Restore failed', e);
      return false;
    }
  }

  public static resetSystem(): void {
    resetAllModuleData();
    auditService.log({
      action: 'Delete',
      entity: 'SystemReset',
      details: 'تمت إعادة ضبط وتهيئة بيانات النظام بالكامل إلى الحالة الافتراضية',
    });
  }
}
