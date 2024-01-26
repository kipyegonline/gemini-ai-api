import { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import { copyToClipboard } from "../helpers/clipboard";
import { FaCheck } from "react-icons/fa";
import { FaCheckDouble } from "react-icons/fa";

export default function CopyToClipboardComponent({ response = "" }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const handleCopy = async (response: string) => {
    if (!response) return;

    if (await copyToClipboard(response)) {
      setCopied(true);
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }
  };

  return (
    <div className="flex justify-end items-center mb-2 relative">
      {" "}
      <span className="text-green-600 text-base mr-2">
        {" "}
        {show && <FaCheckDouble />}
      </span>
      <span
        style={{ color: copied ? "blue" : "" }}
        onClick={() => handleCopy(response)}
      >
        <FaCopy />
      </span>{" "}
    </div>
  );
}
