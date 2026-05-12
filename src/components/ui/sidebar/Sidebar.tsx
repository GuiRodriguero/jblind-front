import { Link } from 'react-router-dom';
import { SidebarLink } from './SidebarLink';
import { Trophy, Settings, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="w-64 border-r border-white/10 flex flex-col p-4 gap-2 bg-[#0a0a0a] text-white">
      <div className="px-3 py-6">
        <Link to="/" className="text-xl font-bold text-white tracking-wide">
          JBlind
        </Link>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <SidebarLink to="/tournaments" icon={Trophy} title={t('sidebar.tournaments')} />
        {/* <SidebarLink to="/players" icon={Users} title="Leagues" /> */}
      </nav>

      <nav className="border-t border-white/10 pt-4">
        <SidebarLink to="/settings" icon={Settings} title={t('sidebar.settings')} />
      </nav>
    </aside>
  );
}
