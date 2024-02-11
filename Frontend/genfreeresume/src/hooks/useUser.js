// This is used to get the state of users. It checks whether a user is authenticated or not. And get the user details if he is authenticated. Inside useQuery, "user" is the name of the state that we want to check and data, isLoading, isError, refetch are the four parameters that useQuery provides by default.

import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getUserDetails } from "../api";

const useUser = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "user",
    async () => {
      try {
        const userDetail = await getUserDetails();
        return userDetail;
      } catch (err) {
        if (!err.message.includes("not authenticated")) {
          toast.err("Something went wrong");
        }
      }
    },
    { refetchOnWindowFocus: false }
  );
  return { data, isLoading, isError, refetch };
};

export default useUser;
