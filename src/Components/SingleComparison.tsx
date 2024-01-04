import React from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

//import Spinner from "react-spinners"
import { runGemini } from "../helpers/geminiai";
import GeminiModal from "./Modal";
import GeminiWebcam from "./Webcam";
import Spinners from "./Spinners";

type Image = null | { data: string; mimeType: string };
export default function SingleComparison() {
  const [image, setImage] = React.useState<Image>(null);
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState("");
  const [err, setError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [onCamera, setOnCamera] = React.useState<null | 0 | 1>(null);

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
    if (file) {
      setPrompt("");

      const image: Image = await getBase64(file);

      setImage(image);
    }
    e.target.value = "";
  };

  const handleRun = async () => {
    if (!image || !prompt) {
      setError("Add a clear image together with prompt text");
      setTimeout(() => setError(""), 5000);
      return false;
    }
    const payload = {
      inlineData: { ...image, data: image?.data.split(",")[1] },
    };
    setLoading(true);
    setResponse("");
    setError("");
    const response = await runGemini(prompt, [payload]);
    // check if there was an error processing image
    if (response?.error) {
      setError(response.message);
    } else {
      setResponse(response);
    }

    setLoading(false);
  };
  const handleCameraImage = (image: string) => {
    const [type, data] = image.split(",");
    const [mimeType] = type.split(":")[1].split(";");
    setOnCamera(1);
    setImage({ data: image, mimeType });
    setTimeout(() => setOpen(false), 1000);
  };

  return (
    <section className="flex flex-col md:flex-row gap-4  border p-4 md:p-8 transition-all duration-150 ease-in">
      <div className="flex flex-col  border ">
        {image && (
          <div className="my-4 border-green-400 border">
            <img src={image.data} alt="" className="max-w-full h-auto" />
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-evenly gap-4 p-4 items-center">
          <button
            className="w-full"
            disabled={loading}
            onClick={() => document?.getElementById("img-btn")?.click()}
            style={{
              background: onCamera === 0 ? "blue" : "",
              color: onCamera == 0 ? "white" : "",
            }}
          >
            {" "}
            <input
              id="img-btn"
              type="file"
              disabled={loading}
              className="hidden"
              accept=".jpeg,.jpg, .png, .webp "
              onChange={handleFileUpload}
            />
            <FaCloudUploadAlt size="2rem" />
            {onCamera === 0 ? "Upload another " : "Upload image"}
          </button>
          <button
            className="w-full"
            disabled={loading}
            onClick={() => {
              setOpen(!false);
            }}
            style={{
              background: onCamera == 1 ? "blue" : "",
              color: onCamera == 1 ? "white" : "",
            }}
          >
            <FaCamera size="2rem" />
            {onCamera === 1 ? "Take another one" : "Use Webcam"}
          </button>
        </div>
        <div>
          <GeminiModal
            isOpen={open}
            setOpen={() => {
              setOpen(!true);
            }}
          >
            <div>
              <GeminiWebcam sendImage={handleCameraImage} />
              <button className="hidden" onClick={() => setOpen(false)}>
                close
              </button>
            </div>
          </GeminiModal>
        </div>

        <div className="flex flex-col">
          <label id="prompt" className="my-2">
            Description
          </label>
          <textarea
            rows={3}
            cols={40}
            onChange={(e) => setPrompt(e.target.value)}
            id="prompt"
            className="p-4 rounded-lg text-base outline-none active:outline-none border border-gray-400"
            placeholder="Enter your prompt"
          ></textarea>
        </div>
        <button
          className="w-full  my-4 p-2 rounded-lg outline-none"
          onClick={handleRun}
          disabled={loading || prompt.length === 0}
          style={{ opacity: prompt.length === 0 ? 0.4 : 1 }}
        >
          {loading ? "Processing..." : "Ask"}
        </button>
      </div>

      <div
        className=" border w-full p-4  min-w-[280px] "
        style={{ border: "1px solid red" }}
      >
        <pre className="min-w-[280px]" wrap="hard">
          {response}
        </pre>

        <p className="text-red-400 py-3">{err}</p>

        {loading && <Spinners />}
      </div>
    </section>
  );
}
