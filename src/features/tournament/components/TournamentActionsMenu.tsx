import { MoreVertical, Pencil, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteTournamentModal } from './DeleteTournamentModal';

interface TournamentSummary {
  readonly id: number;
  readonly name: string;
}

interface TournamentActionsMenuProps {
  readonly tournament: TournamentSummary;
  readonly onPlay: (e: React.MouseEvent, id: number) => void;
  readonly onDeleted: (tournamentId: number) => void;
}

export function TournamentActionsMenu({
  tournament,
  onPlay,
  onDeleted,
}: TournamentActionsMenuProps) {
  const { t } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingTournament, setIsDeletingTournament] = useState(false);

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
    window.location.assign(`/tournaments/${tournament.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setDropdownPosition(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingTournament) {
      return;
    }

    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeletingTournament(true);

    try {
      const response = await fetch(`http://localhost:8080/v1/tournaments/${tournament.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeleteModalOpen(false);
        onDeleted(tournament.id);
        window.location.assign('/tournaments');
      } else {
        console.error('Error trying to delete the tournament.');
      }
    } catch (error) {
      console.error('Error trying to communicate with server.', error);
    } finally {
      setIsDeletingTournament(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={(e) => onPlay(e, tournament.id)}
          className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-all group-hover:scale-110"
          title={t('tournament.table.button.start.title')}
        >
          <Play size={16} fill="currentColor" />
        </button>
        <button
          onClick={handleDropdownToggle}
          className="p-2 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white rounded-full transition-all z-20"
          title={t('tournament.table.button.menu.title')}
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
            {t('tournament.table.button.edit.title')}
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="w-full px-3 py-2 text-sm text-red-300 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} />
            {t('tournament.table.button.delete.title')}
          </button>
        </div>
      ) : null}

      {isDeleteModalOpen ? (
        <DeleteTournamentModal
          tournamentName={tournament.name}
          isDeleting={isDeletingTournament}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </>
  );
}