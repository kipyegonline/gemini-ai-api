import React from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";

export default function GeminiWebcam({
  sendImage = (_f: string) => {},
}: {
  sendImage?: (f: string) => void;
}) {
  const cam = React.useRef(null);
  const [captured, setCaptured] = React.useState(false);

  const getImage = React.useCallback(() => {
    if (cam?.current) {
      const img = (cam.current as any).getScreenshot();
      new Audio("/camera-shutter-click-01.mp3").play().catch(() => {});
      setCaptured(true);
      sendImage(img);
      setTimeout(() => setCaptured(false), 1200);
    }
  }, [cam, sendImage]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-lg overflow-hidden border border-[#27272a]">
        <Webcam
          ref={cam}
          audio={false}
          height={360}
          width={360}
          videoConstraints={{ facingMode: "user" }}
          className="block"
        />
      </div>
      <button
        className={`btn-primary w-full ${captured ? "!bg-success" : ""}`}
        onClick={getImage}
      >
        <FaCamera />
        {captured ? "Captured!" : "Take Photo"}
      </button>
    </div>
  );
}
