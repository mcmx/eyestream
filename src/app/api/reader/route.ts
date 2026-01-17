/**
 * API Route: POST /api/reader
 * Generate new reader code and create Reader record
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReaderCode } from "@/lib/generateCode";

export async function POST() {
  try {
    // Generate unique code
    let code = generateReaderCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure code is unique
    while (attempts < maxAttempts) {
      const existing = await prisma.reader.findUnique({
        where: { code },
      });

      if (!existing) break;

      code = generateReaderCode();
      attempts++;
    }

    if (attempts === maxAttempts) {
      return NextResponse.json(
        { error: "Failed to generate unique code" },
        { status: 500 }
      );
    }

    // Create reader with default settings
    const reader = await prisma.reader.create({
      data: {
        code,
        settings: {
          create: {
            defaultWpm: 300,
            fontSize: "large",
            theme: "dark",
            autoSaveEvery: 5,
          },
        },
      },
      include: {
        settings: true,
      },
    });

    return NextResponse.json({
      reader,
      code: reader.code,
    });
  } catch (error) {
    console.error("Error creating reader:", error);
    return NextResponse.json(
      { error: "Failed to create reader" },
      { status: 500 }
    );
  }
}
