'use client';

import React, { useState, DragEvent, ChangeEvent } from 'react';

interface DragDropProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const DragDrop: React.FC<DragDropProps> = ({ files, setFiles }) => {
  const [dragIsOver, setDragIsOver] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-dashed border-2 p-8 mt-4 w-full h-64 flex flex-col items-center justify-center ${
        dragIsOver ? 'border-blue-500' : 'border-gray-400'
      }`}
    >
      {files.length === 0 ? (
        <p className="text-gray-700">
          Click{' '}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            here
          </span>{' '}
          or drag and drop the file you want to convert
        </p>
      ) : (
        <ul className="text-center">
          {files.map((file, index) => (
            <li key={index} className="text-gray-700 font-medium">
              {file.name}
            </li>
          ))}
        </ul>
      )}
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default DragDrop;