// DAL
import cloudinary from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  type UploadResult = {
    public_id: string;
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

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
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
          folder: "CNP_Images",
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
    return NextResponse.json(
      {
        publicID: result.public_id,
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
