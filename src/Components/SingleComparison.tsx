import React from "react";
import { FaCloudUploadAlt, FaCamera } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { BsImageFill } from "react-icons/bs";

import { runGemini } from "../helpers/geminiai";
import GeminiModal from "./Modal";
import GeminiWebcam from "./Webcam";
import Spinners from "./Spinners";
import CopyToClipboardComponent from "./Copy.component";
import { defaultPayload } from "../helpers/defaults";
import ReportProblemModal from "./ReportProblemModal";

// Global gtag injected by Google Analytics
declare function gtag(
  command: string,
  action: string,
  params?: Record<string, unknown>,
): void;

type Image = null | { data: string; mimeType: string };

export default function SingleComparison() {
  const [image, setImage] = React.useState<Image>(null);
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState("");
  const [err, setError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [onCamera, setOnCamera] = React.useState<null | 0 | 1>(null);
  const [start, setStart] = React.useState<null | 1 | 2>(null);
  const [reportOpen, setReportOpen] = React.useState(false);
  const defaultRef = React.useRef<null | "1" | "2">(null);

  React.useEffect(() => {
    if (response)
      document
        .getElementById("response")
        ?.scrollIntoView({ behavior: "smooth" });
  }, [response]);

  React.useEffect(() => {
    if (defaultRef.current === "1") createDefaultView();
    defaultRef.current = "1";
  }, []);

  React.useEffect(() => {
    if (typeof start === "number") handleRun();
  }, [start]);

  const createDefaultView = () => {
    const defaultKey = "default-view";
    const [a] = defaultPayload;
    const defaultView = localStorage.getItem(defaultKey);
    if (defaultView === null) {
      setImage(a.img);
      setPrompt(a.prompt);
      localStorage.setItem(defaultKey, "1");
      setStart(1);
    } else {
      localStorage.setItem(defaultKey, "2");
    }
  };

  const getBase64 = async (file: File): Promise<Image> => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        const { result } = reader;
        if (typeof result === "string")
          resolve({ data: result, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    setOnCamera(0);
    const MB = 1e6;
    if (file) {
      setPrompt("");
      if (file.size >= 4 * MB) {
        setError("Upload an image below 4MB");
        return;
      }
      setError("");
      const img = await getBase64(file);
      setImage(img);
    }
    e.target.value = "";
  };

  const goTo = (el: string) => {
    document.getElementById(el)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRun = async () => {
    if (!image || !prompt) {
      setError("Add an image and a prompt to get started.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    const payload = {
      inlineData: { ...image, data: image.data.split(",")[1] },
    };

    setLoading(true);
    setResponse("");
    setError("");
    setTimeout(() => goTo("response"), 500);

    gtag("event", "single_comparison_submit", {
      origin: window.location.origin,
      prompt_length: prompt.length,
    });

    try {
      const res = await runGemini(prompt, [payload]);

      if (typeof res === "object" && res.error) {
        const message =
          JSON.parse(res.message)?.error?.message ||
          res.message ||
          "An error occurred";
        setError(`Something went wrong: ${message}`);
        gtag("event", "single_comparison_error", {
          origin: window.location.origin,
          error_message: message,
        });
      } else {
        setResponse(res as string);
        gtag("event", "single_comparison_success", {
          origin: window.location.origin,
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Something went wrong: ${message}`);
      gtag("event", "single_comparison_error", {
        origin: window.location.origin,
        error_message: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCameraImage = (img: string) => {
    const [type] = img.split(",");
    const mimeType = type.split(":")[1].split(";")[0];
    setOnCamera(1);
    setImage({ data: img, mimeType });
    setTimeout(() => setOpen(false), 800);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Image area */}
      <div className="card">
        {/* Preview */}
        {image ? (
          <div className="mb-5 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center max-h-72">
            <img
              src={image.data}
              alt="Preview"
              className="max-h-72 w-auto object-contain mx-auto"
            />
          </div>
        ) : (
          <label
            htmlFor="img-btn"
            className="drop-zone mb-5 cursor-pointer"
            onClick={() => document.getElementById("img-btn")?.click()}
          >
            <BsImageFill className="text-3xl opacity-40" />
            <span className="text-sm font-medium">
              Drop an image or click to upload
            </span>
            <span className="text-xs opacity-50">
              JPEG, PNG, WebP · max 4 MB
            </span>
          </label>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            className={`btn-ghost flex-1 ${onCamera === 0 ? "!border-accent !text-white" : ""}`}
            disabled={loading}
            onClick={() => document.getElementById("img-btn")?.click()}
          >
            <FaCloudUploadAlt />
            {image && onCamera === 0 ? "Replace" : "Upload"}
          </button>
          <button
            className={`btn-ghost flex-1 ${onCamera === 1 ? "!border-accent !text-white" : ""}`}
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <FaCamera />
            {onCamera === 1 ? "Retake" : "Webcam"}
          </button>
        </div>

        <input
          id="img-btn"
          type="file"
          disabled={loading}
          className="hidden"
          accept=".jpeg,.jpg,.png,.webp"
          onChange={handleFileUpload}
        />
      </div>

      {/* Prompt + submit */}
      <div className="card flex flex-col gap-4">
        <label className="text-sm font-medium text-muted text-left">
          Your prompt
        </label>
        <textarea
          rows={3}
          className="input-field"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. What's in this image? Describe in detail."
        />
        <button
          className="btn-primary w-full"
          onClick={handleRun}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "Processing…" : "Ask AI"}
          <IoSend />
        </button>
        {err && (
          <div className="flex flex-col gap-1.5">
            <p className="error-pill text-left">{err}</p>
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
        <div id="response" className="card flex flex-col gap-3">
          {loading ? (
            <Spinners single />
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-muted uppercase tracking-widest">
                  Response
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

      {/* Webcam modal */}
      <GeminiModal isOpen={open} setOpen={() => setOpen(false)}>
        <GeminiWebcam sendImage={handleCameraImage} />
      </GeminiModal>
    </div>
  );
}
