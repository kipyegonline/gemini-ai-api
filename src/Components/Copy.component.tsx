import { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import { copyToClipboard } from "../helpers/clipboard";

export default function CopyToClipboardComponent({ response = "" }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const handleCopy = async (response: string) => {
    if (!response) return;

    if (await copyToClipboard(response)) {
      setCopied(true);
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    }
  };

  return (
    <div className="flex justify-end items-center mb-2 relative">
      {" "}
      <span
        style={{ color: copied ? "blue" : "" }}
        onClick={() => handleCopy(response)}
      >
        <FaCopy />
      </span>{" "}
      {show && (
        <span className=" absolute right-6 text-green-600 ml-2 transition-all duration-500 ease-in-out font-medium">
          copied!
        </span>
      )}
    </div>
  );
}
