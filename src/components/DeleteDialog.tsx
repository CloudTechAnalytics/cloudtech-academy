import { useEffect, useState, type ReactNode } from "react";
import { Modal } from "./Modal";
import { Alert, TextArea, TextField } from "./Form";
import { Button } from "./Button";

/**
 * Confirms a permanent deletion. The admin has to type the item's ID, so it can't happen by a stray click,
 * and can leave a reason that goes in the deletion log.
 */
export function DeleteDialog({
  open,
  title,
  confirmWord,
  onClose,
  onDelete,
  children,
}: {
  open: boolean;
  title: string;
  /** What must be typed to enable the button, e.g. a certificate ID. */
  confirmWord: string;
  onClose: () => void;
  onDelete: (reason: string) => Promise<void>;
  children: ReactNode;
}) {
  const [typed, setTyped] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setTyped("");
    setReason("");
    setError(null);
  }, [open, confirmWord]);

  const matches = typed.trim().toUpperCase() === confirmWord.toUpperCase();
  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      await onDelete(reason.trim());
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't delete it.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-3 leading-relaxed">{children}</div>
      <div className="mt-4 space-y-4">
        <TextArea label="Reason (optional, kept in the deletion log)" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} />
        <TextField
          label={`Type ${confirmWord} to confirm`}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="characters"
        />
      </div>
      {error && (
        <div className="mt-3">
          <Alert tone="error">{error}</Alert>
        </div>
      )}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" disabled={!matches || busy} onClick={() => void run()}>
          {busy ? "Deleting…" : "Delete permanently"}
        </Button>
      </div>
    </Modal>
  );
}
