/**
 * API Routes: GET/POST /api/readings
 * List all readings for a reader / Create new reading
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { countWords } from "@/utils/textParser";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Reader code is required" },
        { status: 400 }
      );
    }

    const reader = await prisma.reader.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        readings: {
          orderBy: { lastReadAt: "desc" },
        },
      },
    });

    if (!reader) {
      return NextResponse.json(
        { error: "Reader not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ readings: reader.readings });
  } catch (error) {
    console.error("Error fetching readings:", error);
    return NextResponse.json(
      { error: "Failed to fetch readings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, title, content } = body;

    if (!code || !title || !content) {
      return NextResponse.json(
        { error: "Code, title, and content are required" },
        { status: 400 }
      );
    }

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

    const wordCount = countWords(content);
    const defaultWpm = reader.settings?.defaultWpm ?? 300;

    const reading = await prisma.reading.create({
      data: {
        readerId: reader.id,
        title,
        content,
        wordCount,
        currentWpm: defaultWpm,
        currentPosition: 0,
        isCompleted: false,
      },
    });

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Error creating reading:", error);
    return NextResponse.json(
      { error: "Failed to create reading" },
      { status: 500 }
    );
  }
}
