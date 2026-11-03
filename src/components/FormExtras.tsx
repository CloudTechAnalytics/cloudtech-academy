import { useId, useRef, useState, type ReactNode } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { getBackend } from "@/lib/backend";
import { Alert, TextField } from "./Form";

const selectCls =
  "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-[1rem] text-ink focus:border-ink/60 focus:outline-2 focus:outline-offset-2 focus:outline-brass-dark";

export function SelectField({
  label,
  value,
  onChange,
  children,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
  hint?: ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={hint ? `${id}-hint` : undefined} className={selectCls}>
        {children}
      </select>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

/** A labelled checkbox with room for an explanation underneath. */
export function CheckField({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-describedby={hint ? `${id}-hint` : undefined} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brass-dark)]" />
      <div>
        <label htmlFor={id} className="text-[0.9375rem] font-medium text-ink">
          {label}
        </label>
        {hint && (
          <p id={`${id}-hint`} className="mt-0.5 text-[0.8125rem] text-muted">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

/** An image: upload a file (PNG, JPEG or WebP) or paste a link; shows a preview and can remove it. */
export function ImageField({ label, value, onChange, shape = "wide", hint }: { label: string; value: string | null; onChange: (url: string | null) => void; shape?: "wide" | "round"; hint?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await (await getBackend()).admin.uploadEventImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't upload that image.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  const isData = !!value && value.startsWith("data:");
  return (
    <div>
      <p className="text-[0.875rem] font-medium text-ink">{label}</p>
      <div className="mt-1.5 flex flex-wrap items-start gap-4">
        {value ? (
          <img src={value} alt="" className={shape === "round" ? "h-20 w-20 rounded-full object-cover" : "aspect-[16/8] w-56 rounded-lg border border-line object-cover"} />
        ) : (
          <span className={`flex items-center justify-center border border-dashed border-line-strong text-subtle ${shape === "round" ? "h-20 w-20 rounded-full" : "aspect-[16/8] w-56 rounded-lg"}`}>
            <ImagePlus aria-hidden className="h-6 w-6" />
          </span>
        )}
        <div className="space-y-2">
          <input id={id} ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => void upload(e.target.files?.[0])} />
          <div className="flex flex-wrap gap-2">
            <label htmlFor={id} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-line-strong bg-paper px-4 py-2 text-[0.875rem] font-semibold hover:border-ink/40 focus-within:outline-2">
              <ImagePlus aria-hidden className="h-4 w-4" /> {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
            </label>
            {value && (
              <button type="button" onClick={() => onChange(null)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-[0.875rem] font-semibold text-danger hover:bg-danger/10">
                <Trash2 aria-hidden className="h-4 w-4" /> Remove
              </button>
            )}
          </div>
          <p className="text-[0.8125rem] text-muted">{hint ?? "PNG, JPEG or WebP, up to 2 MB."}</p>
        </div>
      </div>
      {!isData && (
        <div className="mt-3 max-w-xl">
          <TextField label="Or paste an image link" type="url" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} placeholder="https://…" />
        </div>
      )}
      <div aria-live="polite" className="mt-2">
        {error && <Alert tone="error">{error}</Alert>}
      </div>
    </div>
  );
}
