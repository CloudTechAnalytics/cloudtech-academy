import { useState } from "react";
import type { Course } from "@/content/types";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Form";
import { RESET_AFTER_DAYS } from "@/lib/inactivity";
import { track } from "@/lib/tracking";

/**
 * Asks before enrolling in a free course, so nobody enrols by accident. Enrolling adds the course to My Learning and
 * starts saving progress; reading the lessons never needs it.
 */
export function EnrolDialog({ course, open, onClose, onConfirm }: { course: Course; open: boolean; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      track("enrol", { item: course.title });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't enrol you. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} title="Enrol in this course?" onClose={busy ? () => {} : onClose}>
      <p className="text-[1.0625rem] leading-relaxed">
        You are about to enrol in <strong className="font-semibold">{course.title}</strong>. It is free.
      </p>
      <ul className="mt-4 space-y-2 text-[0.9375rem] text-muted">
        <li>It is added to My Learning on your dashboard, and your progress is saved.</li>
        <li>
          If you don't touch it for {RESET_AFTER_DAYS} days, your progress in it starts over. Badges you have earned always stay.
        </li>
        <li>You can remove it from My Learning at any time.</li>
      </ul>
      <p className="mt-4 text-[0.875rem] text-muted">We will also email you a confirmation.</p>
      {error && (
        <div className="mt-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => void confirm()} loading={busy}>
          Yes, enrol me
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          Not now
        </Button>
      </div>
    </Modal>
  );
}
