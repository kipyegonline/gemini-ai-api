import React from "react";
import Modal from "react-modal";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  setOpen: (f: any) => void;
};
const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",

    transform: "translate(-50%, -50%)",
  },
};
export default function GeminiModal({
  children,
  isOpen = false,
  setOpen = (f) => f,
}: Props) {
  React.useEffect(() => {
    addEventListener("visibilitychange", () => {
      if (document.hidden) {
        setOpen(false);
      }
    });
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={setOpen}
      className="max-w-full"
      style={customStyles}
    >
      {children}
    </Modal>
  );
}
