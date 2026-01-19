/**
 * API Route: PATCH /api/readings/[id]/position
 * Quick position update - lightweight endpoint for syncing reading progress
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { position, wpm } = body;

    if (typeof position !== "number" || typeof wpm !== "number") {
      return NextResponse.json(
        { error: "Position and WPM are required" },
        { status: 400 }
      );
    }

    const reading = await prisma.reading.update({
      where: { id },
      data: {
        currentPosition: position,
        currentWpm: wpm,
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, reading });
  } catch (error) {
    console.error("Error updating position:", error);
    return NextResponse.json(
      { error: "Failed to update position" },
      { status: 500 }
    );
  }
}
