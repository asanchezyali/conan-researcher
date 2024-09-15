'use client';
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box bg-white">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
};