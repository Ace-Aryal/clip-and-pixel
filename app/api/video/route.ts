import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  //to do ? infinite quwery with React query
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server eror",
      },
      {
        status: 500,
      }
    );
  }
}
