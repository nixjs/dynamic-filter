import { useCallback, useEffect } from 'react';

const useOutsideClick = (boxRef, func) => {
    const handleClickOutside = useCallback(
        event => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                func();
            }
        },
        [boxRef, func],
    );

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });
};

export default useOutsideClick;
