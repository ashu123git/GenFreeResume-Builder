// This jsx file is used to create a new template. Here I have divided screen as follows. For mobile view full 12 grids, for large view 4:8, for extra large view 3:9

// Below import is for implementing the feature of uploading an image of the template to firebase storage.
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { BarLoader } from "react-spinners";
import { db, storage } from "../config/firebase.config";
import { toast } from "react-toastify";
import useUser from "../hooks/useUser";
import { adminIds } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
import { Spinners } from "../components";

const CreateTemplate = () => {
  const { data, isLoading, isError } = useUser();
  const navigate = useNavigate();

  // Below code is to secure CreateTemplate path. Only admins can access this page.
  useEffect(() => {
    if (!isLoading && !adminIds.includes(data?.uid)) {
      navigate("/", { replace: true });
    }
  }, [isLoading, data]);

  const [formData, setformData] = useState({
    title: "",
    imageURL: null,
  });

  // Just like we used useUser hook for getting the states of users. Similarly, useTemplates hook is used to get the state of template.
  const {
    data: templates,
    isError: isTemplateError,
    isLoading: isTemplateLoading,
    refetch: templateRefetch,
  } = useTemplates();

  // Below useState is to update the states of image upload process. If the image is still loading, it will show the spinner else it will show the image. isImageLoading is doing that. uri is for like when the image will be uploaded to firebase, then we will get a download uri from there using which we can show the image on the screen. progress is for showing the bar and the percentage completion of the progress bar
  const [imageAsset, setimageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });

  const handleChange = (e) => {
    // Here name and value below are the name and value attribute in the onChange click which we are passing here as an event. So name = "title"  and value will be whatever we will type there. So, finally setformData  will run and set the [name] that is title to value that is whatever will we type. prevRec is the data that was there when we started typing
    const { name, value } = e.target;
    setformData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  // Used to delete any image from the database and set progress to 0.  All these functions deleteObject are present in firebase documentation
  const deleteImage = async () => {
    setInterval(() => {
      setimageAsset((prevData) => ({ ...prevData, progress: 0, uri: null }));
    }, 2000);
    const deleteImg = ref(storage, imageAsset.uri);
    deleteObject(deleteImg).then(() => {
      toast.success("Image Removed");
    });
  };

  const handleUpload = (e) => {
    // As soon as this function is triggerd, setting isImageLoading to true so as to show the spinner and then getting the file from the event that occured on change.
    setimageAsset((prevData) => ({ ...prevData, isImageLoading: true }));
    const file = e.target.files[0];

    // Asking storage to create a folder called Templates and create a file as given in parameter. Once that is done uploading the image on the firebase.
    const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    //Once image starts uploading, then changing the state of imageAsset use state and updating the progress attribute. All of these functions are clearly mentioned in firebase documentation. So if get confused, check from there..
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setimageAsset((prevData) => ({
          ...prevData,
          progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        }));
      },
      (error) => {
        if (error.message.includes("/storage/unauthorized")) {
          toast.error(`Error : Authorization revoked`);
        } else {
          toast.error(`Error : ${error.message}`);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setimageAsset((prevData) => ({
            ...prevData,
            uri: downloadURL,
          }));
        });

        toast.success("Image Uploaded");
        setInterval(() => {
          setimageAsset((prevData) => ({ ...prevData, isImageLoading: false }));
        }, 2000);
      }
    );
  };

  // Below code is to upload the image, title on the firebase database as soon as user clicks on Submit/Save button
  const uploadOnCloud = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      name:
        templates && templates.length > 0
          ? `Template${templates.length + 1}`
          : "Template1",
      timestamp: timeStamp,
    };

    // Once data will be saved, we are resetting the values to empty. For example, title, imageURL, etc. And then calling templateRefetch to once again load the state and get the latest info.
    await setDoc(doc(db, "templates", id), _doc).then(() => {
      setformData((prevData) => ({ ...prevData, title: "", imageURL: "" }));
      setimageAsset((prevAsset) => ({ ...prevAsset, uri: null }));
      templateRefetch();
    });
  };

  // Below code is for removing the template as well as image as soon as user clicks on the delete icon on the template on the right screen.
  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageURL);
    await deleteObject(deleteRef).then(async () => {
      await deleteDoc(doc(db, "templates", template?._id))
        .then(() => {
          toast.success("Template deleted");
          templateRefetch();
        })
        .catch((err) => {
          toast.error(`Error: ${err.message}`);
        });
    });
  };

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left container */}
      <div className="cols-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        {/* title */}
        <div className="w-full">
          <p className="text-lg text-txtPrimary"> Create a New Template</p>
        </div>

        {/* template ID */}
        <div className="w-full flex items-start justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            Temp ID:{" "}
          </p>
          <p className="text-sm text-txtDark capitalize font-bold">
            {templates && templates.length > 0
              ? `Template${templates.length + 1}`
              : "Template1"}
          </p>
        </div>

        {/* template title section */}
        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleChange}
        />

        {/* uploader section */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <BarLoader color="#00ffff" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className="w-full h-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtLight">Click to upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleUpload}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset?.uri}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      alt=""
                    />

                    {/* delete image functionality */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={deleteImage}
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/* save button */}
        <button
          type="button"
          className="w-full bg-blue-700 text-white rounded-md py-3"
          onClick={uploadOnCloud}
        >
          Save
        </button>
      </div>

      {/* right container */}
      <div className="col-span-2 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
        {isTemplateLoading ? (
          <React.Fragment>
            <div className="w-full h-full flex items-center justify-center">
              <Spinners />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {templates?.map((template) => (
                    <div
                      key={template._id}
                      className="w-full h-[500px] rounded-md overflow-hidden relative"
                    >
                      <img
                        src={template?.imageURL}
                        alt=""
                        className="w-full h-full object-cover"
                      />

                      <div
                        className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={() => removeTemplate(template)}
                      >
                        <FaTrash className="text-sm text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                  <Spinners />
                  <p className="text-xl tracking-wider capitalize text-txtPrimary">
                    No Data
                  </p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
