import React from "react";
import Webcam from "react-webcam";
import { FaPlay } from "react-icons/fa";
export default function GeminiWebcam({ sendImage = (f) => f }) {
  const [src, setSrc] = React.useState("");
  const cam = React.useRef(null);
  const constraints = { facingMode: "user" };
  React.useEffect(() => {}, []);
  const getImage = React.useCallback(() => {
    const img = cam?.current?.getScreenshot();

    new Audio("/camera-shutter-click-01.mp3").play();
    setSrc(img);
    sendImage(img);
  }, [cam]);
  return (
    <div>
      <div className="flex justify-end">
        <span>X</span>
      </div>
      <Webcam
        ref={cam}
        audio={false}
        height={400}
        width={400}
        //mirrored
        videoConstraints={constraints}
      />
      <button className="my-2 w-full" onClick={getImage}>
        <FaPlay size="1.25rem" className="inline-block mr-2" /> Take Image...
      </button>
      {src && <small>We have an image</small>}
    </div>
  );
}
