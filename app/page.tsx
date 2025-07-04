"use client";
import { useQuery } from "@tanstack/react-query";

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
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Sorry,Some internal error</p>;
  }
  console.log(data, "data");
  return <div>Hello</div>;
}
