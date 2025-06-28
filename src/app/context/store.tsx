
'use client';
import { createContext, useLayoutEffect, useState, ReactNode } from "react";


interface ContextProps {
    md: boolean,
    handleResizeGlobal: any,
}
export const GlobalContext = createContext<ContextProps>({
    md: false,
    handleResizeGlobal: () => {}
})


interface ProtectedRouteProps {
    children?: ReactNode;
}
export const GlobalContextProvider: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [md, setMd] = useState<boolean>(false);
    
    useLayoutEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setMd(true);
            } else {
                setMd(false);
            }
        };
        if (window.innerWidth < 768) {
            setMd(true);
        } else {
            setMd(false);
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleResizeGlobal = () => {      
        if (md) {
            const intervalId = setInterval(() => {
                const elements = document.querySelectorAll('.ant-select-dropdown-placement-bottomRight');
                elements.forEach(element => {
                element.classList.remove('ant-select-dropdown-placement-bottomRight');
                });
            }, 10);
          
            setTimeout(() => {
                clearInterval(intervalId);
            }, 1000);
        }
    };

    return (
        <GlobalContext.Provider value={{ md, handleResizeGlobal }}>
            {children}
        </GlobalContext.Provider>
    )
};