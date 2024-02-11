import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebase.config";

// Below, Icon is having a capital I, because I am using Icon as a component and that is because I have passed icons as a reference in AuthScreen page.
const AuthButton = ({ Icon, label, provider }) => {
  // For using google auth and github auth, we have to create instances/objects for both of them.
  const googleAuth = new GoogleAuthProvider();
  const githubAuth = new GithubAuthProvider();

  const handleClick = async () => {
    switch (provider) {
      case "GoogleAuthProvider":
        await signInWithRedirect(auth, googleAuth)
          .then((answer) => {
            console.log(answer);
          })
          .catch((err) => {
            console.log(`Error ${err.Message}`);
          });
        break;
      case "GithubAuthProvider":
        await signInWithRedirect(auth, githubAuth)
          .then((answer) => {
            console.log(answer);
          })
          .catch((err) => {
            console.log(`Error ${err.Message}`);
          });
        break;
      default:
        console.log("Inside Google Provider");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 hover:shadow-md duration-150"
    >
      <Icon className="text-txtPrimary text-xl group-hover:text-white" />
      <p className="text-txtPrimary text-lg group-hover:text-white">{label}</p>
      <FaChevronRight className="text-txtPrimary text-base group-hover:text-white" />
    </div>
  );
};

export default AuthButton;
