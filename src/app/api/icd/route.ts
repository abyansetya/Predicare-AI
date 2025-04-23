import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Mengambil data ICD primer dari database
    const icdData = await db.getMany(
      "SELECT code, description FROM icd ORDER BY code"
    );

    return NextResponse.json({
      success: true,
      data: icdData,
    });
  } catch (error) {
    console.error("Error fetching ICD data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ICD data" },
      { status: 500 }
    );
  }
}
