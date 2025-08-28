import { useRef, type JSX } from "react"
import HexCell from "./HexCell"
import { useHex } from "../HexContext"
import { useVirtualizer } from "@tanstack/react-virtual"
import React from "react";

function AddressCell(props: {row: number}): JSX.Element
{
    return <td className="text-[#5b6474]" key={props.row}>{`0x${(props.row * 16).toString(16).toUpperCase().padStart(8, '0')}`}</td>
}

function HexHeader(props: {index: number}): JSX.Element
{
    return <th className="text-[#5b6474] border-b border-[#5b6474] font-normal" key={props.index}>{props.index.toString(16).toUpperCase()}</th>
}

function ASCIIHeader(props: {index: number}): JSX.Element
{
    return <th className="border-b border-[#5b6474]" key={props.index}></th>
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

    return  <td className="text-[#5b6474]">{asciiVal}</td>
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

export default function Editor()
{

    const parentRef = React.useRef<HTMLDivElement>(null);
    const cellRefs = useRef<(HTMLInputElement | null)[]>([]);
    const {hex, setHex} = useHex();

    const virtualizer = useVirtualizer({
        count: Math.ceil(hex.length / 16),
        getScrollElement: () => parentRef.current,
        estimateSize: () => 32,
        overscan: 5,
    });

    return(
     <div className="p-2 bg-[#1e2939] rounded-lg border-[#364153] border-2" ref={parentRef}>
        <table className="border-collapse [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 font-mono ">
            <thead>
                <tr>
                    <th className="text-[#5b6474] border-b border-[#5b6474] font-normal">Offset</th>
                    { Array.from({length: 16}, (_, i) => <HexHeader key={i} index={i}/>) }
                    { Array.from({length: 16}, (_, i) => <ASCIIHeader key={i} index={i}/>) }
                </tr>
            </thead>
        </table>
        <div ref={parentRef} className="flex-1 overflow-auto" style={{height: 600}}>
            <div style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
                width: "100%"
            }}>
                <table  className="border-collapse [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 font-mono ">
                    <tbody className="text-center">
                        { 
                            virtualizer.getVirtualItems().map((vr) => (
                            <tr key={vr.index}>
                                    <AddressCell row={vr.index} />
                                    {Array.from({length: 16}, (_, col) => ( 
                                        <HexCell 
                                            ref={(el) => { cellRefs.current[vr.index * 16 + col] = el}} 
                                            key={vr.index * 16 + col} index={vr.index * 16 + col} 
                                            hex={tryGetHexValue(vr.index, col, hex)} 
                                            setHex={setHex}
                                            />
                                    ))}
                                    {Array.from({length: 16}, (_, col) => ( <ASCIICell key={vr.index * 16 + col} hex={tryGetHexValue(vr.index, col, hex)}/>))}
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>)
}