import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function POST(req: Request) {
  const { url } = await req.json()

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    const html = await res.text()
    const $ = cheerio.load(html)

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text()

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content")

    const image =
      $('meta[property="og:image"]').attr("content")

    return NextResponse.json({
      title,
      description,
      image,
      url,
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 })
  }
}