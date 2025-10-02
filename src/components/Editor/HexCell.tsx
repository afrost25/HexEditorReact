import { useEffect, useState, type ChangeEvent, type FocusEvent, type JSX, type KeyboardEvent, type SetStateAction, } from "react";
import { useHex } from "../HexContext";
import type { FocusHexCell, HexAction } from "../../App";

interface HexCellProps
{
    hex: number | undefined;
    address: number;
    focusCell: FocusHexCell | undefined;
    setFocusCell: React.Dispatch<SetStateAction<FocusHexCell | undefined>>;
    setUndoStack: React.Dispatch<SetStateAction<HexAction[]>>;
    setRedoStack: React.Dispatch<SetStateAction<HexAction[]>>;
}

export default function HexCell ({hex, address, focusCell, setFocusCell, setUndoStack, setRedoStack }: HexCellProps): JSX.Element
{
    const [curVal, setCurVal] = useState('');
    const {setHex} = useHex();

    useEffect(() => {
        setCurVal(hex !== undefined ? hex.toString(16).toUpperCase().padStart(2, '0'): '');
    }, [hex])

    function handleChange(event: ChangeEvent<HTMLInputElement>)
    {
        let hexVal = event.target.value.toUpperCase();

        if(/^[0-9A-F]{0,2}$/.test(hexVal))
        {
            setUndoStack(stack => {
                let undoStack = [...stack]

                undoStack.push({
                        address: address,
                        oldValue: parseInt(curVal),
                        newValue: parseInt(hexVal),
                    });

                return undoStack;
            });

            //Clear redo stack if a change has been made
            setRedoStack([]);

            setCurVal(hexVal);
        }
    }

    function attemptSave(hex: string)
    {
        setCurVal(hex);
        setHex(hexArr => 
        {
            const copyArr = [...hexArr];

            if(address !== undefined)
            {
                copyArr[address] = parseInt(hex, 16);
            }

            return new Uint8Array(copyArr);
        });
    }

    function handleBlur(event: FocusEvent<HTMLInputElement>): void
    {
        attemptSave(event.currentTarget.value)
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void
    {
        if(event.key === "Enter" || event.key === "Tab")
        {
            attemptSave(event.currentTarget.value);
        }
    }

    function handleMouseOver()
    {
        setFocusCell({ address: address, hex: hex });
    }

    function handleMouseLeave()
    {
        setFocusCell(undefined);
    }

    return( 
        <td 
            className={`text-white transition-color rounded-lg duration-300 w-10 ${focusCell && focusCell.address === address && 'bg-[#2d3748]'}`}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
        >
            <input
                type="text"
                value={curVal}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                maxLength={2}
                className="w-full bg-transparent text-white border-none outline-none text-center">
            </input>
        </td>
    );
}