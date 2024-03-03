// This api file is used to get user details. Here we are returning a Promise because this method getUserDetails is used within useQuery hook which returns a Promise. Using onAuthStateChanged method of firebase, we are cheking if the user is already logged in or not. If yes, then we are getting the user credentials in userCred. After getting the userCred, we are checking if the user is already there is the firebase database or not using onSnapshot method and finding the user. If yes, the we are returning that user's data using resolve. If not, then we are saving userCred in database using setDoc and then returning the user's data. For more details on how the doc, setDoc, resolve are working, see the firebase documentation.

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

export const getUserDetails = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];
        const unsubscribe = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );

        return unsubscribe;
      } else {
        reject(new Error("User is not authenticated"));
      }

      // to prevent memory leak
      unsubscribe();
    });
  });
};

// This function is used to get the template details and then state of the templates will be maintained by useQuery hook. Listener will constantly check for the changes and update the state.
export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timestamp", "asc")
    );

    const listener = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });

    return listener;
  });
};

// Below code is saving a template or removing a template from current user's profile. Here user is the user's data and data is the templates data in the argument.
export const saveToCollection = async (user, data) => {
  if (!user?.collections?.includes(data?._id)) {
    const docRef = doc(db, "users", user?.uid);

    await updateDoc(docRef, {
      collections: arrayUnion(data?._id),
    })
      .then(() => toast.success("Saved to collection"))
      .catch((err) => toast.error(`Error: ${err.message}`));
  } else {
    const docRef = doc(db, "users", user?.uid);

    await updateDoc(docRef, {
      collections: arrayRemove(data?._id),
    })
      .then(() => toast.success("Removed from collection"))
      .catch((err) => toast.error(`Error: ${err.message}`));
  }
};

// Below code is saving a template or removing a template to favourites from current user's profile. Here user is the user's data and data is the templates data in the argument.
export const saveToFavourites = async (user, data) => {
  if (!data?.favourites?.includes(user?.uid)) {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, {
      favourites: arrayUnion(user?.uid),
    })
      .then(() => toast.success("Saved to favourites"))
      .catch((err) => toast.error(`Error: ${err.message}`));
  } else {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, {
      favourites: arrayRemove(user?.uid),
    })
      .then(() => toast.success("Removed from favourites"))
      .catch((err) => toast.error(`Error: ${err.message}`));
  }
};

// Here we are fetching the details of a template.
export const getTemplateDetails = async (templateID) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(doc(db, "templates", templateID), (doc) => {
      resolve(doc.data());
    });
    return unsubscribe;
  });
};

export const getSavedResumes = (uid) => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "users", uid, "resumes"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });

    return unsubscribe;
  });
};
