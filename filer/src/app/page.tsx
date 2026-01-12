'use client';

import { useState, useEffect, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import DragDrop from './DragDrop';
import FileUpload from './Main';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<string>('mp4');
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    
    // Log progress
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
      console.log(message);
    });

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setLoaded(true);
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getMimeType = (format: string) => {
    const mimeTypes: Record<string, string> = {
      mp4: 'video/mp4',
      mkv: 'video/x-matroska',
      avi: 'video/x-msvideo',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      png: 'image/png',
      jpg: 'image/jpeg',
      pdf: 'application/pdf',
      gif: 'image/gif',
    };
    return mimeTypes[format] || `video/${format}`;
  };

  const convert = async () => {
    if (!loaded) return;
    if (files.length === 0) {
      alert('Please upload a file first.');
      return;
    }

    setIsLoading(true);
    const ffmpeg = ffmpegRef.current;
    const inputFile = files[0]; // Assuming single file for now
    const inputName = inputFile.name;
    const outputName = `output.${format}`;

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));


      await ffmpeg.exec(['-i', inputName, outputName]);

      const data = await ffmpeg.readFile(outputName);

      const url = URL.createObjectURL(
        new Blob([data as any], { type: getMimeType(format) })
      );
      
      const a = document.createElement('a');
      a.href = url;
      a.download = outputName;
      a.click();
    } catch (error) {
      console.error('Conversion failed', error);
      alert('Conversion failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="w-full flex items-start justify-start p-6 font-roboto font-bold text-3xl fixed top-0 left-0 uppercase">
        Filer
      </header>
      
      <div className="flex flex-col items-center space-y-4 mt-4 w-full">
        {!loaded && <p className="text-red-500">Loading FFmpeg core...</p>}
        
        <FileUpload 
          format={format} 
          setFormat={setFormat} 
          convert={convert}
          isLoading={isLoading}
        />
        
        <DragDrop files={files} setFiles={setFiles} />
        
        <p ref={messageRef} className="text-xs text-gray-500 font-mono mt-2 h-6 overflow-hidden"></p>
      </div>

      <h1>Filer: The file converter</h1>
      <p>Convert your files to any format you want.</p>
      
      <footer className='w-full flex items-center justify-center p-6 font-roboto font-bold text-gray-700 text-sm fixed bottom-0'>
        <p>
          &copy; 2025 <a href="https://kallesova.fi" className="underline">Kalle Sova</a>. All rights reserved.
        </p>
      </footer>
    </main>
  );
}