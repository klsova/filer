'use client';

import React from 'react';

const FileUpload = () => {
  return (
    <div className="flex items-center space-x-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Convert</button>
      <div className="flex flex-col">
        <label htmlFor='filetype' className='block text-gray-900 text-sm font-bold mb-2 -mt-2'>Select file type:</label>
        <select id='filetype' className='block appearance-none text-gray-800 w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'>
          <option value={'pdf'}>PDF</option>
          <option value={'docx'}>DOCX</option>
          <option value={'txt'}>TXT</option>
          <option value={'png'}>PNG</option>
          <option value={'jpg'}>JPG</option>
          <option value={'jpeg'}>JPEG</option>
          <option value={'gif'}>GIF</option>
          <option value={'mp3'}>MP3</option>
          <option value={'mp4'}>MP4</option>
          <option value={'wav'}>WAV</option>
          <option value={'avi'}>AVI</option>
          <option value={'mov'}>MOV</option>
          <option value={'mpg'}>MPG</option>
          <option value={'wmv'}>WMV</option>
          <option value={'flv'}>FLV</option>
          <option value={'mkv'}>MKV</option>
          <option value={'webm'}>WEBM</option>
          <option value={'ogg'}>OGG</option>
        </select>
      </div>
    </div>
  );
};

export default FileUpload;