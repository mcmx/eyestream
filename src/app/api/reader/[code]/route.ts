/**
 * API Route: GET /api/reader/[code]
 * Validate code and get reader ID
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
      include: {
        settings: true,
      },
    });

    if (!reader) {
      return NextResponse.json(
        { error: "Reader code not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reader });
  } catch (error) {
    console.error("Error fetching reader:", error);
    return NextResponse.json(
      { error: "Failed to fetch reader" },
      { status: 500 }
    );
  }
}
