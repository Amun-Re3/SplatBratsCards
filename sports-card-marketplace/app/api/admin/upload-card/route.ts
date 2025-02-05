import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  const data = await request.formData()
  const name = data.get("name") as string
  const price = data.get("price") as string
  const image = data.get("image") as File

  if (!name || !price || !image) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
  }

  const buffer = Buffer.from(await image.arrayBuffer())
  const filename = Date.now() + "-" + image.name.replaceAll(" ", "_")

  try {
    await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer)

    const client = await clientPromise
    const db = client.db("sportsCards")
    const cardsCollection = db.collection("cards")

    await cardsCollection.insertOne({
      name,
      price: Number.parseFloat(price),
      imageUrl: `/uploads/${filename}`,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, message: "Card uploaded successfully" })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ success: false, message: "Error uploading file" }, { status: 500 })
  }
}

