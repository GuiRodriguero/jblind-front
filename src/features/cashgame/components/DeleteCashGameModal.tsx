import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui/Modal';

interface DeleteCashGameModalProps {
  readonly cashGameName: string;
  readonly isDeleting: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export function DeleteCashGameModal({
  cashGameName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCashGameModalProps) {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold text-white">{t('cashgame.table.deleteModal.title')}</h3>
      <p className="mt-2 text-sm text-gray-300">
        {t('cashgame.table.deleteModal.description', { name: cashGameName })}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t('default.cancel')}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting
            ? t('cashgame.table.deleteModal.deleting')
            : t('cashgame.table.deleteModal.confirm')}
        </button>
      </div>
    </Modal>
  );
}
