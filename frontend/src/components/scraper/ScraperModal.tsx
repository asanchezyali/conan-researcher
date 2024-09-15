import React from 'react';

import { ModalComponent } from '@/components/shared/Modal';
import { ScraperForm } from './ScraperForm';
import { Scraper, ScraperFormSchemaInputType } from '@/lib/schemas';

interface ScraperModalProps {
  isEditing: boolean;
  isModalOpen: boolean;
  closeModal: () => void;
  editingScraper: Scraper | null;
  handleScraperSubmit: (
    data: ScraperFormSchemaInputType,
    editingScraper: Scraper | null,
  ) => void;
}

export const ScraperModal: React.FC<ScraperModalProps> = ({
  isEditing,
  isModalOpen,
  closeModal,
  editingScraper,
  handleScraperSubmit,
}) => {console.log(isEditing)
  return(
  <ModalComponent isOpen={isModalOpen} onClose={closeModal}>
    <div className="flex flex-col space-y-4 w-full">
      <h3 className="text-lg font-medium text-gray-900">
        {isEditing ? 'Update Mission' : 'Set Up New Discovery Agent'}
      </h3>
      <ScraperForm
        key={isEditing && editingScraper ? editingScraper.uuid : 'new'}
        onSubmit={data => {
          handleScraperSubmit(data, editingScraper);
        }}
        initialData={editingScraper || undefined}
        closeHandler={() => closeModal()}
        isEditing={isEditing}
      />
    </div>
  </ModalComponent>
) };
