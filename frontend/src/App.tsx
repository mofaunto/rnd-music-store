import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState<string>('Checking...');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${apiUrl}/health`) 
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(() => setStatus('Backend connection failed!'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Hello World</h1>
        <p className={`text-lg ${status.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
          Status: {status}
        </p>
      </div>
    </div>
  )
}

export default App