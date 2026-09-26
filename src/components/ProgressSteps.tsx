export function ProgressSteps({ step, total }: { step: number; total: number }) {
  return (
    <div className="progress-steps" role="progressbar" aria-valuenow={step} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < step ? "done" : ""} />
      ))}
    </div>
  );
}
