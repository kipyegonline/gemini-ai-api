import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SingleComparison from "./Components/SingleComparison";
import MultipleComparisons from "./Components/MultipleComparisons";

function App() {
  const [single, setSingle] = useState(true);

  return (
    <main className=" border-green  w-full p-4 md:px-20">
      <div className="pb-4">
        <h1>Google Gemini AI</h1>
      </div>

      <section className="flex w-full justify-evenly flex-col md:flex-row gap-4 p-4 border-red-400 border">
        <button
          style={{
            background: single ? "blue" : "#ccc",
            color: single ? "white" : "",
            border: !single ? "1px solid blue" : "none",
          }}
          className="w-full transition-all duration-250 ease-in"
          onClick={() => !single && setSingle(true)}
        >
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
          Compare images
        </button>
      </section>
      {single && <SingleComparison />}
      {!single && <MultipleComparisons />}
      <hr />
      <footer className="flex justify-center py-4 bg-purple-600">
        <p>All Rights Reserved &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

export default App;
