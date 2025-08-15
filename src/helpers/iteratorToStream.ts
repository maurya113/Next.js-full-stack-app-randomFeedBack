import { ChatCompletionChunk } from "groq-sdk/resources/chat.mjs";

export function iteratorToStream(iterator: AsyncIterable<ChatCompletionChunk>) {
  return new ReadableStream({
    // Creates a Web Streams API ReadableStream.
    // Next.js NextResponse can send this stream directly to the client, so data can flow as it arrives.
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of iterator) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(`data: ${text}\n\n`));
            //this is a SSE format to print the data out of a EventSource if we forgot putting \n\n then browser will keep buffering and doesn't print anything.
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
