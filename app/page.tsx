import React from "react";
import TFTStats from "../components/TFTStats.js";
import { Metadata } from "next";
import Head from "next/head.js";

export const metadata: Metadata = {
  title: "TFTracker",
  description: "TFT Tracker",
  icons: {
    icon: "/favicon.ico",
    apple: "apple-touch-icon.png",
  },
};

const Home = () => {
  return (
    <div>
      <div className="flex flex-wrap justify-center py-10 ">
        <TFTStats />
      </div>
    </div>
  );
};

export default Home;
