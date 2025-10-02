import type { FocusHexCell } from "../App";

export interface StatusBarProps
{
    focusCell: FocusHexCell | undefined;
}

export default function Statusbar({focusCell} : StatusBarProps)
{
    return <div className="border-[#364153] border-2 h-10 bg-[#1e2939] text-[#5b6474] ">
        <span className="ml-4 w-32 inline-block">Showing byte: {focusCell?.hex !== undefined ? focusCell?.hex.toString(16).padStart(2, '0').toUpperCase() : ''} </span>
        <span className="inline-block">Address: {focusCell?.address !== undefined ? `0x${focusCell?.address.toString(16).padStart(8, '0').toUpperCase()}` : ''}</span>
    </div>
}