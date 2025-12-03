"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSettings } from "@/hooks/use-settings";
import { CarouselSkeleton } from "@/components/skeleton/carousel-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";

export function HeroCarousel() {
  const { settings, isLoading } = useSettings();
  const images = settings?.metadata?.slider_images ?? [];

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <WithSkeleton isLoading={isLoading} skeleton={<CarouselSkeleton />}>
      {images.length > 0 && (
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-md">
                  <Image
                    src={image.url}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
      )}
    </WithSkeleton>
  );
}

