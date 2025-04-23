// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ username }: { username?: string }) {
  const pathname = usePathname();

  // Fungsi untuk menentukan apakah tautan aktif
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/dashboard" className="text-white text-xl font-bold">
            CostPredict
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/dashboard"
              className={`text-white font-medium ${
                isActive("/dashboard")
                  ? "border-b-2 border-white pb-1"
                  : "hover:border-b-2 hover:border-white/70 hover:pb-1 transition-all"
              }`}
            >
              Predict
            </Link>
            <Link
              href="/icd"
              className={`text-white font-medium ${
                isActive("/icd")
                  ? "border-b-2 border-white pb-1"
                  : "hover:border-b-2 hover:border-white/70 hover:pb-1 transition-all"
              }`}
            >
              ICD
            </Link>
            <Link
              href="/medicine"
              className={`text-white font-medium ${
                isActive("/medicine")
                  ? "border-b-2 border-white pb-1"
                  : "hover:border-b-2 hover:border-white/70 hover:pb-1 transition-all"
              }`}
            >
              Medicine
            </Link>
          </nav>

          <div className="bg-white text-blue-600 px-4 py-2 rounded font-medium">
            {username || "User"}
          </div>
        </div>
      </div>
    </header>
  );
}