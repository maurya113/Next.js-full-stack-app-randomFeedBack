"use client";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SuggestMessage from "@/components/SuggestQuestions";

type FormValues = {
  message: string;
};

export default function Page() {
  const params = useParams();
  const username = params.username as string;

  const form = useForm<FormValues>({
    defaultValues: {
      message: " ",
    },
  });

  const { register, handleSubmit } = form;

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.get(
        `/api/accept-message-status/${username}`
      );
      if (response.data.isAcceptingMessages === "false") {
        toast("this user is not accepting messages at this moment");
        return;
      }

      const result = await axios.post("/api/send-message", {
        username,
        content: data.message,
      });

      toast(result.data.message);
    } catch (error) {
      console.log("error while sending the message: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message);
      console.log(axiosError.response?.data.message);
    }
  };

  return (
    <div className="w-full mt-4 pl-20 pr-20">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold text-center">Public profile Link</h1>
        <p>send anonymous message to @{username}</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="write your message..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit">Send</Button>
            </div>
          </form>
        </Form>
      </div>
      <div>
        <SuggestMessage onSelectQuestion={(q) => form.setValue("message", q)} />
      </div>
    </div>
  );
}
