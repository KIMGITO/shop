// components/FlashMessages.tsx
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function FlashMessages() {
    const { props } = usePage<{
        flash?: {
            success?: string;
            error?: string;
            warning?: string;
            info?: string;
        };
    }>();

    useEffect(() => {
        if (!props.flash) return;

        // Show messages
        if (props.flash.error) {
            toast.error(props.flash.error);
        }
        if (props.flash.success) {
            toast.success(props.flash.success);
        }

        // Clear flash from history state
        window.history.replaceState({ ...window.history.state, flash: null }, '', window.location.href);
    }, [props.flash]);

    return null;
}
