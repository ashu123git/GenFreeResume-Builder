// Here Suspense is used because if there is any issue in the routing paths i.e,. the child components then want our app to fallback to a state where it shows Loading... Suspense is provided by React OOB

import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  HomeScreen,
  AuthScreen,
  UserProfile,
  CreateResume,
  ResumeDetails,
} from "../pages";

//Below two imports are import from react-query to manage and maintain the state throughout the app.
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { CreateTemplate } from "../pages";

const App = () => {
  const clientProvider = new QueryClient();

  return (
    <QueryClientProvider client={clientProvider}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/template/create" element={<CreateTemplate />} />
          <Route path="/profile/:uid" element={<UserProfile />} />
          <Route path="/resume/*" element={<CreateResume />} />
          <Route path="/resumeDetail/:templateID" element={<ResumeDetails />} />
        </Routes>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
