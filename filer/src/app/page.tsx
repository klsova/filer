import './globals.css';
import DragDrop from './DragDrop';
import FileUpload from './Main';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="w-full flex items-start justify-start p-6 font-roboto font-bold text-3xl fixed top-0 left-0 uppercase">Filer</header>
      <div className="flex flex-col items-center space-y-4 mt-4 w-full">
        <FileUpload />
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