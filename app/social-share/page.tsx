"use client";
import axios from "axios";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

function SocaialSharePage() {
  const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": {
      width: 1080,
      height: 1350,
      aspectRatio: "4:5",
    },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": {
      width: 820,
      height: 312,
      aspectRatio: "205:78",
    },
  };

  type SocialFormat = keyof typeof socialFormats; // holds union type of keys
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(
    "Instagram Square (1:1)"
  );
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (hasUploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, hasUploadedImage]);
  const hanldeImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) {
      return toast.error("Couldn't get file");
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const imageUploadRespone = await axios.post("/api/image-uplod");
      console.log(imageUploadRespone);
      toast.success("Image uploaded sucessfully");
      setImagePublicId(imageUploadRespone.data.publicId);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Couldn't upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };
  return <div>SocaialSharePage</div>;
}

export default SocaialSharePage;
