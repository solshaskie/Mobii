import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from './utils';
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (_jsx("input", { type: type, className: cn('flex h-10 w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className), ref: ref, ...props }));
});
Input.displayName = 'Input';
export { Input };
