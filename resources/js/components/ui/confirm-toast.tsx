// ConfirmToast.ts
import { toast } from "sonner";

interface ConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant: 'error' | 'warning';
}

export function ConfirmToast({ message, onConfirm, onCancel, variant }: ConfirmProps) {
  const toastFn = variant === 'error' ? toast.error : toast.warning;

  return toastFn('Confirm', {
    description: message,
    duration: Infinity,
    action: {
      label: (
        <div className="flex gap-2">
          <button
            className="rounded px-2 py-1 text-sm hover:bg-gray-500"
            onClick={(e) => {
              e.preventDefault();
              toast.dismiss();
              onCancel();
            }}
          >
            No
          </button>
          <button
            className="rounded px-2 py-1 text-sm text-red-700 hover:bg-red-600"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              toast.dismiss();
            }}
          >
            Yes
          </button>
        </div>
      )
    }
  });
}
