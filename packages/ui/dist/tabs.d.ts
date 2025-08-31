import * as React from 'react';
interface TabsProps {
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}
interface TabsListProps {
    className?: string;
    children: React.ReactNode;
}
interface TabsTriggerProps {
    value: string;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}
interface TabsContentProps {
    value: string;
    className?: string;
    children: React.ReactNode;
}
declare const Tabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
declare const TabsList: React.ForwardRefExoticComponent<TabsListProps & React.RefAttributes<HTMLDivElement>>;
declare const TabsTrigger: React.ForwardRefExoticComponent<TabsTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React.ForwardRefExoticComponent<TabsContentProps & React.RefAttributes<HTMLDivElement>>;
export { Tabs, TabsList, TabsTrigger, TabsContent };
