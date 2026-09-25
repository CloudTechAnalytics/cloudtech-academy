export function ProgressBar({ value, label, showValue = true }: { value: number; label: string; showValue?: boolean }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      {showValue && (
        <div className="mb-1.5 flex justify-between text-[0.8125rem]">
          <span className="text-muted">Progress</span>
          <span className="font-semibold text-ink">{v}%</span>
        </div>
      )}
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} className="h-2 overflow-hidden rounded-full bg-sand">
        <div className="h-full rounded-full bg-brass transition-[width] duration-700 ease-out-soft" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
