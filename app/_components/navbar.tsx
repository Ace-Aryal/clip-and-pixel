import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Upload } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 shadow-sm border-b border-gray-300">
      <Link href="/">
        <div className="text-2xl font-bold">Clips & Pixels</div>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/social-share">
          <Button variant="orange">Social Share</Button>
        </Link>
        <Link href="/video-upload">
          <Button variant="blue">
            <span className="sr-only">Upload</span>
            <Upload />
          </Button>
        </Link>
        <SignedOut>
          <SignInButton>
            <Button variant="blue">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
