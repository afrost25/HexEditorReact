import { createContext, useContext, useState, type ReactNode, type SetStateAction } from "react";

interface HexContextType
{
    fileName: string;
    hex: Uint8Array;
    setFileName: React.Dispatch<SetStateAction<string>>;
    setHex: React.Dispatch<React.SetStateAction<Uint8Array>>
}

const HexContext = createContext<HexContextType | undefined>(undefined);

export function HexProvider({children}: {children: ReactNode})
{
    const [hex, setHex] = useState<Uint8Array>(new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]));
    const [fileName, setFileName] = useState<string>('hexFile.bin');

    return (
        <HexContext.Provider value={{hex, setHex, fileName, setFileName}}>
            {children}
        </HexContext.Provider>
    )
}

export function useHex()
{
    const context = useContext(HexContext);
    if(!context)
    {
        throw new Error("Context Undefined!");
    }

    return context;
}