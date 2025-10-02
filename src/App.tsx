import './App.css'
import Editor from './components/Editor/Editor'
import Statusbar from './components/Statusbar';
import Toolbar from './components/Toolbar/Toolbar';
import { HexProvider } from './components/HexContext';
import { useState } from 'react';

export interface FocusHexCell
{
    address: number,
    hex: number | undefined,
}

export interface HexAction
{
  address: number,
  oldValue: number,
  newValue: number,
}

function App() {

  const [focusHexCell, setFocusCell] = useState<FocusHexCell | undefined>(undefined);
  const [undoStack, setUndoStack] = useState<HexAction[]>([]);
  const [redoStack, setRedoStack] = useState<HexAction[]>([]);

  return (
    <HexProvider>
      <div className="h-screen flex flex-col gap-2">
        <Toolbar undoStack={undoStack} redoStack={redoStack} setUndoStack={setUndoStack} setRedoStack={setRedoStack}/>
        <div className='flex-1 flex justify-center min-h-0'>
          <Editor focusCell={focusHexCell} setFocusCell={setFocusCell} setUndoStack={setUndoStack} setRedoStack={setRedoStack}/>
        </div>
        <Statusbar focusCell={focusHexCell} />
      </div>
    </HexProvider>
  )
}

export default App
