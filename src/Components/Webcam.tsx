import React from "react";
import Webcam from "react-webcam";

export default function GeminiWebcam({ sendImage = (f) => f }) {
  const [src, setSrc] = React.useState("");
  const cam = React.useRef(null);
  const constraints = { facingMode: "user" };
  React.useEffect(() => {}, []);
  const getImage = React.useCallback(() => {
    const img = cam?.current?.getScreenshot();
    console.log(img, "img");
    new Audio("/shuttersound.mp3").play();
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
        Take Image...
      </button>
      {src && <small>We have an image</small>}
    </div>
  );
}
