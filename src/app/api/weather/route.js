import { NextResponse } from "next/server";
import { getCurrentWeather } from "@/lib/openWeather";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    const weather = await getCurrentWeather({
      lat: searchParams.get("lat"),
      lon: searchParams.get("lon")
    });

    return NextResponse.json({ weather });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to load weather" },
      { status: 500 }
    );
  }
}
