import React, { useState } from "react";
import { runGemini } from "../helpers/geminiai";
type MyFile = null | { data: string; mimeType: string };

export default function MultipleComparisons() {
  const [img1, setImage] = useState<MyFile>(null);
  const [img2, setImage2] = useState<MyFile>(null);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");

  const base64ext = "data:image/png;base64,";
  const [loading, setLoading] = useState(false);

  const getBase64 = (file: File, setState = (f: any) => f) => {
    const reader = new FileReader();
    reader.onload = () => {
      const { result } = reader;

      setState({ data: result?.split(",")[1], mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleComparison = async () => {
    if (!prompt || !img1 || !img2) {
      setError("Add image and image an prompt message");
      setTimeout(() => setError(""), 2000);
      return;
    }
    const imageParts = [{ inlineData: img1 }, { inlineData: img2 }];
    setLoading(true);
    setResponse("");
    const response = await runGemini(prompt, imageParts);
    // check if there was an error processing image
    if (response?.error) {
      setError(response.message);
    } else {
      setResponse(response);
    }

    setLoading(false);
  };
  const isMobile = matchMedia("(max-width:480px)").matches;
  return (
    <section className="transition-all duration-150 ease-in">
      <div className="p-4">
        <h2>Enter 2 images to compare</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <button
            onClick={() => document.getElementById("img1")?.click()}
            className="w-full"
          >
            {" "}
            <input
              type="file"
              id="img1"
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = (e.target as HTMLInputElement)?.files?.[0];

                if (file) getBase64(file, setImage);
              }}
            />
            {img1 ? "Upload another image" : "Upload image 1"}
          </button>

          {img1 && (
            <div className="my-4 p-4 max-w-[500px] h-auto ">
              <img alt="" className="mx-w-full" src={base64ext + img1.data} />
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => document.getElementById("img2")?.click()}
            className="w-full"
          >
            {img2 ? "Upload another image" : "Upload image 2"}
            <input
              type="file"
              className="hidden"
              id="img2"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = (e.target as HTMLInputElement)?.files?.[0];

                if (file) getBase64(file, setImage2);
              }}
            />
          </button>
          {img2 && (
            <div className="my-4 p-4 max-w-[500px] h-auto ">
              <img alt="" className="mx-w-full" src={base64ext + img2.data} />
            </div>
          )}
        </div>
      </div>
      <div className="p-2 md:p-4 flex flex-col md:flex-row gap-4 justify-evenly mt-4 ">
        <div>
          {" "}
          <div>
            {" "}
            <p className="mb-2 py-2">Enter prompt Message</p>
            <textarea
              placeholder="Explain the difference between these images "
              cols={40}
              rows={3}
              onChange={(e) => setPrompt(e.target.value)}
              className="outline-none w-full rounded-lg p-4 border border-gray-300 "
            ></textarea>
          </div>
          <button
            className="w-full  p-2 my-4 rounded-lg outline-none"
            disabled={loading}
            onClick={handleComparison}
          >
            {loading ? "Comparing.." : "Compare"}
          </button>
        </div>

        <div className="p-4  min-w-[380px]">
          {" "}
          {loading && <p>Processing.... a moment</p>}
          <p>{response}</p>
          {error && <p className="p-2 text-red-500 my-2">{error}</p>}
        </div>
      </div>
    </section>
  );
}
