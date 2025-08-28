import { forwardRef, useEffect, useState, type ChangeEvent, type FocusEvent, type JSX, type KeyboardEvent, } from "react";

interface HexCellProps
{
    index: number | undefined;
    hex: number | undefined;
    setHex: React.Dispatch<React.SetStateAction<Uint8Array<ArrayBufferLike>>>;
}

export default forwardRef<HTMLInputElement, HexCellProps>(function HexCell ({index, hex, setHex }, ref): JSX.Element
{
    const [hover, setHover] = useState(false);
    const [curVal, setCurVal] = useState('');

    useEffect(() => {
        setCurVal(hex !== undefined ? hex.toString().toUpperCase().padStart(2, '0'): '');
    }, [hex])

    function handleChange(event: ChangeEvent<HTMLInputElement>)
    {
        let hexVal = event.target.value.toUpperCase();

        if(/^[0-9A-F]{0,2}$/.test(hexVal))
        {
            setCurVal(hexVal);
        }
    }

    function attemptSave(hex: string)
    {
        setCurVal(hex);

        setHex(hexArr => 
        {
            const copyArr = [...hexArr];

            if(index)
            {
                copyArr[index] = parseInt(hex);
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

    return( 
        <td 
            className={`text-white transition-color rounded-lg duration-300 w-9 ${hover && 'bg-[#2d3748]'}`}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <input
                ref={ref}
                type="text"
                value={curVal}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                maxLength={2}
                className="w-full bg-transparent text-white border-none outline-none text-center">
            </input>
        </td>
    );
});