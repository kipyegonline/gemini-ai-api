import React from "react";
import Modal from "react-modal";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  setOpen: (f: any) => void;
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  zIndex: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const contentStyle: React.CSSProperties = {
  position: "relative",
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "1rem",
  padding: "1.5rem",
  maxWidth: "90vw",
  outline: "none",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
};

export default function GeminiModal({
  children,
  isOpen = false,
  setOpen = (f) => f,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={setOpen}
      style={{ overlay: overlayStyle, content: contentStyle }}
    >
      <button
        onClick={() => setOpen(false)}
        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#27272a] text-muted hover:text-white flex items-center justify-center text-xs transition-colors"
        aria-label="Close"
      >
        ✕
      </button>
      {children}
    </Modal>
  );
}
