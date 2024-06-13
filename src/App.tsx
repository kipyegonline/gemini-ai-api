import { useEffect, useState } from "react";

import { FaRegImages } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import "./App.css";
import SingleComparison from "./Components/SingleComparison";
import MultipleComparisons from "./Components/MultipleComparisons";

function App() {
  const [single, setSingle] = useState(true);
  const [isDark, setDark] = useState(!true);
  useEffect(() => {
    // document.body.setAttribute("data-mode", "dark");
    //const isDark = document.querySelector("[data-mode='dark']");
    //setDark(!!isDark);
    document.addEventListener("visibilitychange", handleVisibilty);
  }, []);

  const handleModes = () => {
    const isDark = document.querySelector("[data-mode='dark']");
    return isDark;
  };
  const handleDark = (mode: boolean) => {
    setDark(mode);
    if (mode) document.body.setAttribute("data-mode", "dark");
    else document.body.removeAttribute("data-mode");
  };
  handleModes();
  const handleVisibilty = () => {
    if (document.hidden) {
      document.body.setAttribute("data-mode", "dark");
    } else {
      document.body.removeAttribute("data-mode");
    }
  };
  return (
    <main className=" mb-12 w-full p-2 md:p-4 md:px-20 ">
      <div className="absolute left-0 ml-4 hidden">
        <img
          src="/public/android-chrome-512x512.png"
          className="w-20 rounded-lg h-auto"
          alt=""
        />
      </div>
      <div className="absolute right-0 mr-0 md:mr-4 z-30  cursor-pointer p-2">
        {isDark ? (
          <FiSun onClick={() => handleDark(!true)} className="text-2xl" />
        ) : (
          <FaMoon onClick={() => handleDark(true)} className="text-2xl" />
        )}
      </div>
      <div className="pb-4">
        <h1 className="text-balance">Image Reader AI</h1>
        <p className="py-1">Convert Image to text, get insights using AI</p>
      </div>

      <section className="flex w-full justify-evenly flex-col md:flex-row gap-4 p2 sm:p-4  ">
        <button
          style={{
            background: single ? "blue" : "#ccc",
            color: single ? "white" : handleModes() ? "black" : "",
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
            color: !single ? "white" : handleModes() ? "black" : "",
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
      <footer className="fixed left-0 bottom-0 right-0 flex flex-col  justify-center py-4 bg-blue-600 text-white text-lg">
        <p>All Rights Reserved &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

export default App;
