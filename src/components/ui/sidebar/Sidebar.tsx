import { Link } from 'react-router-dom';
import { SidebarLink } from './SidebarLink';
import { Trophy, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export function Sidebar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`border-r border-white/10 flex flex-col p-4 gap-2 bg-[#0a0a0a] text-white transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-7 bg-surface border border-white/10 text-gray-400 hover:text-white rounded-full p-1.5 transition-colors z-50 shadow-lg hover:bg-white/10"
        title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`px-2 py-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <Link to="/" className="text-xl font-bold text-white tracking-wide truncate">
          <span className="text-blue-500">{isCollapsed ? 'JB' : 'JBlind'}</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 flex-1 mt-2">
        <SidebarLink to="/tournaments" icon={Trophy} title={t('sidebar.tournaments')} isCollapsed={isCollapsed} />
      </nav>

      <nav className="border-t border-white/10 pt-4">
        <SidebarLink to="/settings" icon={Settings} title={t('sidebar.settings')} isCollapsed={isCollapsed} />
      </nav>
    </aside>
  );
}
