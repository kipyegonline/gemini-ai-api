import React, { SetStateAction, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdCompare } from "react-icons/md";
import { BsImageFill } from "react-icons/bs";

import { runGemini } from "../helpers/geminiai";
import Spinners from "./Spinners";
import CopyToClipboardComponent from "./Copy.component";
import ReportProblemModal from "./ReportProblemModal";

// Global gtag injected by Google Analytics
declare function gtag(
  command: string,
  action: string,
  params?: Record<string, unknown>,
): void;

type MyFile = null | { data: string; mimeType: string };

type UploadArg = {
  side: number;
  file: File;
  setState: React.Dispatch<SetStateAction<MyFile>>;
};

export default function MultipleComparisons() {
  const [img1, setImage1] = useState<MyFile>(null);
  const [img2, setImage2] = useState<MyFile>(null);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imageErr, setImageErr] = useState({ im1: "", im2: "" });
  const [loading, setLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const base64ext = "data:image/png;base64,";
  const MB = 1e6;

  const getBase64 = (
    file: File,
    setState: React.Dispatch<SetStateAction<MyFile>> = () => {},
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      const { result } = reader;
      setState({
        data: (result as string)?.split(",")[1],
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = ({ file, side, setState }: UploadArg) => {
    if (file.size >= 4 * MB) {
      if (side === 1)
        setImageErr((e) => ({ ...e, im1: "Image must be under 4 MB" }));
      else setImageErr((e) => ({ ...e, im2: "Image must be under 4 MB" }));
      setState(null);
      return;
    }
    if (side === 1) setImageErr((e) => ({ ...e, im1: "" }));
    else setImageErr((e) => ({ ...e, im2: "" }));
    getBase64(file, setState);
  };

  const goTo = (el: string) => {
    document.getElementById(el)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleComparison = async () => {
    if (!prompt || !img1 || !img2) {
      setError("Please add 2 images and a prompt before comparing.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const imageParts = [{ inlineData: img1 }, { inlineData: img2 }];

    setLoading(true);
    setResponse("");
    setError("");
    setTimeout(() => goTo("compare-response"), 500);

    gtag("event", "multiple_comparison_submit", {
      origin: window.location.origin,
      prompt_length: prompt.length,
    });

    try {
      const res = await runGemini(prompt, imageParts);
      if (typeof res === "object" && res.error) {
        setError(`Something went wrong: ${res.message}`);
        gtag("event", "multiple_comparison_error", {
          origin: window.location.origin,
          error_message: res.message,
        });
      } else {
        setResponse(res as string);
        gtag("event", "multiple_comparison_success", {
          origin: window.location.origin,
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Something went wrong: ${message}`);
      gtag("event", "multiple_comparison_error", {
        origin: window.location.origin,
        error_message: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const UploadZone = ({
    id,
    img,
    setState,
    side,
    err,
  }: {
    id: string;
    img: MyFile;
    setState: React.Dispatch<SetStateAction<MyFile>>;
    side: number;
    err: string;
  }) => (
    <div className="flex-1 flex flex-col gap-3">
      {img ? (
        <div className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center max-h-56">
          <img
            alt={`Image ${side}`}
            className="max-h-56 w-auto object-contain mx-auto"
            src={base64ext + img.data}
          />
        </div>
      ) : (
        <label htmlFor={id} className="drop-zone cursor-pointer min-h-[160px]">
          <BsImageFill className="text-3xl opacity-40" />
          <span className="text-sm font-medium">Image {side}</span>
          <span className="text-xs opacity-50">Click to upload</span>
        </label>
      )}
      <button
        className="btn-ghost w-full"
        onClick={() => document.getElementById(id)?.click()}
      >
        <FaCloudUploadAlt />
        {img ? `Replace image ${side}` : `Upload image ${side}`}
      </button>
      <input
        type="file"
        id={id}
        className="hidden"
        onChange={(e) => {
          const file = e.target?.files?.[0];
          if (file) handleImageUpload({ file, side, setState });
          e.target.value = "";
        }}
      />
      {err && <p className="error-pill">{err}</p>}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Two upload zones */}
      <div className="card">
        <p className="text-sm text-muted mb-4 text-left">
          Upload two images to compare side by side.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <UploadZone
            id="img1"
            img={img1}
            setState={setImage1}
            side={1}
            err={imageErr.im1}
          />
          <UploadZone
            id="img2"
            img={img2}
            setState={setImage2}
            side={2}
            err={imageErr.im2}
          />
        </div>
      </div>

      {/* Prompt + action */}
      <div className="card flex flex-col gap-4">
        <label className="text-sm font-medium text-muted text-left">
          Comparison prompt
        </label>
        <textarea
          className="input-field"
          placeholder="e.g. What are the key differences between these two images?"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="btn-primary w-full"
          disabled={loading}
          onClick={handleComparison}
        >
          <MdCompare />
          {loading ? "Comparing…" : "Compare Images"}
        </button>
        {error && (
          <div className="flex flex-col gap-1.5">
            <p className="error-pill text-left">{error}</p>
            <p className="text-xs text-left text-[var(--text-muted)]">
              Still seeing this?{" "}
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="text-[#1877F2] hover:underline transition-colors"
              >
                Report this problem
              </button>
            </p>
          </div>
        )}
      </div>

      <ReportProblemModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />

      {/* Response */}
      {(loading || response) && (
        <div id="compare-response" className="card flex flex-col gap-3">
          {loading ? (
            <Spinners />
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-muted uppercase tracking-widest">
                  Comparison Result
                </span>
                <CopyToClipboardComponent response={response} />
              </div>
              <div className="response-card text-left">{response}</div>
              <p className="text-xs text-muted mt-1 text-left">
                AI may display inaccurate info — double check critical
                responses.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
