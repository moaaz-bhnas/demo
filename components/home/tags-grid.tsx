"use client";

import Image from "next/image";
import Link from "next/link";
import { useTags } from "@/hooks/use-tags";
import { TagsCarouselSkeleton } from "@/components/skeleton/carousel-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";

export function TagsGrid() {
  const { tags, isLoading } = useTags();

  const tagsWithImages = tags.filter((tag) => tag.metadata?.thumbnail);

  return (
    <WithSkeleton isLoading={isLoading} skeleton={<TagsCarouselSkeleton count={6} />}>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {tagsWithImages.map((tag) => (
          <Link
            key={tag.id}
            href={`/search?tag=${tag.id}`}
            className="group flex flex-col items-center gap-2"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
              {tag.metadata?.thumbnail && (
                <Image
                  src={tag.metadata.thumbnail}
                  alt={tag.value}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                />
              )}
            </div>
            <span className="text-center text-sm capitalize">
              {tag.value.replace(/-/g, " ")}
            </span>
          </Link>
        ))}
      </div>
    </WithSkeleton>
  );
}

