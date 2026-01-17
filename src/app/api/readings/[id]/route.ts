/**
 * API Routes: GET/PUT/DELETE /api/readings/[id]
 * Get, update, or delete a single reading
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reading = await prisma.reading.findUnique({
      where: { id },
    });

    if (!reading) {
      return NextResponse.json(
        { error: "Reading not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Error fetching reading:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const reading = await prisma.reading.update({
      where: { id },
      data: {
        title: body.title,
        currentPosition: body.currentPosition,
        currentWpm: body.currentWpm,
        isCompleted: body.isCompleted,
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Error updating reading:", error);
    return NextResponse.json(
      { error: "Failed to update reading" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.reading.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reading:", error);
    return NextResponse.json(
      { error: "Failed to delete reading" },
      { status: 500 }
    );
  }
}
