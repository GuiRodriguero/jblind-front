import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui/Modal';

interface DeleteTournamentModalProps {
  readonly tournamentName: string;
  readonly isDeleting: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export function DeleteTournamentModal({
  tournamentName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteTournamentModalProps) {
  const { t } = useTranslation();

  return (
    <Modal>
      <h3 className="text-lg font-semibold text-white">{t('tournament.table.deleteModal.title')}</h3>
      <p className="mt-2 text-sm text-gray-300">
        {t('tournament.table.deleteModal.description', { name: tournamentName })}
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
            ? t('tournament.table.deleteModal.deleting')
            : t('tournament.table.deleteModal.confirm')}
        </button>
      </div>
    </Modal>
  );
}