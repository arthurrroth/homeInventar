import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UploadForm from './UploadForm'
import { getAllData } from './api'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState({});
  // In this useEffect I store the BSON img src in the data state to test wether it works  
  useEffect(() => {
    const getStuff = async () => {
      const smallStuff = await getAllData('smallstuff');
      console.log(smallStuff);
      setData(smallStuff[0].img)
    };

    getStuff()
  }, [])

  return (
    <>
      <div>
        <img className='inventar-img' src={data} alt="" />
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <UploadForm />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
