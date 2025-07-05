"use client";
import VideoCard from "@/components/video-card";
import { Video } from "@/lib/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/video");
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }
    },
  });
  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", `_blank`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Sorry,Some internal error</p>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      {data.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No Videos available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((video: Video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
