'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from './utils';
const TabsContext = React.createContext(null);
const Tabs = React.forwardRef(({ value, onValueChange, className, children }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '');
    const handleValueChange = React.useCallback((newValue) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
    }, [onValueChange]);
    React.useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);
    return (_jsx(TabsContext.Provider, { value: { value: internalValue, onValueChange: handleValueChange }, children: _jsx("div", { ref: ref, className: cn('w-full', className), children: children }) }));
});
Tabs.displayName = 'Tabs';
const TabsList = React.forwardRef(({ className, children }, ref) => {
    return (_jsx("div", { ref: ref, className: cn('inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500', className), role: "tablist", children: children }));
});
TabsList.displayName = 'TabsList';
const TabsTrigger = React.forwardRef(({ value, className, children, disabled, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within a Tabs component');
    }
    const isActive = context.value === value;
    return (_jsx("button", { ref: ref, className: cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', isActive
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900', className), onClick: () => !disabled && context.onValueChange(value), disabled: disabled, role: "tab", "aria-selected": isActive, ...props, children: children }));
});
TabsTrigger.displayName = 'TabsTrigger';
const TabsContent = React.forwardRef(({ value, className, children }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within a Tabs component');
    }
    if (context.value !== value) {
        return null;
    }
    return (_jsx("div", { ref: ref, className: cn('mt-2', className), role: "tabpanel", tabIndex: 0, children: children }));
});
TabsContent.displayName = 'TabsContent';
export { Tabs, TabsList, TabsTrigger, TabsContent };
