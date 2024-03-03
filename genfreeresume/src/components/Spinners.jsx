// Puffloader is a type of spinner that is included in "react-spinner" library

import React from "react";
import { PacmanLoader } from "react-spinners";

const Spinners = () => {
  return (
    <div className=" w-screen h-screen flex items-center justify-center">
      <PacmanLoader color="#00008b" size={80} />
    </div>
  );
};

export default Spinners;
