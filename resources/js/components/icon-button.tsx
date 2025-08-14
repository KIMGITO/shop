import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as React from 'react';

type ColorVariant = 'success' | 'warning' |  'info' | 'danger' ;

interface IconButtonProps extends React.ComponentProps<typeof Button> {
    icon: React.ElementType;
    name?: string; // tooltip text
    colorVariant?: ColorVariant;
}

const variantClasses: Record<ColorVariant, string> = {
    success: 'text-green-900 bg-transparent hover:bg-green-200',
    warning: 'text-yellow-900 bg-transparent hover:bg-yellow-200',
    info: 'text-blue-800 bg-transparent hover:bg-blue-200',
    danger: 'text-red-900 bg-transparent hover:bg-red-200',
};

function IconButton({ icon: Icon, name, onClick, className, colorVariant = 'info', ...props }: IconButtonProps) {
    return (
        <Button
            size="sm"
            className={cn(variantClasses[colorVariant], 'flex items-center gap-2', className)}
            onClick={onClick || undefined}
            title={name || undefined}
            {...props}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );
}

export { IconButton };
