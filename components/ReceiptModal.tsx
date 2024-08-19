// components/Modal.tsx
import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (receiptNumber: string) => void;
}

const ReceiptModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [receiptNumber, setReceiptNumber] = useState('');

  const handleSubmit = () => {
    onSubmit(receiptNumber);
    setReceiptNumber(''); // Clear input after submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6">
        <h2 className="text-lg font-semibold mb-4">Validate Payment</h2>
        <input
          type="text"
          value={receiptNumber}
          onChange={(e) => setReceiptNumber(e.target.value)}
          placeholder="Enter receipt number"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
