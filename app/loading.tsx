"use client";

import { ChromeLoader } from "@/components/MicroPlanner";

export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f8f5ed" }}
    >
      <ChromeLoader label="Loading" />
    </div>
  );
}
