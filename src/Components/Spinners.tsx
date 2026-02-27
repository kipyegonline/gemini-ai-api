import { ScaleLoader, PulseLoader } from "react-spinners";

const ACCENT = "#1877F2";

export default function Spinners({ single = false }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      {single ? (
        <ScaleLoader loading color={ACCENT} aria-label="Loading" />
      ) : (
        <PulseLoader loading color={ACCENT} size={10} aria-label="Loading" />
      )}
      <p className="text-xs text-muted">Processing…</p>
    </div>
  );
}
