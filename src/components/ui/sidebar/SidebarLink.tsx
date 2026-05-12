import type { ElementType } from "react";
import { Link, type LinkProps } from "react-router-dom";

interface SidebarLinkProps extends LinkProps {
  icon: ElementType;
  title: string;
}

export function SidebarLink({ icon: Icon, title, ...props }: SidebarLinkProps) {
  return (
    <Link
      {...props}
      className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface/50 hover:text-white transition-all duration-200 group"
    >
      <div className="flex items-center gap-4">
        <Icon size={18} />
        <span className="font-medium text-sm">{title}</span>
      </div>
    </Link>
  );
}
