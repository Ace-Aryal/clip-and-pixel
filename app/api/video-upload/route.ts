// DAL
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  type UploadResult = {
    public_id: string;
    bytes: number;
    duration?: number;
    // plus potentially lots of other unknown fields returned by Cloudinary
    [key: string]: any;
  };
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      {
        error: "Invalid environment credentials",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        {
          error: "No file included",
        },
        {
          status: 400,
        }
      );
    }
    const bytes = await file.arrayBuffer(); // array buffer
    const buffer = Buffer.from(bytes); // node buffer
    // note : can be optimsed more using Readable and pipe
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "CNP_Videos",
          resource_type: "video",
          transformation: {
            quality: "auto",
            fetch_format: "mp4",
          },
        },
        (error, result) => {
          if (error) {
            reject(error);
          }

          if (!result) return reject(new Error("No result from Cloudinary"));

          resolve(result as UploadResult);
        }
      );
      uploadStream.end(buffer);
    });
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });
    return NextResponse.json(
      {
        video,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload failed  ! Server error",
      },
      {
        status: 500,
      }
    );
  }
}
