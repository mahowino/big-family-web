// components/LoadingDialog.tsx
import React from 'react';

interface LoadingDialogProps {
  message: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto flex items-center gap-4">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingDialog;
