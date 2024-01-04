import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { FaRegImages } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import "./App.css";
import SingleComparison from "./Components/SingleComparison";
import MultipleComparisons from "./Components/MultipleComparisons";

function App() {
  const [single, setSingle] = useState(true);

  return (
    <main className=" border-green   w-full p-4 md:px-20">
      <div className="pb-4">
        <h1>Image Reader</h1>
        <p className="py-1">Image to text reader</p>
      </div>

      <section className="flex w-full justify-evenly flex-col md:flex-row gap-4 p2 sm:p-4  border-red-400 border">
        <button
          style={{
            background: single ? "blue" : "#ccc",
            color: single ? "white" : "",
            border: !single ? "1px solid blue" : "none",
          }}
          className="w-full transition-all duration-250 ease-in"
          onClick={() => !single && setSingle(true)}
        >
          <FaImage size="1.5rem" className="inline-block mr-2" />
          Single Image
        </button>
        <button
          style={{
            background: !single ? "blue" : "#ccc",
            color: !single ? "white" : "",
            border: single ? "1px solid blue" : "none",
          }}
          className="w-full transition-all duration-250 ease-in"
          onClick={() => single && setSingle(!true)}
        >
          <FaRegImages size="1.5rem" className="inline-block mr-2" />
          Compare images
        </button>
      </section>
      {single && <SingleComparison />}
      {!single && <MultipleComparisons />}
      <hr />
      <footer className="fixed left-0 bottom-0 right-0 flex justify-center py-4 bg-blue-600 text-white text-lg">
        <p>All Rights Reserved &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

export default App;
