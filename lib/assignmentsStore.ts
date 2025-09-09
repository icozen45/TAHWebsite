import fs from "fs";
import path from "path";

const assignmentsFile = path.join(process.cwd(), "data", "assignments.json");

export async function readAssignments() {
  try {
    if (!fs.existsSync(assignmentsFile)) return [];
    const raw = fs.readFileSync(assignmentsFile, "utf-8");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("[READ_ASSIGNMENTS_ERROR]", err);
    return [];
  }
}

export async function writeAssignments(assignments: any[]) {
  try {
    fs.writeFileSync(assignmentsFile, JSON.stringify(assignments, null, 2));
  } catch (err) {
    console.error("[WRITE_ASSIGNMENTS_ERROR]", err);
  }
}

export async function appendAssignments(newAssignments: any[]) {
  const existing = await readAssignments();
  await writeAssignments([...existing, ...newAssignments]);
}

export async function clearAssignments() {
  await writeAssignments([]);
}
