"use client";

import React, { useState } from "react";
import { Orbit } from "@uiball/loaders";
import Scores from "./Scores";

const TFTStats = () => {
  const [clicked, setClicked] = useState(false);
  const [emptyGameName, setEmptyGameName] = useState(false);
  const [gameName, setGameName] = useState("");
  const [averagePlacement, setAveragePlacement] = useState(null);
  const [last20, setLast20] = useState(null);

  const handleGameNameChange = (event) => {
    setGameName(event.target.value);
  };

  const fetchTFTStats = () => {
    setAveragePlacement(null);
    if (gameName.trim() === "") {
      setEmptyGameName(true);
      return;
    }
    else { setEmptyGameName(false); }
    setClicked(true);
    fetch(`/api/riotApiCall?gameName=${gameName}`)
      .then((response) => response.json())
      .then((data) => {
        setAveragePlacement(data.avgPlacement);
        setLast20(data.last_20);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="w-1/2 flex justify-center flex-col">
      <div className="pb-5">
        <h1 className="font-bold text-xl py-5">TFT Stats</h1>
        <input
          className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={gameName}
          onChange={handleGameNameChange}
          placeholder="Enter in game name"
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={fetchTFTStats}>Fetch Stats</button>
      </div>

      <div>
        {
          clicked ? (
            averagePlacement !== null && !isNaN(averagePlacement) ? (
              <>
                <p>Average Placement in Last {last20.length} Games: {averagePlacement.toFixed(2)}</p>
                <Scores last20={last20} />
              </>
            ) : (
              <div>
                <Orbit size={35} color="#231F20" />
              </div>
            )
          ) : null
        }

        {emptyGameName && <p className="text-red-600">Game Name cannot be empty</p>}
      </div>
    </div >
  );
};

export default TFTStats;