import { useEffect, useRef, useState } from "react";
import EditButton from "./EditButton";
import FileButton from "./FileButton";

export const MenuDisplay = {
    None: 0,
    File: 1,
    Edit: 2,
} as const;

export default function Toolbar()
{
    const [menuDisp, setMenuDisp] = useState<number>(MenuDisplay.None);

    const fileRef = useRef<HTMLDivElement>(null);
    const editRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleMouseDown(e: MouseEvent)
        {
            if(fileRef.current?.contains(e.target as Node)) return;
            if(editRef.current?.contains(e.target as Node)) return;
            setMenuDisp(MenuDisplay.None);
        }

        document.addEventListener("mousedown", handleMouseDown);

        return () => document.removeEventListener("mousedown", handleMouseDown);

    }, [menuDisp]);

    return (  
        <div className="border-[#364153] border-2 h-8 bg-[#1e2939] flex">
            <FileButton ref={fileRef} menuDisp={menuDisp} setMenuDisp={setMenuDisp}/>
            <EditButton ref={editRef} menuDisp={menuDisp} setMenuDisp={setMenuDisp}/>
        </div>
    );
}