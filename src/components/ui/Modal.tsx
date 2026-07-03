import React from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ children, maxWidth = 'max-w-md' }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className={`w-full ${maxWidth} rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl`}>
        {children}
      </div>
    </div>
  );
}
