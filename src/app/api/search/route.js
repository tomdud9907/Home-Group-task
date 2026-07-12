import { NextResponse } from "next/server";
import { searchCities } from "@/lib/openWeather";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    const cities = await searchCities(query);
    return NextResponse.json({ cities });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to search cities" },
      { status: 500 }
    );
  }
}
