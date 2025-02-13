import './globals.css';
import DragDrop from './DragDrop';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="w-full flex items-start justify-start p-6 font-roboto font-bold text-3xl fixed top-0 left-0 uppercase">Filer</header>
      <div className="flex flex-col items-center space-y-4 mt-4 w-full">
        <div className="flex items-center space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Convert</button>
          <div className="flex flex-col">
            <label htmlFor='filetype' className='block text-gray-400 text-sm fond-bold mb-2 -mt-6'>Select file type:</label>
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
        <DragDrop />
      </div>
      <h1>Filer: The file converter</h1>
      <p>Convert your files to any format you want. Upload your file and select the format you want to convert to</p>
      <footer className='w-full flex items-center justify-center p-6 font-roboto font-bold text-gray-700 text-sm fixed bottom-0'>
        <p>
          &copy; 2025 <a href="https://kallesova.fi" className="underline">Kalle Sova</a>. All rights reserved.
        </p>
      </footer>
    </main>
  );
}