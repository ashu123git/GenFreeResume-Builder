// This is the page that appears when user clicks any of the resumes from the homepage. This will allow a user to get resume details and also to edit the resume.

import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getTemplateDetails, saveToCollection, saveToFavourites } from "../api";
import { Spinners } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";

const ResumeDetails = () => {
  const { templateID } = useParams(); // To get template id from the address url

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: userRefetch } = useUser();

  const {
    data: templates,
    refetch: tempRefetch,
    isLoading: tempIsLoading,
  } = useTemplates();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollection(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    tempRefetch();
    refetch();
  };

  if (isLoading) return <Spinners />;

  if (isError) {
    return (
      <div className="w-full h-[60vh] flec flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          {" "}
          Error fetching the data..Please try again later
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-start flex-col px-4 py-12">
      {/* breadcrumb */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* main section layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* leftsection */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          {/* load the template image */}
          <img
            className="w-full h-auto object-contain rounded-md"
            src={data?.imageURL}
            alt=""
          />

          {/* title and other options */}
          <div className="w-full flex flex-col items-start justify-start gap-2">
            {/* title section */}
            <div className="w-full flex items-start justify-between">
              {/* title */}
              <p className="text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>

              {/* likes */}
              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-base text-red-500" />
                  <p className="text-base text-txtPrimary font-semibold">
                    {data?.favourites?.length} Likes
                  </p>
                </div>
              )}
            </div>

            {/* collections and favoutites */}
            {user && (
              <div className="flex items-center justify-center gap-3">
                {user?.collections?.includes(data?._id) ? (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-500 gap-2 hover: bg-gray-300 cursor-pointer"
                    >
                      <BiSolidFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove From Collections
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-500 gap-2 hover: bg-gray-300 cursor-pointer"
                    >
                      <BiFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add to Collections
                      </p>
                    </div>
                  </React.Fragment>
                )}

                {data?.favourites?.includes(user?.uid) ? (
                  <React.Fragment>
                    <div
                      onClick={addToFavourites}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-500 gap-2 hover: bg-gray-300 cursor-pointer"
                    >
                      <BiSolidHeart className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove From Favourites
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToFavourites}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-500 gap-2 hover: bg-gray-300 cursor-pointer"
                    >
                      <BiHeart className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add to Favourites
                      </p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        {/* right section */}
        <div className="col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start px-3 gap-6">
          {/* discover more */}
          <div
            className="w-full h-72 bg-blue-400 rounded-md overflow-hidden relative"
            style={{
              background:
                "url(https://cdn.pixabay.com/photo/2020/09/19/19/37/landscape-5585247_1280.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-4 py-2 rounded-md border-2 border-gray-100 text-white"
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* edit the template */}
          {user && (
            <Link
              to={`/resume/${data?.name}?templateID=${templateID}`}
              className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-600 cursor-pointer"
            >
              <p className="text-white font-semibold text-lg">
                Edit this Template
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
