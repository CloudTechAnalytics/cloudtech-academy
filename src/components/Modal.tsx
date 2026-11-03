import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * A modal dialog on the native <dialog> element: focus moves into it, Escape closes it, and the page
 * behind can't be used until it closes.
 */
export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-line bg-paper p-0 text-ink shadow-[0_30px_80px_-30px_rgba(23,23,23,0.55)] backdrop:bg-ink/45"
    >
      {open && (
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-serif text-[1.45rem] leading-tight">
              {title}
            </h2>
            <button type="button" onClick={onClose} className="-m-1.5 rounded-lg p-1.5 text-muted hover:bg-sand hover:text-ink" aria-label="Close">
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      )}
    </dialog>
  );
}
