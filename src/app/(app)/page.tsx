"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/message.json" assert { type: "json" };
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the mystry world of Anonymous Conversations
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore Mystery Messages- where your identity remains a secret
        </p>
      </section>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {messages.map((msg, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="text-center">
                  <CardHeader className="font-bold text-green-700">
                    {msg.title}
                  </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6 ">
                    <span className="text-lg font-semibold">{msg.content}</span>
                  </CardContent>
                  <CardFooter>{msg.received}</CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
