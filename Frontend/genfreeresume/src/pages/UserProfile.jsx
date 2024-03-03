import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import { Spinners, TemplateDesign } from "../components";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";

const UserProfile = () => {
  const { data: user } = useUser();
  const [activeTab, setactiveTab] = useState("collections");
  const navigate = useNavigate();
  const {
    data: templates,
    isLoading: tempIsLoading,
    isError: tempIsError,
  } = useTemplates();
  const { data: savedResumes } = useQuery(["savedResumes"], () =>
    getSavedResumes(user?.uid)
  );

  if (tempIsLoading) {
    return <Spinners />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full h-72 bg-blue-200">
        <img
          src="https://cdn.pixabay.com/photo/2024/02/27/09/20/spring-8599753_640.jpg"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="flex items-center justify-center flex-col gap-4">
          {user?.photoURL ? (
            <React.Fragment>
              <img
                src={user?.photoURL}
                className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <img
                src="https://img.freepik.com/premium-photo/small-boy-colorful-background-funny-cartoon-character-school-kid-3d-generative-ai_58409-28862.jpg?w=740"
                className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </React.Fragment>
          )}

          <p className="text-2xl text-txtDark">{user?.displayName}</p>
        </div>

        {/* tabs */}
        <div className="flex items-center justify-center mt-12">
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setactiveTab("collections")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-700 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-700"
              }`}
            >
              Collections
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setactiveTab("resumes")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-700 px-4 py-1 rounded-full ${
                activeTab === "resumes" && "bg-white shadow-md text-blue-700"
              }`}
            >
              My Resumes
            </p>
          </div>
        </div>

        {/* tab content */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collections.length > 0 && user?.collections ? (
                  <RenderATemplate
                    templates={templates?.filter((temp) =>
                      user?.collections?.includes(temp?._id)
                    )}
                  />
                ) : (
                  <div></div>
                )}
              </React.Fragment>
            )}

            {/* {activeTab === "resumes" && (
              <React.Fragment>
                {savedResumes.length > 0 && savedResumes ? (
                  <RenderATemplate templates={savedResumes} />
                ) : (
                  <div></div>
                )}
              </React.Fragment>
            )} */}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesign
                  key={template?.id}
                  data={template}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
