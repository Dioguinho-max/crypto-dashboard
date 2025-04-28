import { useState, useEffect } from 'react';
import CryptoList from './components/CryptoList';
import { ToastContainer } from 'react-toastify';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      <div className="container mx-auto p-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>

        <CryptoList />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
