"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
function VideoUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (!file || file.size > MAX_FILE_SIZE) {
      return toast.error("Please provide a file less than 50 Mb");
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("description", description);
    formData.append("originalSize", file?.size.toString());
    try {
      setIsUploading(true);
      const videoResponse = await axios.post("/api/video-upload", formData);
      console.log("video response", videoResponse);
      toast.success("Video uploaded sucessfully");
    } catch (error) {
      console.error(error);
      return toast.error(
        error instanceof Error ? error.message : "Error uploading video"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleFileUpload} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-1.5 border-2 border-gray-400 rounded  w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-1.5 border-2 border-gray-400 rounded w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="px-4 py-1.5 border-2 border-gray-400 rounded w-full"
            required
          />
        </div>
        <Button
          type="submit"
          variant="blue"
          className=""
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
      </form>
    </div>
  );
}

export default VideoUploadPage;
