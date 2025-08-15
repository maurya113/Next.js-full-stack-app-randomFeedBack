import { iteratorToStream } from "@/helpers/iteratorToStream";
import Groq from "groq-sdk";

import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const prompt =
      "Generate exactly 3 unique and interesting questions about other person's personal life. Keep them short and clear. Separate each question with '||' and do not add numbering, bullet points, or extra commentary.";

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      reasoning_effort: "medium",
      stop: null,
      stream: true,
    });

    const stream = iteratorToStream(response);
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 404 }
    );
  }
}
