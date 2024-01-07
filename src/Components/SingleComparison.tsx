import React from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

//import Spinner from "react-spinners"
import { runGemini } from "../helpers/geminiai";
import GeminiModal from "./Modal";
import GeminiWebcam from "./Webcam";
import Spinners from "./Spinners";

import CopyToClipboardComponent from "./Copy.component";
import { defaultPayload } from "../helpers/defaults";

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
  const defaultRef = React.useRef<null | "1" | "2">(null);

  React.useEffect(() => {
    if (response)
      document
        .getElementById("response")
        ?.scrollIntoView({ behavior: "smooth" });
  }, [response]);
  React.useEffect(() => {
    console.log(defaultRef.current, "__defrefence");
    if (defaultRef.current === "1") createDefaultView();
    defaultRef.current = "1";
  }, []);
  React.useEffect(() => {
    if (typeof start === "number") {
      console.log({ image, prompt }, "ffect");
      handleRun();
    }
  }, [start]);

  const createDefaultView = () => {
    const defaultKey = "default-view";
    const [a, b] = defaultPayload;
    const defaultView = localStorage.getItem(defaultKey);

    if (defaultView === null) {
      setImage(a.img);
      setPrompt(a.prompt);

      localStorage.setItem(defaultKey, "1");

      setStart(1);
    } else {
      if (defaultView === "1") {
        setImage(b.img);
        setPrompt(b.prompt);
        localStorage.setItem(defaultKey, "2");
        setStart(2);
      } else {
        setStart(null);
      }
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
    if (file) {
      setPrompt("");

      const image: Image = await getBase64(file);

      setImage(image);
    }
    e.target.value = "";
  };

  const handleRun = async () => {
    console.log(image, prompt, "at this point");
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
      let err = response?.message.split(":");
      err = `Something went wrong: ${err[err.length - 1] ?? ""}`;
      setError(err);
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
      <input type="file" className="hidden" id="default-img" />

      <div className="flex flex-col  border ">
        {image && (
          <div className="my-4 border-green-400 border max-h-[400px]">
            <img
              src={image.data}
              alt=""
              className="max-w-full object-covers h-auto"
            />
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
            <FaCloudUploadAlt size="1.5rem" className="inline-block mr-2" />
            {onCamera === 0 ? "Upload another " : "Upload "}
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
            <FaCamera size="1.5rem" className="inline-block mr-2" />
            {onCamera === 1 ? "Take another one" : "Webcam"}
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
            value={prompt}
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
          {loading ? "Processing..." : "Ask"}{" "}
          <IoSend className="inline-block ml-4" />
        </button>
      </div>

      <div
        className=" border w-full p-4  min-w-[280px] "
        style={{ border: "1px solid red" }}
        id="response"
      >
        {response && <CopyToClipboardComponent response={response} />}
        <pre className="min-w-[280px]" wrap="hard">
          {response}
        </pre>

        {!response && start === null && (
          <div className="flexi flex-col hidden justify-center items-center h-[200px]">
            <h3 className="p-4 text-xl font-medium">
              Add an image and prompt message to get started
            </h3>
          </div>
        )}
        {loading && <Spinners single />}
        <p className="text-red-400 py-3">{err}</p>
      </div>
    </section>
  );
}
