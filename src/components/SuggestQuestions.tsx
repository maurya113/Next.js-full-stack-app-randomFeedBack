import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuggestMessage({
  onSelectQuestion,
}: {
  onSelectQuestion: (q: string) => void;
}) {
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetQuestions = async () => {
    setLoading(true);
    setQuestions("");

    const response = await fetch("/api/suggest-message", { method: "POST" });
    if (!response.body) {
      setLoading(false);
      toast("can't get AI suggestion at this moment");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data:"));
        for (const line of lines) {
          const text = line.replace(/^data:\s*/, " "); // remove "data: "
          setQuestions((prev) => prev + (prev.endsWith(" ") ? "" : " ") + text); // append clean text
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGetQuestions}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading messages" : "Get Questions"}
      </button>

      <div className="mt-4 whitespace-pre-wrap w-full">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-full rounded bg-gray-400" />
            <Skeleton className="h-9 w-full rounded bg-gray-400" />
            <Skeleton className="h-9 w-3/4 rounded bg-gray-400" />
          </div>
        ) : questions ? (
          questions.split("||").map((q, index) => (
            <button
              key={index}
              onClick={() => onSelectQuestion(q.trim())}
              className="block w-full text-left bg-gray-100 hover:bg-gray-200 p-2 rounded mb-2"
            >
              {q.trim()}
            </button>
          ))
        ) : (
          "No questions yet"
        )}
      </div>
    </div>
  );
}
