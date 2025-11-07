import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </svg>
);


const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md m-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
            </div>
          <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="flex justify-end items-center p-4 border-t border-border bg-secondary/50 rounded-b-lg gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md border border-border hover:bg-accent"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
