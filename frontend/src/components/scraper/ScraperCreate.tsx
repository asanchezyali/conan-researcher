import React, { useState } from 'react';
import { X, MapPin, Newspaper, Calendar, Settings, Plus } from 'lucide-react';

interface ScraperButtonProps {
  openModal: () => void;
}

export const ScraperCreate: React.FC<ScraperButtonProps> = ({ openModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const buttons = [
    { type: 'custom', label: 'Custom', color: 'bg-blue-400', icon: Settings },
    { type: 'events', label: 'Events', color: 'bg-blue-500', icon: Calendar },
    { type: 'news', label: 'News', color: 'bg-blue-600', icon: Newspaper },
    { type: 'real-estate', label: 'Real Estate', color: 'bg-blue-700', icon: MapPin },
  ];

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleButtonClick = (type: string) => {
    if (type !== 'toggle') {
      openModal();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse items-end space-y-4 space-y-reverse">
      <div
        className="flex items-center justify-end"
        onMouseEnter={() => setHoveredButton('toggle')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        {hoveredButton === 'toggle' && (
          <span className="mr-2 py-1 px-2 bg-white rounded shadow text-sm font-medium text-blue-900">
            {isOpen ? 'Close' : 'Open'}
          </span>
        )}
        <button
          onClick={toggleOpen}
          className="w-14 h-14 rounded-full bg-white text-blue-900 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-opacity-80"
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {isOpen && (
        <>
          {buttons.map((button) => (
            <div
              key={button.type}
              className="flex items-center justify-end"
              onMouseEnter={() => setHoveredButton(button.type)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {hoveredButton === button.type && (
                <span className="mr-2 py-1 px-2 bg-white rounded shadow text-sm font-medium text-blue-900">
                  {button.label}
                </span>
              )}
              <button
                onClick={() => handleButtonClick(button.type)}
                className={`w-14 h-14 rounded-full ${button.color} text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:opacity-80`}
              >
                <button.icon size={24} />
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};