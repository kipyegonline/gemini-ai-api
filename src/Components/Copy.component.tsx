import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { copyToClipboard } from "../helpers/clipboard";

export default function CopyToClipboardComponent({ response = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!response) return;
    if (await copyToClipboard(response)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
        copied
          ? "bg-success/10 text-success border border-success/30"
          : "bg-[#27272a] text-muted hover:text-white border border-[#3f3f46]"
      }`}
    >
      {copied ? <FaCheck size="0.7rem" /> : <FaCopy size="0.7rem" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
