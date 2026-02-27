import React, { useState } from "react";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import { MdCheckCircle } from "react-icons/md";
import { PulseLoader } from "react-spinners";

const ACCENT = "#1877F2";

const modalStyles: Modal.Styles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    inset: "unset",
    width: "100%",
    maxWidth: "440px",
    borderRadius: "1rem",
    padding: "1.75rem",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ReportProblemModal({ isOpen, onClose }: Props) {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => {
    if (status === "loading") return;
    setDescription("");
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/vinnykipx@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: "Image AI — Problem Report",
            message: description.trim(),
            origin: window.location.origin,
            _template: "table",
          }),
        },
      );

      const data = await res.json();

      if (data.success === "true" || data.success === true) {
        setStatus("success");
        setTimeout(() => handleClose(), 2500);
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "Could not send your report. Please try again or email vinnykipx@gmail.com directly.",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={modalStyles}
      ariaHideApp={false}
      closeTimeoutMS={150}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[var(--text)]">
          Report a Problem
        </h2>
        {status !== "loading" && (
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
            aria-label="Close"
          >
            <IoClose className="text-lg" />
          </button>
        )}
      </div>

      {/* Success state */}
      {status === "success" ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <MdCheckCircle className="text-4xl text-[#1877F2]" />
          <p className="font-medium text-[var(--text)]">Report sent!</p>
          <p className="text-xs text-[var(--text-muted)]">
            Thanks for the feedback. We'll look into it.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="report-desc"
              className="text-sm font-medium text-[var(--text-muted)]"
            >
              Describe the issue
            </label>
            <textarea
              id="report-desc"
              rows={5}
              className="input-field resize-none"
              placeholder="What went wrong? Please be as specific as possible…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={status === "loading"}
            />
          </div>

          {status === "error" && (
            <p className="error-pill text-left text-xs">{errorMsg}</p>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="btn-ghost"
              onClick={handleClose}
              disabled={status === "loading"}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={status === "loading" || !description.trim()}
              style={{ minWidth: "100px" }}
            >
              {status === "loading" ? (
                <PulseLoader color={ACCENT} size={6} />
              ) : (
                "Send Report"
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
