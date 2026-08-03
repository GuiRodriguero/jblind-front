import { FileText, MoreVertical, Pencil, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/axios';
import { DeleteCashGameModal } from './DeleteCashGameModal';

interface CashGameSummary {
  readonly id: string;
  readonly name: string;
  readonly status: string;
}

interface CashGameActionsMenuProps {
  readonly cashGame: CashGameSummary;
  readonly onPlay: (e: React.MouseEvent, id: string, status: string) => void;
  readonly onDeleted: (cashGameId: string) => void;
}

export function CashGameActionsMenu({
  cashGame,
  onPlay,
  onDeleted,
}: CashGameActionsMenuProps) {
  const { t } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingCashGame, setIsDeletingCashGame] = useState(false);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      setDropdownPosition(null);
      return;
    }

    const buttonRect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();

    setIsDropdownOpen(true);
    setDropdownPosition({
      top: buttonRect.bottom + 8,
      left: Math.max(16, buttonRect.right - 176),
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setDropdownPosition(null);
    window.location.assign(`/cashgames/${cashGame.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setDropdownPosition(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingCashGame) {
      return;
    }

    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeletingCashGame(true);

    try {
      await api.delete(`/v1/cashgames/${cashGame.id}`);
      setIsDeleteModalOpen(false);
      onDeleted(cashGame.id);
    } catch (error) {
      console.error('Error trying to communicate with server.', error);
    } finally {
      setIsDeletingCashGame(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3">
        {cashGame.status === 'FINISHED' ? (
          <button
            onClick={(e) => onPlay(e, cashGame.id, cashGame.status)}
            className="p-2 bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white rounded-full transition-all group-hover:scale-110 cursor-pointer"
            title={t('cashgame.table.button.summary.title')}
          >
            <FileText size={16} />
          </button>
        ) : (
          <button
            onClick={(e) => onPlay(e, cashGame.id, cashGame.status)}
            className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-all group-hover:scale-110 cursor-pointer"
            title={t('cashgame.table.button.start.title')}
          >
            <Play size={16} fill="currentColor" />
          </button>
        )}
        <button
          onClick={handleDropdownToggle}
          className="p-2 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white rounded-full transition-all z-20"
          title={t('cashgame.table.button.menu.title')}
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {isDropdownOpen && dropdownPosition ? (
        <div
          className="fixed z-40 w-44 rounded-lg border border-white/10 bg-surface-light shadow-lg"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleEditClick}
            className="w-full px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Pencil size={14} />
            {t('cashgame.table.button.edit.title')}
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="w-full px-3 py-2 text-sm text-red-300 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} />
            {t('cashgame.table.button.delete.title')}
          </button>
        </div>
      ) : null}

      {isDeleteModalOpen ? (
        <DeleteCashGameModal
          cashGameName={cashGame.name}
          isDeleting={isDeletingCashGame}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </>
  );
}
