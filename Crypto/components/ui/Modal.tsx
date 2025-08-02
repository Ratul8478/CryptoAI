
import React from 'react';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className="bg-dark-800 border border-dark-700 rounded-xl shadow-lg p-6 w-full max-w-2xl animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
                style={{ animationDuration: '0.3s' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 id="modal-title" className="text-xl font-bold">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-text hover:text-white text-3xl leading-none transition-colors"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
