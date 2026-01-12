'use client';

import React from 'react';

interface FileUploadProps {
  format: string;
  setFormat: (format: string) => void;
  convert: () => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ format, setFormat, convert, isLoading }) => {
  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={convert}
        disabled={isLoading}
        className={`${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded transition-colors`}
      >
        {isLoading ? 'Converting...' : 'Convert'}
      </button>
      <div className="flex flex-col">
        <label htmlFor='filetype' className='block text-gray-900 text-sm font-bold mb-2 -mt-2'>Select file type:</label>
        <select 
          id='filetype' 
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className='block appearance-none text-gray-800 w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
        >
          <option value='mp4'>MP4</option>
          <option value='mp3'>MP3</option>
          <option value='gif'>GIF</option>
          <option value='wav'>WAV</option>
          <option value='png'>PNG</option>
          <option value='jpg'>JPG</option>
          <option value='pdf'>PDF</option>
        </select>
      </div>
    </div>
  );
};

export default FileUpload;