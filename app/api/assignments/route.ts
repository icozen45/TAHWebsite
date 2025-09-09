// app/api/assignments/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "data", "assignments.json");

function readAssignments(): any[] {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf-8") || "[]";
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAssignments(data: any[]) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// GET all assignments
export async function GET() {
  try {
    return NextResponse.json(readAssignments());
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

// POST new assignments
export async function POST(req: Request) {
  try {
    const { assignments } = await req.json();
    if (!Array.isArray(assignments)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const current = readAssignments();
    const updated = [...current, ...assignments];

    writeAssignments(updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save assignments" }, { status: 500 });
  }
}

// DELETE assignments
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const clear = url.searchParams.get("clear");
    const id = url.searchParams.get("id");

    let current = readAssignments();

    // Clear all assignments
    if (clear === "true") {
      writeAssignments([]);
      return NextResponse.json([]);
    }

    // Delete single assignment by ID
    if (id) {
      const numericId = Number(id);
      const updated = current.filter(item => item.id !== numericId);
      writeAssignments(updated);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid delete request" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
