import React, { useEffect } from "react";
import { Logo } from "../assets";
import { Footer } from "../containers";
import { AuthButton, Spinners } from "../components";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
// In the above import, I have imported FaGoogle and FaGithub from react icons and I can send it as a reference props to other components and then I can use it as a component inside that other component. whenever we use anything as a component, we start that with capital letter.

const AuthScreen = () => {
  const { data, isLoading, isError } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && data) {
      navigate("/", { replace: true });
    }
  }, [isLoading, data]);

  if (isLoading) {
    return <Spinners />;
  }

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
          {/* GoogleAuthProvider is a class name provided by Firebase to authenticate using google. Similarly, GitHubAuthProvider is also there */}
          <AuthButton
            Icon={FaGoogle}
            label={"SignIn with Google"}
            provider={"GoogleAuthProvider"}
          />
          <AuthButton
            Icon={FaGithub}
            label={"SignIn with GitHub"}
            provider={"GithubAuthProvider"}
          />
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default AuthScreen;
