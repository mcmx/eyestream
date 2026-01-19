/**
 * API Routes: GET/PUT /api/reader/[code]/settings
 * Get and update reader settings
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const reader = await prisma.reader.findUnique({
      where: { code: code.toUpperCase() },
      include: { settings: true },
    });

    if (!reader) {
      return NextResponse.json(
        { error: "Reader not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings: reader.settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();

    const reader = await prisma.reader.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!reader) {
      return NextResponse.json(
        { error: "Reader not found" },
        { status: 404 }
      );
    }

    const settings = await prisma.readerSettings.update({
      where: { readerId: reader.id },
      data: {
        defaultWpm: body.defaultWpm,
        fontSize: body.fontSize,
        theme: body.theme,
        autoSaveEvery: body.autoSaveEvery,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
