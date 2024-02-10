import React from "react";
import { Logo } from "../assets";
import { Footer } from "../containers";
import { AuthButton } from "../components";

const AuthScreen = () => {
  return (
    <div className="auth-section">
      {/* {Top section} */}
      <img src={Logo} className="w-12 h-auto object-contain" alt="" />

      {/*main section */}
      <div className="w-full flex flex-1 flex-col items-center justify-start gap-6">
        <h1 className="text-3xl lg:text-4xl text-yellow-700">
          Welcome to GenFreeResume
        </h1>
        <p className="text-base text-gray-600">
          Create and Download Free Resumes
        </p>
        <h2 className="text-2xl text-gray-600"> Authenticate</h2>
        <div className="w-full lg:w-96 rounded-md p-2 flex flex-col items-center justify-center gap-6">
          <AuthButton />
          <AuthButton />
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default AuthScreen;
