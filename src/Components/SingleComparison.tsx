import React from "react";
import { runGemini } from "../helpers/geminiai";

type Image = null | { data: string; mimeType: string };
export default function SingleComparison() {
  const [image, setImage] = React.useState<Image>(null);
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState("");

  const getBase64 = async (file: File) => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        const { result } = reader;

        resolve({ data: result, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    });
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setPrompt("");
      const image = await getBase64(file);
      console.log(image, "pep");
      setImage(image);
    }
    e.target.value = "";
  };

  const handleRun = async () => {
    const payload = {
      inlineData: { ...image, data: image?.data.split(",")[1] },
    };
    setLoading(true);
    setResponse("");
    const response = await runGemini(prompt, [payload]);
    setResponse(response);
    setLoading(false);
  };
  return (
    <section className="flex gap-4  border  w-[800px]">
      <div className="flex flex-col  border">
        {image && (
          <div className="my-4">
            <img src={image.data} alt="" />
          </div>
        )}
        <div>
          <label htmlFor="img">Upload image</label>
          <input
            id="img"
            type="file"
            accept=".jpeg,.jpg, .png, .webp "
            onChange={handleFileUpload}
          />
        </div>

        <div>
          <label id="prompt">Description</label>
          <textarea
            rows={3}
            cols={40}
            onChange={(e) => setPrompt(e.target.value)}
            id="prompt"
            className="p-4"
            placeholder="Enter your prompt"
          ></textarea>
        </div>
        <button
          className="w-full sm:w-80 my-4 p-2 rounded-lg outline-none"
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? "Processing..." : "Ask"}
        </button>
      </div>

      <div className=" border w-full p-4 ">
        <p>{response}</p>
        {loading && <p> A moment....</p>}
      </div>
    </section>
  );
}
