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
  const [logs, setLogs] = useState<string>('Initializing...');

  const ffmpegRef = useRef<FFmpeg | null>(null);

  const load = async () => {
    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg();
    }
    
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on('log', ({ message }) => {
      setLogs(message);
      console.log(message);
    });

    try {
      const baseURL = window.location.origin + '/ffmpeg';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setLoaded(true);
      setLogs('Ready to convert');
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      setLogs('Failed to load FFmpeg core. Check public/ffmpeg folder.');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      load();
    }
  }, []);

  const getMimeType = (fmt: string) => {
    const mimeTypes: Record<string, string> = {
      mp4: 'video/mp4',
      mkv: 'video/x-matroska',
      avi: 'video/x-msvideo',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      pdf: 'application/pdf',
    };
    return mimeTypes[fmt] || `video/${fmt}`;
  };

  const convertImageToPDF = async (file: File) => {
    try {
      const { jsPDF } = (await import('jspdf'));

      const reader = new FileReader();
      reader.onload = (event) => {
        const imgData = event.target?.result as string;
        if (!imgData) return;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('output.pdf');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert('PDF conversion failed');
      setIsLoading(false);
    }
  };

  const convertPdfToImage = async (file: File) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) throw new Error('Canvas context missing');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext: any = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      canvas.toBlob((blob) => {
        if (!blob) {
            alert('Failed to generate image');
            setIsLoading(false);
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page_1.${format === 'jpeg' ? 'jpg' : format}`;
        a.click();
        setIsLoading(false);
      }, getMimeType(format));

    } catch (error) {
      console.error('PDF to Image failed', error);
      alert('Failed to convert PDF. See console.');
      setIsLoading(false);
    }
  };

  const convertWithFFmpeg = async (file: File) => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) return;

    const inputName = 'input.' + file.name.split('.').pop();
    const outputName = `output.${format}`;

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(['-i', inputName, outputName]);
      const data = await ffmpeg.readFile(outputName);
      
      const blob = new Blob([data as any], { type: getMimeType(format) });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = outputName;
      a.click();
    } catch (error) {
      console.error(error);
      alert('FFmpeg conversion failed. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  const convert = async () => {
    if (!loaded) return;
    if (files.length === 0) {
      alert('Please upload a file first.');
      return;
    }

    setIsLoading(true);
    const inputFile = files[0];
    const inputExtension = inputFile.name.split('.').pop()?.toLowerCase();
    
    if (format === 'pdf' && inputFile.type.startsWith('image/')) {
       await convertImageToPDF(inputFile);
    } 
    else if (inputExtension === 'pdf' && ['jpg', 'jpeg', 'png', 'webp'].includes(format)) {
       await convertPdfToImage(inputFile);
    }
    else {
       await convertWithFFmpeg(inputFile);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="w-full flex items-start justify-start p-6 font-roboto font-bold text-3xl fixed top-0 left-0 uppercase">
        Filer
      </header>
      
      <div className="flex flex-col items-center space-y-4 mt-4 w-full">
        {!loaded && (
          <div className="flex items-center space-x-2 text-red-500">
             <span className="loading loading-spinner"></span> 
             <p>Loading Core...</p>
          </div>
        )}
        
        <FileUpload 
          format={format} 
          setFormat={setFormat} 
          convert={convert}
          isLoading={isLoading}
        />
        
        <DragDrop files={files} setFiles={setFiles} />
        
        <p className="text-xs text-gray-500 font-mono mt-2 h-6 overflow-hidden w-full text-center">
          {logs}
        </p>
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