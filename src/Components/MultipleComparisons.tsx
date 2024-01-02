import React, { useState } from "react";
import { runGemini } from "../helpers/geminiai";
type MyFile = null | { data: string; mimeType: string };

export default function MultipleComparisons() {
  const [img1, setImage] = useState<MyFile>(null);
  const [img2, setImage2] = useState<MyFile>(null);
  const [response, setResponse] = useState("");
  const base64ext = "data:image/png;base64,";
  const [loading, setLoading] = useState(false);

  const getBase64 = (file: File, setState = (f: any) => f) => {
    const reader = new FileReader();
    reader.onload = () => {
      const { result } = reader;
      console.log(result);
      setState({ data: result?.split(",")[1], mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleComparison = async () => {
    const imageParts = [{ inlineData: img1 }, { inlineData: img2 }];
    setLoading(true);
    const response = await runGemini("do these images look same?", imageParts);
    setResponse(response);
    setLoading(false);
  };
  return (
    <section className="transition-all duration-150 ease-in">
      <div className="p-4">
        <h3>Enter 2 images to compare</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <label htmlFor="img1">
            Upload an image{" "}
            <input
              type="file"
              id="img1"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = (e.target as HTMLInputElement)?.files?.[0];

                if (file) getBase64(file, setImage);
              }}
            />
          </label>
          {img1 && (
            <div className="my-4 p-4">
              <img alt="" src={base64ext + img1.data} />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="img2" className="inline-block">
            Upload an image
            <input
              type="file"
              id="img2"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = (e.target as HTMLInputElement)?.files?.[0];

                if (file) getBase64(file, setImage2);
              }}
            />
          </label>
          {img2 && (
            <div className="my-4 p-4">
              <img alt="" src={base64ext + img2.data} />
            </div>
          )}
        </div>
      </div>
      <div>
        <button
          className="w-full md:w-80 p-2 my-4 rounded-lg outline-none"
          disabled={loading}
          onClick={handleComparison}
        >
          {loading ? "Comparing.." : "Compare"}
        </button>
        <p>{response}</p>
      </div>
    </section>
  );
}
