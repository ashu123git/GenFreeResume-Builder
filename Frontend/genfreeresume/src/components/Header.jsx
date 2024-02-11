import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { FaArrowRightFromBracket, FaCross, FaXmark } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { PacmanLoader } from "react-spinners";
import { SlideUpDown } from "../animations";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";

const Header = () => {
  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false);
  const queryClient = useQueryClient();

  const signOut = async()=> {
    await auth.signOut().then(()=>{
      queryClient.setQueryData("user", null);
    })
  }

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-400 bg-bgPrimary z-50 gap-12 sticky top-0">
      {/* logo */}
      <Link to={"/"}>
        <img src={Logo} className="w-12 h-auto object-contain" alt="" />
      </Link>
      {/* input */}
      <div className="flex-1 border border-gray-400 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
        <input
          type="text"
          placeholder="Search Here..."
          className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
        />
        <FaXmark />
      </div>
      {/* profile */}
      <AnimatePresence>
        {isLoading ? (
          <PacmanLoader color="#00008b" size={20} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div onClick={() => setIsMenu(!isMenu)}>
                {data?.photoURL ? (
                  <div className="w-12 h-12 rounded-full relative flex items-center justify-center cursor-pointer">
                    <img
                      src={data?.photoURL}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                    <p className="text-xl text-white">
                      {data?.email[0].toUpperCase()}
                    </p>
                  </div>
                )}

                {/* dropdwn */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      onMouseLeave={() => setIsMenu(false)}
                      {...SlideUpDown}
                      className="absolute px-4 py-3 rounded-md bg-white right-2 top-16 flex flex-col items-center justify-start gap-3 w-64 pt-12"
                    >
                      {data?.photoURL ? (
                        <div className="w-20 h-20 rounded-full relative flex items-center justify-center cursor-pointer">
                          <img
                            src={data?.photoURL}
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                            alt=""
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                          <p className="text-xl text-white">
                            {data?.email[0].toUpperCase()}
                          </p>
                        </div>
                      )}
                      {data?.displayName && (
                        <p className="text-lg text-txtDark">
                          {data?.displayName}
                        </p>
                      )}

                      {/* menu */}
                      <div className="w-full flex flex-col items-start gap-8 pt-6 cursor-pointer">
                        <Link
                          className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                          to={"/profile"}
                        >
                          My Account
                        </Link>
                        <Link
                          className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                          to={"/template/create"}
                        >
                          Add New Template
                        </Link>
                        <div className="w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer">
                          <p className="text-txtLight group-hover:text-txtDark" onClick={signOut}>
                            SignOut
                          </p>
                          <FaArrowRightFromBracket className="text-txtLight group-hover:text-txtDark" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button className="px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150" type="button">Login</motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
