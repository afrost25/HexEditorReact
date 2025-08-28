import './App.css'
import Editor from './components/Editor/Editor'
import Statusbar from './components/Statusbar';
import Toolbar from './components/Toolbar/Toolbar';
import { HexProvider } from './components/HexContext';

function App() {

  return (
    <HexProvider>
      <div className="h-screen flex flex-col">
        <Toolbar />
        <div className='flex-1 flex justify-center mt-2 mb-2'>
          <Editor/>
        </div>
        <Statusbar />
      </div>
    </HexProvider>
  )
}

export default App
