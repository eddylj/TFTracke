import React from "react";
import TFTStats from "../components/TFTStats.js";
import { Metadata } from "next";
import { ModeToggle } from "@/components/ModeToggle";

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
  return (
    <div>
      <div className="flex flex-wrap justify-center py-10">
        <TFTStats />
        <ModeToggle />
      </div>
    </div>
  );
};

export default Home;
