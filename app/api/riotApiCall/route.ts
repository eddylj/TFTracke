import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "edge"; // 'nodejs' is the default

class TFTrackerError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
  }
}

class GameInputError extends TFTrackerError {
  constructor() {
    super("Invalid game name or tag parameter", 400);
    this.name = "GameInputError";
  }
}

class RiotApiError extends TFTrackerError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = "RiotApiError";
  }
}

export async function GET(req: NextRequest) {
  try {
    const api_key = process.env.RIOT_API_KEY;
    if (!api_key) {
      throw new Error("No API key found");
    }
    const game_name = req.nextUrl.searchParams.get("gameName");
    const game_tag = req.nextUrl.searchParams.get("gameTag");
    console.log(game_tag);

    if (
      !game_name ||
      game_name.trim() === "" ||
      !game_tag ||
      game_tag.trim() === ""
    ) {
      throw new GameInputError();
    }

    // Get account info
    const account_url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${game_name}/${game_tag}`;
    const account_resp = await fetch(account_url, {
      method: "GET",
      headers: { "X-Riot-Token": api_key },
    });

    const account_data = await account_resp.json();
    if (!account_resp.ok)
      throw new RiotApiError(account_data.status.message, account_resp.status);

    const { puuid } = account_data;

    // Get the last 20 TFT match IDs
    const tft_url = `https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=20`;
    const tft_match_resp = await fetch(tft_url, {
      method: "GET",
      headers: { "X-Riot-Token": api_key },
    });
    const tft_match_data = await tft_match_resp.json();
    if (!tft_match_resp.ok)
      throw new RiotApiError(account_data.status.message, account_resp.status);

    const matches = tft_match_data;
    const match_url = "https://sea.api.riotgames.com/tft/match/v1/matches";

    const last_20 = [];

    for (const match of matches) {
      const match_resp = await fetch(`${match_url}/${match}`, {
        method: "GET",
        headers: { "X-Riot-Token": api_key },
      });

      const match_data = await match_resp.json();
      if (!match_resp.ok)
        throw new RiotApiError(
          account_data.status.message,
          account_resp.status
        );

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
    if (error instanceof TFTrackerError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    } else if (error instanceof RiotApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    } else {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
