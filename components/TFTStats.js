"use client";

import React, { useEffect, useRef, useState } from "react";
import { Orbit } from "@uiball/loaders";
import Scores from "./Scores";

const TFTStats = () => {
  const [clicked, setClicked] = useState(false);
  const [emptyGameName, setEmptyGameName] = useState(false);
  const [gameName, setGameName] = useState("");
  const [averagePlacement, setAveragePlacement] = useState(null);
  const [last20, setLast20] = useState(null);
  const [apiError, setApiError] = useState(false);
  let fetchStatsRef = useRef();

  useEffect(() => {
    fetchStatsRef.current.removeAttribute("disabled");
  }, [apiError]);

  const handleGameNameChange = (event) => {
    setGameName(event.target.value);
  };

  const fetchTFTStats = async () => {
    setAveragePlacement(null);
    setApiError(false);
    if (gameName.trim() === "") {
      setEmptyGameName(true);
      return;
    }
    else { setEmptyGameName(false); }
    if (fetchStatsRef.current) fetchStatsRef.current.setAttribute("disabled", "disabled");
    setClicked(true);
    const response = await fetch(`/api/riotApiCall?gameName=${gameName}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.error) setApiError(true);
    else {
      setAveragePlacement(data.avgPlacement);
      setLast20(data.last_20)
      fetchStatsRef.current.removeAttribute("disabled");
    };
  };

  return (
    <div className="w-2/5 flex justify-center flex-col">
      <div className="pb-5">
        <h1 className="font-bold text-xl py-5">TFT Stats</h1>
        <input
          className="shadow appearance-none border rounded w-4/5 py-2 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={gameName}
          onChange={handleGameNameChange}
          placeholder="Enter in game name"
        />
        <button ref={fetchStatsRef} onClick={fetchTFTStats} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Fetch Stats</button>
      </div>

      <div>
        {
          clicked && !emptyGameName && !apiError ? (
            averagePlacement !== null && !isNaN(averagePlacement) ? (
              <>
                <p>Average Placement in Last {last20.length} Games: {averagePlacement.toFixed(2)}</p>
                <Scores last20={last20} />
              </>
            ) : (
              <div className="flex justify-center">
                <Orbit size={35} color="#231F20" />
              </div>
            )
          ) : null
        }

        {emptyGameName && <p className="text-red-600">Game Name cannot be empty</p>}
        {apiError && <p className="text-red-600">Error fetching stats. Please try again later.</p>}
      </div>
    </div >
  );
};

export default TFTStats;