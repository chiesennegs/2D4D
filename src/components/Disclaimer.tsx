export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="disclaimer">
      <strong>Not a diagnosis.</strong> {children}
    </div>
  );
}
