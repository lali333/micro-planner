"use client";

import { ChromeLoader } from "@/components/MicroPlanner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ChromeLoader label="Loading" />
    </div>
  );
}
