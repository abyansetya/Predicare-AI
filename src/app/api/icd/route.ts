import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { error } from "console";
import { decrypt } from "@/lib/session";

export async function GET() {
  try {
    // Mengambil data ICD primer dari database
    const icdData = await db.getMany(
      "SELECT id,code, description FROM icd ORDER BY code"
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

//POST : menambahkan ICD Baru
export async function POST(request: Request) {
  try {
    //validasi cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    try {
      await decrypt(token);
    } catch (error) {
      console.error("Error decrypting token: ", error);
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    //Get request Body
    const { code, description } = await request.json();

    if (!code || !description) {
      return NextResponse.json(
        { error: "Code dan description are required!" },
        { status: 400 }
      );
    }

    //cek if icd already exists
    const existingIcd = await db.getOne("SELECT id FROM icd WHERE code = $1", [
      code,
    ]);

    if (existingIcd) {
      return NextResponse.json(
        { error: "ICD already exists" },
        { status: 400 }
      );
    }

    //insert new ICD
    const query =
      "INSERT INTO icd (code, description) VALUES ($1, $2) RETURNING id";
    const id = await db.insert(query, [code, description]);

    return NextResponse.json(
      { success: true, message: "ICD added succesfully", id },
      { status: 201 }
    );
  } catch (error) {
    console.error("error adding ICD: ", error);
    return NextResponse.json(
      {
        error: " Internal Server Error",
      },
      { status: 500 }
    );
  }
}
