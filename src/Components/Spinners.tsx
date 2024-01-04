import React from "react";
//import ClipLoader from "react-spinners/ClipLoader";
import { ScaleLoader, PulseLoader as ClipLoader } from "react-spinners";
//BarLoader
//BeatLoader
//FadeLoader
//GridLoader
//CircleLoader
//HashLoader //great
//PacmanLoader
//PropagateLoader;
//PuffLoader
//PulseLoader //great
//RingLoader;
//RiseLoader
//ScaleLoader //good

export default function Spinners({ single = false }) {
  if (single)
    return (
      <div className="flex flex-col items-center justify-center p-2">
        <ScaleLoader
          loading={true}
          // width={20}
          color="blue"
          // cssOverride={{ width: "100%", textAlign: "center".fo }}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p>Processing...</p>
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <ClipLoader
        loading={true}
        color="blue"
        //cssOverride={override}

        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <p>Processing...</p>
    </div>
  );
}
