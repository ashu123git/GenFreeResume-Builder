// This jsx file is used to create a new template. Here I have divided screen as follows. For mobile view full 12 grids, for large view 4:8, for extra large view 3:9

// Below import is for implementing the feature of uploading an image of the template to firebase storage.
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { BarLoader } from "react-spinners";
import { storage } from "../config/firebase.config";
import { toast } from "react-toastify";

const CreateTemplate = () => {
  const [formData, setformData] = useState({
    title: "",
    imageURL: null,
  });

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
          <p className="text-sm text-txtDark capitalize font-bold">Template1</p>
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
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      </div>

      {/* right container */}
      <div className>2</div>
    </div>
  );
};

export default CreateTemplate;
