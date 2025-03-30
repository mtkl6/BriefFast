import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createBriefing, getBriefingById, updateBriefing } from "../../../db";

// POST /api/briefings - Create a new briefing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, data } = body;

    if (!category || !data) {
      return NextResponse.json(
        { error: "Missing required fields: category and data" },
        { status: 400 }
      );
    }

    const briefing = await createBriefing(category, data);

    if (!briefing) {
      return NextResponse.json(
        { error: "Failed to create briefing - database error" },
        { status: 500 }
      );
    }

    return NextResponse.json(briefing, { status: 201 });
  } catch (error) {
    console.error("Error creating briefing:", error);
    return NextResponse.json(
      { error: "Failed to create briefing" },
      { status: 500 }
    );
  }
}

// GET /api/briefings?uuid=<UUID> - Fetch an existing briefing by UUID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get("uuid");

    if (!uuid) {
      return NextResponse.json(
        { error: "Missing required query parameter: uuid" },
        { status: 400 }
      );
    }

    const briefing = await getBriefingById(uuid);

    if (!briefing) {
      return NextResponse.json(
        { error: "Briefing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(briefing);
  } catch (error) {
    console.error("Error fetching briefing:", error);
    return NextResponse.json(
      { error: "Failed to fetch briefing" },
      { status: 500 }
    );
  }
}

// PUT /api/briefings?uuid=<UUID> - Update an existing briefing
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get("uuid");
    const body = await request.json();
    const { data } = body;

    if (!uuid) {
      return NextResponse.json(
        { error: "Missing required query parameter: uuid" },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Missing required field: data" },
        { status: 400 }
      );
    }

    const updatedBriefing = await updateBriefing(uuid, data);

    if (!updatedBriefing) {
      return NextResponse.json(
        { error: "Briefing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBriefing);
  } catch (error) {
    console.error("Error updating briefing:", error);
    return NextResponse.json(
      { error: "Failed to update briefing" },
      { status: 500 }
    );
  }
}
