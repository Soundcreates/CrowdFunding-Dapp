import React from 'react'

import HandleContractInteraction from './components/handleContractInteraction';
import './index.css';
import { EthereumProvider } from './context/EthereumContext';
function AppLayout() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-10 bg-stone-200">
      <h1 className=" w-full text-4xl text-center font-bold">Crowdfunding DApp</h1>

      <HandleContractInteraction />


    </div>
  )
}

function App() {
  return (
    <EthereumProvider>
      <AppLayout />
    </EthereumProvider>
  )
}

export default App