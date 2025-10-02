import { File } from "lucide-react"
import { MenuDisplay } from "./Toolbar";
import { useRef, type ChangeEvent, type ForwardedRef } from "react";
import { useHex } from "../HexContext";

interface FileButtonProps
{
    menuDisp: number
    ref: ForwardedRef<HTMLDivElement>
    setMenuDisp: React.Dispatch<React.SetStateAction<number>>
}

export default function FileButton(props: FileButtonProps)
{
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { hex, setHex, fileName } = useHex();

    function handleClick()
    {
        let menuDisp: number = MenuDisplay.File;

        if(props.menuDisp === MenuDisplay.File)
        {
            menuDisp = MenuDisplay.None;
        }

        props.setMenuDisp(menuDisp);
    }

    function handleSave()
    {
        const blob = new Blob([hex as BlobPart], { type: 'application/octet-stream'});
        const url = URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.download = fileName;
        tempLink.click();
        URL.revokeObjectURL(url);
        props.setMenuDisp(MenuDisplay.None);
    }

    function handleFileSelect(event: ChangeEvent<HTMLInputElement>)
    {
        const file = event.target.files?.[0];

        if(!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const array = new Uint8Array(arrayBuffer);
            setHex(array);
        };

        reader.readAsArrayBuffer(file);

        event.target.value = '';
        props.setMenuDisp(MenuDisplay.None);
    }

    return (
        <div ref={props.ref} className="relative">
            <button className="flex items-center mx-1 text-white" onClick={handleClick}>
                <File className="ml-2 mr-1" size={13}/>
                <h1>File</h1>
            </button>
            {props.menuDisp === MenuDisplay.File && 
            <div className="border-[#364153] border-2 bg-[#1e2939] absolute z-50 left-0 top-full">
                <div className="flex flex-col text-white w-25">
                    <button className="hover:bg-[#30415a] transition-color" onClick={() => {fileInputRef.current?.click()}}>Open</button>
                    <button className="hover:bg-[#30415a] transition-color" onClick={handleSave}>Save</button>
                </div>
            </div>}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                style={{display: 'none'}}
                accept="*/*"
                />
        </div>
    );
}