// Here Suspense is used because if there is any issue in the routing paths i.e,. the child components then want our app to fallback to a state where it shows Loading... Suspense is provided by React OOB

import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { HomeScreen, AuthScreen } from "../pages";

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
      </Routes>
    </Suspense>
  );
};

export default App;
