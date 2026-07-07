import type { ReactNode } from 'react';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen = true, title, children, maxWidth = 'max-w-md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className={`w-full ${maxWidth} rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl relative`}>
        {title && (
          <div className="mb-4 border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}