import {useEffect, useRef} from "react";

const useDefer = () => {
    const data = useRef<number|undefined>(undefined);

    useEffect(() => {
        return () => {
            clearTimeout(data.current);
        }
    }, []);

    return (cb: () => void, timeout: number) => {
        clearTimeout(data.current);
        data.current = setTimeout(cb, timeout);
    };
};

export default useDefer;