import { SquarePen } from "lucide-react";
import { MenuDisplay } from "./Toolbar";
import type { ForwardedRef } from "react";
import type { HexAction } from "../../App";
import { useHex } from "../HexContext";

interface EditButtonProps
{
    menuDisp: number,
    ref: ForwardedRef<HTMLDivElement>
    setMenuDisp: React.Dispatch<React.SetStateAction<number>>
    undoStack: HexAction[];
    redoStack: HexAction[];
    setUndoStack: React.Dispatch<React.SetStateAction<HexAction[]>>;
    setRedoStack: React.Dispatch<React.SetStateAction<HexAction[]>>;
}

export default function EditButton(props: EditButtonProps)
{
    const {setHex} = useHex();

    function handleEditButtonClick()
    {
        let menuDisp: number = MenuDisplay.Edit;

        if(props.menuDisp === MenuDisplay.Edit)
        {
            menuDisp = MenuDisplay.None;
        }

        props.setMenuDisp(menuDisp);
    }

    function handleUndoButtonClick()
    {
        if(props.undoStack.length > 0)
        {
            let undoAct = props.undoStack.pop();

            setHex(prevHex => 
            {
                let curArr = [...prevHex];
    
                if(undoAct)
                {
                    props.redoStack.push(undoAct);
                    curArr[undoAct.address] = undoAct.oldValue;
                }
    
                return new Uint8Array(curArr);
            });
        }
        
    }

    function handleRedoButtonClick()
    {
        if(props.redoStack.length > 0)
        {

            let redoAct = props.redoStack.pop();

            setHex(curHex => 
            {
                let curArr = [...curHex];

                if(redoAct)
                {
                    props.undoStack.push(redoAct);
                    curArr[redoAct.address] = redoAct.newValue;
                }

                return new Uint8Array(curArr);
            });
        }

    }

    return (
        <div ref={props.ref} className="relative">
            <button className="flex items-center text-white mx-1" onClick={handleEditButtonClick}>
                <SquarePen className="ml-2 mr-1" size={13}/>
                <h1>Edit</h1>
            </button>
            {props.menuDisp === MenuDisplay.Edit && 
            <div className="border-[#364153] border-2 bg-[#1e2939] absolute z-50 left-0 top-full">
                <div className="flex flex-col text-white w-25">
                    <button className="hover:bg-[#30415a] transition-color"  onClick={handleUndoButtonClick}>Undo</button>
                    <button className="hover:bg-[#30415a] transition-color"  onClick={handleRedoButtonClick}>Redo</button>
                </div>
            </div>}
        </div>
    );
}