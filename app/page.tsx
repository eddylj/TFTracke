import React from "react";
import TFTStats from "../components/TFTStats.js";
import { Metadata } from "next";

require("dotenv").config();

export const metadata: Metadata = {
  title: "TFTracker",
  description: "TFT Tracker",
  icons: {
    icon: "/favicon.ico",
    apple: "apple-touch-icon.png",
  },
};

const Home = () => {
  // if (
  //   localStorage.theme === "dark" ||
  //   (!("theme" in localStorage) &&
  //     window.matchMedia("(prefers-color-scheme: dark)").matches)
  // ) {
  //   document.documentElement.classList.add("dark");
  // } else {
  //   document.documentElement.classList.remove("dark");
  // }

  return (
    <div>
      <div className="flex flex-wrap justify-center py-10 ">
        <TFTStats />
      </div>
    </div>
  );
};

export default Home;
