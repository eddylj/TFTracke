import axios from "axios";

const tftStats = async (req, res) => {
  console.log("meow");
  try {
    const api_key = "RGAPI-6507812a-88e1-4e5f-a56e-7fb1a10ead83";
    const game_name = req.query.gameName;
    console.log(game_name);

    if (!game_name || game_name.trim() === "") {
      return res.status(400).json({ error: "Invalid gameName parameter" });
    }

    const tag_line = "OCE";

    // Get account info
    const account_url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${game_name}/${tag_line}`;
    const account_resp = await axios.get(account_url, { headers: { "X-Riot-Token": api_key } });
    const { puuid } = account_resp.data;

    // Get the last 20 TFT match IDs
    const tft_url = `https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=20`;
    const tft_resp = await axios.get(tft_url, { headers: { "X-Riot-Token": api_key } });
    const matches = tft_resp.data;

    const match_url = "https://sea.api.riotgames.com/tft/match/v1/matches";

    const last_20 = [];

    for (const match of matches) {
      const match_resp = await axios.get(`${match_url}/${match}`, { headers: { "X-Riot-Token": api_key } });
      for (const player of match_resp.data.info.participants) {
        if (player.puuid === puuid) {
          console.log("pushed");
          last_20.push(player.placement);
        }
      }
    }

    const avgPlacement = last_20.length > 0 ? last_20.reduce((a, b) => a + b) / last_20.length : 0;

    res.status(200).json({ avgPlacement, last_20 });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default tftStats;