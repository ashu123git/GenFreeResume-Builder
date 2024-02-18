import React, { Suspense } from "react";
import { Header, Spinners } from "../components";
import { Route, Routes } from "react-router-dom";
import { HomeContainer } from "../containers";
import { CreateTemplate, UserProfile } from "../pages";

const HomeScreen = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* header section */}
      <Header />
      {/* body section */}
      <main className="w-full">
        <Suspense fallback={<Spinners />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default HomeScreen;
