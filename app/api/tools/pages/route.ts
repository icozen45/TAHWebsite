// app/api/tools/pages/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const appDir = path.resolve(process.cwd(), 'app');
  const folders = fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('api'))
    .map((dirent) => dirent.name);

  const routes = folders.map((folder) => `/${folder}`);
  return NextResponse.json({ routes });
}
