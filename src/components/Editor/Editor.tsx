import { type JSX, type SetStateAction } from "react"
import HexCell from "./HexCell"
import { useHex } from "../HexContext"
import { useVirtualizer } from "@tanstack/react-virtual"
import React from "react";
import type { FocusHexCell, HexAction } from "../../App";

function AddressCell(props: {row: number}): JSX.Element
{
    return <td className="text-[#5b6474] p-1 pr-4">{`0x${(props.row * 16).toString(16).toUpperCase().padStart(8, '0')}`}</td>
}

function HexHeader(): JSX.Element
{
    return (
        <>
            {Array.from(Array(16).keys()).map((val, index) => 
                <th className="text-[#5b6474] border-b border-[#5b6474] font-normal p-1 w-10" key={index}>{val.toString(16).toUpperCase()}</th>
            )}
        </>
    );
}

function ASCIIHeader(): JSX.Element
{
    return (
        <>
            {Array.from(Array(16).keys()).map((_, index) => 
                <th className="text-[#5b6474] border-b border-[#5b6474] font-normal p-1 w-6" key={index}></th>
            )}
        </>
    );
}


function ASCIICell(props: {hex: number | undefined}):  JSX.Element
{
    let asciiVal = '.';

    if(props.hex !== undefined)
    {
        if(props.hex >= 0x20 && props.hex <= 0x7E)
        {
            asciiVal = String.fromCharCode(props.hex);
        }
    }

    return  <td className="text-[#5b6474] p-1 w-6">{asciiVal}</td>
}

function tryGetHexValue(row: number, col: number, hexData: Uint8Array): number | undefined
{
    let res = undefined;
    let calIndex = row * 16 + col;

    if(hexData.length > calIndex)
    {
        res = hexData[calIndex];
    }

    return res;
}

export interface EditorProps
{
    focusCell: FocusHexCell | undefined
    setFocusCell: React.Dispatch<SetStateAction<FocusHexCell | undefined>>
    setUndoStack: React.Dispatch<SetStateAction<HexAction[]>>
    setRedoStack: React.Dispatch<SetStateAction<HexAction[]>>
}

export default function Editor({focusCell, setFocusCell, setUndoStack, setRedoStack} : EditorProps)
{
    const { hex } = useHex();
    const parentRef = React.useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: Math.ceil(10000/ 16),
        getScrollElement: () => parentRef.current,
        estimateSize: () => 28, // Estimate row height
    });

    return(
        <div ref={parentRef} className="h-full w-fit overflow-y-scroll border-[#364153] border-2 bg-[#1e2939] p-2 rounded-lg" onScroll={() => setFocusCell(undefined)}>
            <table className="border-collapse font-mono text-center table-fixed">
                <thead>
                    <tr className="border-b border-[#5b6474]">
                        <th className="border-b border-[#5b6474] w-28 text-[#5b6474]">Address</th>
                        <HexHeader />
                        <ASCIIHeader />
                    </tr>
                </thead>
                <tbody style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                    {rowVirtualizer.getVirtualItems().map(virtualRow => (
                        <tr key={virtualRow.index} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }}>
                            <AddressCell row={virtualRow.index} />
                            {Array.from(Array(16).keys()).map(colIndex => {
                                return <HexCell key={colIndex} 
                                                address={virtualRow.index * 16 + colIndex} 
                                                hex={tryGetHexValue(virtualRow.index, colIndex, hex)} 
                                                focusCell={focusCell}
                                                setFocusCell={setFocusCell} 
                                                setUndoStack={setUndoStack}
                                                setRedoStack={setRedoStack}
                                        />
                            })}
                            {Array.from(Array(16).keys()).map(colIndex => (
                                <ASCIICell key={colIndex} hex={tryGetHexValue(virtualRow.index, colIndex, hex)} />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
