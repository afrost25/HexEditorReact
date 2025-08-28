import { SquarePen } from "lucide-react";
import { MenuDisplay } from "./Toolbar";
import type { ForwardedRef } from "react";

interface EditButtonProps
{
    menuDisp: number,
    ref: ForwardedRef<HTMLDivElement>
    setMenuDisp: React.Dispatch<React.SetStateAction<number>>
}

export default function EditButton(props: EditButtonProps)
{
    function handleClick()
    {
        let menuDisp: number = MenuDisplay.Edit;

        if(props.menuDisp === MenuDisplay.Edit)
        {
            menuDisp = MenuDisplay.None;
        }

        props.setMenuDisp(menuDisp);
    }

    return (
        <div ref={props.ref} className="relative">
            <button className="flex items-center text-white mx-1" onClick={handleClick}>
                <SquarePen className="ml-2 mr-1" size={13}/>
                <h1>Edit</h1>
            </button>
            {props.menuDisp === MenuDisplay.Edit && 
            <div className="border-[#364153] border-2 bg-[#1e2939] absolute z-50 left-0 top-full">
                <div className="flex flex-col text-white w-25">
                    <button>Undo</button>
                    <button>Redo</button>
                </div>
            </div>}
        </div>
    );
}