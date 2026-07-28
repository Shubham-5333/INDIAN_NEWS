import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-6 font-sans">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-950/60 border border-red-800 rounded-full text-red-400 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
