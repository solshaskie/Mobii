import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from './utils';
const buttonVariants = cva('inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95', {
    variants: {
        variant: {
            default: 'bg-accent text-text-primary hover:bg-accent/90 shadow-lg hover:shadow-xl',
            destructive: 'bg-error text-text-primary hover:bg-error/90 shadow-lg hover:shadow-xl',
            outline: 'border border-border bg-background-secondary text-text-primary hover:bg-background-tertiary hover:border-accent/50',
            secondary: 'bg-background-tertiary text-text-primary hover:bg-background-secondary border border-border',
            ghost: 'hover:bg-background-secondary text-text-secondary hover:text-text-primary',
            link: 'text-accent underline-offset-4 hover:underline',
            gradient: 'bg-gradient-to-r from-accent-pink to-accent-blue text-text-primary hover:from-accent-pink/90 hover:to-accent-blue/90 shadow-lg hover:shadow-xl',
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-8 px-3 text-xs',
            lg: 'h-12 px-8 text-base',
            xl: 'h-14 px-10 text-lg',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    return (_jsx("button", { className: cn(buttonVariants({ variant, size, className })), ref: ref, ...props }));
});
Button.displayName = 'Button';
export { Button, buttonVariants };
