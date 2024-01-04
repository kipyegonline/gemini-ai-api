import React from "react";
//import ClipLoader from "react-spinners/ClipLoader";
import { PulseLoader as ClipLoader } from "react-spinners";
//BarLoader
//BeatLoader
//FadeLoader
//GridLoader
//CircleLoader
//HashLoader
//PacmanLoader
//PropagateLoader;
//PuffLoader
//PulseLoader
//RingLoader;
//RiseLoader
//ScaleLoader //good

export default function Spinners() {
  return (
    <div>
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
