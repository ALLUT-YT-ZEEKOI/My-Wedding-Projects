import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'block w-full rounded-xl border-gray-200 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white text-gray-900 ' +
                className
            }
            ref={localRef}
        />
    );
});
