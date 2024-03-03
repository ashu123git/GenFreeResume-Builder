// Used in the homecontainer. Thips page focuses on how to display all the templates to a logged in user. How to click on a resume and sstart editing it and also how to add/remove a template from collections and how to add/remove templates to favourites.

import React, { useState } from "react";
import { AnimatePresence, delay, easeInOut, motion } from "framer-motion";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import { saveToCollection, saveToFavourites } from "../api";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const TemplateDesign = ({ data, index }) => {
  const { data: user, refetch: userRefetch } = useUser();

  const { refetch: tempRefetch } = useTemplates();

  const [isHovered, setisHovered] = useState(false);

  const navigate = useNavigate();

  const addToCollection = async (e) => {
    e.stopPropagation(); // This is written because this is an icon on the main div where onclick is there. So if we will not stop propagation then this Add to collection icon will work as button in the main div. So after add to propagation, this icon will be worked separately from main div
    await saveToCollection(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    tempRefetch();
  };

  const handleNavigation = () => {
    navigate(`/resumeDetail/${data?._id}`, { replace: true });
  };

  return (
    <motion.div
      key={data?.id}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: index * 0.3, ease: easeInOut }}
    >
      <div
        onMouseEnter={() => setisHovered(true)}
        onMouseLeave={() => setisHovered(false)}
        className="w-full h-[350px] 2xl:h-[600] rounded-md bg-gray-300 overflow-hidden relative"
      >
        <img
          src={data?.imageURL}
          alt=""
          className="w-full h-full object-cover"
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-[rgba(0, 0, 0, 0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
              onClick={handleNavigation}
            >
              <div className="flex flex-col items-end justify-start w-full gap-8">
                <InnerCart
                  label={
                    user?.collections?.includes(data?._id)
                      ? "Added"
                      : "Add to collections"
                  }
                  Icon={
                    user?.collections?.includes(data?._id)
                      ? BiSolidFolderPlus
                      : BiFolderPlus
                  }
                  onHandle={addToCollection}
                />
                <InnerCart
                  label={
                    data?.favourites?.includes(user?.uid)
                      ? "Added to Favourites"
                      : "Add to Faourites"
                  }
                  Icon={
                    data?.favourites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  onHandle={addToFavourites}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerCart = ({ label, Icon, onHandle }) => {
  const [isHovered, setisHovered] = useState(false);

  return (
    <div
      onClick={onHandle}
      className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}
    >
      <Icon className="text-txtPrimary text-base" />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-40 after:w-2 after:h-2 after:bg-gray-300 after:absolute after:-right-1 after:top-[14px] after:rotate-45"
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesign;
