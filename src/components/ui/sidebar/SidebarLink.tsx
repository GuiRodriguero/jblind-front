import type { ElementType } from 'react';
import { Link, useLocation, type LinkProps } from 'react-router-dom';

interface SidebarLinkProps extends LinkProps {
  readonly to: string;
  readonly icon: ElementType;
  readonly title: string;
  readonly isCollapsed?: boolean;
}

export function SidebarLink({ to, icon: Icon, title, isCollapsed }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      title={isCollapsed ? title : undefined}
      className={`flex items-center px-3 py-2.5 rounded-lg transition-all font-medium overflow-hidden ${
        isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
      } ${isCollapsed ? 'justify-center gap-0' : 'justify-start gap-3'}`}
    >
      <Icon size={20} className="shrink-0" />

      {!isCollapsed && <span className="truncate transition-opacity duration-300">{title}</span>}
    </Link>
  );
}
