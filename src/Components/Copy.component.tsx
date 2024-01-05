import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { copyToClipboard } from "../helpers/clipboard";

export default function CopyToClipboardComponent({ response = "" }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (response: string) => {
    if (!response) return;

    if (await copyToClipboard(response)) {
      setCopied(true);
    }
  };
  return (
    <div className="flex justify-end mb-3">
      {" "}
      <span
        style={{ color: copied ? "blue" : "" }}
        onClick={() => handleCopy(response)}
      >
        <FaCopy />
      </span>
    </div>
  );
}
