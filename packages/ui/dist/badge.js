import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from 'class-variance-authority';
import { cn } from './utils';
const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
    variants: {
        variant: {
            default: 'border-transparent bg-accent text-text-primary hover:bg-accent/80',
            secondary: 'border-transparent bg-background-tertiary text-text-secondary hover:bg-background-tertiary/80',
            destructive: 'border-transparent bg-error text-text-primary hover:bg-error/80',
            outline: 'text-text-primary border-border',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
function Badge({ className, variant, ...props }) {
    return (_jsx("div", { className: cn(badgeVariants({ variant }), className), ...props }));
}
export { Badge, badgeVariants };
