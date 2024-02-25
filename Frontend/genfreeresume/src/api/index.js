// This api file is used to get user details. Here we are returning a Promise because this method getUserDetails is used within useQuery hook which returns a Promise. Using onAuthStateChanged method of firebase, we are cheking if the user is already logged in or not. If yes, then we are getting the user credentials in userCred. After getting the userCred, we are checking if the user is already there is the firebase database or not using onSnapshot method and finding the user. If yes, the we are returning that user's data using resolve. If not, then we are saving userCred in database using setDoc and then returning the user's data. For more details on how the doc, setDoc, resolve are working, see the firebase documentation.

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

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
