'use client';

import React from 'react';
import { X } from 'lucide-react';

interface TileInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  decision: string;
  darkMode: boolean;
}

export default function TileInfoModal({ isOpen, onClose, title, description, decision, darkMode }: TileInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full p-6 border-2 ${darkMode ? 'border-yellow-500/50' : 'border-yellow-400'} transform transition-all`}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.3)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors`}
          aria-label="Close modal"
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="pr-8">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {title}
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                What is this?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {description}
              </p>
            </div>

            <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                Trading Decision
              </h3>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line`}>
                {decision.split('\n').map((line, idx) => {
                  if (line.trim().startsWith('•')) {
                    return (
                      <div key={idx} className="mb-1 ml-0">
                        {line}
                      </div>
                    );
                  } else if (line.trim().startsWith('-')) {
                    return (
                      <div key={idx} className="mb-1 ml-6">
                        {line}
                      </div>
                    );
                  } else {
                    return (
                      <div key={idx} className="mb-2">
                        {line}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

