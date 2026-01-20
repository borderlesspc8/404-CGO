import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "icon-light-32x32.png")
  const file = await fs.readFile(filePath)

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
