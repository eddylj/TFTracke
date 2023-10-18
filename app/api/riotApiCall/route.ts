import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

export const runtime = "edge"; // 'nodejs' is the default

export async function GET(req: NextRequest) {
  try {
    const api_key = "RGAPI-b4420c8f-260a-4e92-be31-10be3e85d071";
    const game_name = req.nextUrl.searchParams.get("gameName");
    console.log(game_name);

    if (!game_name || game_name.trim() === "") {
      return NextResponse.json(
        { error: "Invalid gameName parameter" },
        { status: 400 }
      );
    }

    const tag_line = "OCE";

    // Get account info
    const account_url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${game_name}/${tag_line}`;
    const account_resp = await fetch(account_url, {
      method: "GET",
      headers: { "X-Riot-Token": api_key },
    });
    const account_data = await account_resp.json();
    if (account_data.error) {
      console.log("error");
    }

    const { puuid } = account_data;

    // Get the last 20 TFT match IDs
    const tft_url = `https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=20`;
    const tft_match_resp = await fetch(tft_url, {
      method: "GET",
      headers: { "X-Riot-Token": api_key },
    });
    const tft_match_data = await tft_match_resp.json();
    if (tft_match_data.error) {
      console.log("error");
    }

    const matches = tft_match_data;
    const match_url = "https://sea.api.riotgames.com/tft/match/v1/matches";

    const last_20 = [];

    for (const match of matches) {
      const match_resp = await fetch(`${match_url}/${match}`, {
        method: "GET",
        headers: { "X-Riot-Token": api_key },
      });

      const match_data = await match_resp.json();
      if (match_data.error) console.log("error");
      for (const player of match_data.info.participants) {
        if (player.puuid === puuid) {
          console.log("pushed");
          last_20.push(player.placement);
        }
      }
    }

    const avgPlacement =
      last_20.length > 0 ? last_20.reduce((a, b) => a + b) / last_20.length : 0;

    return NextResponse.json({ avgPlacement, last_20 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
