"use client";

import { Container } from "@/components/container";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { SecondaryCarousel } from "@/components/home/secondary-carousel";
import { TagsGrid } from "@/components/home/tags-grid";
import { ProductSection } from "@/components/home/product-section";
import { FlashSaleSection } from "@/components/flash-sale/flash-sale-section";
import { BrandsSection } from "@/components/home/brands-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { useSettings } from "@/hooks/use-settings";

export default function HomePage() {
  const { settings } = useSettings();

  const bestSellerTagId = settings?.metadata?.best_seller_tag_id;
  const newArrivalTagId = settings?.metadata?.new_arrival_tag_id;
  const flashSaleTagId = settings?.metadata?.flash_sale_tag_id;
  const recommendedTagId = settings?.metadata?.recommended_tag_id;

  return (
    <>
      {/* Hero Carousel */}
      <Container className="py-4 sm:py-6">
        <HeroCarousel />
      </Container>

      {/* Collections/Tags */}
      <Container>
        <h2 className="mb-6 text-xl font-semibold sm:text-2xl">Collections</h2>
        <TagsGrid />
      </Container>

      {/* Categories */}
      <Container>
        <CategoriesSection />
      </Container>

      {/* Best Sellers */}
      {bestSellerTagId && (
        <Container>
          <ProductSection
            title="Best Sellers"
            tagId={bestSellerTagId}
            viewAllLink={`/search?tag=${bestSellerTagId}`}
            limit={8}
          />
        </Container>
      )}

      {/* Secondary Carousel */}
      <Container>
        <SecondaryCarousel />
      </Container>

      {/* Flash Sale */}
      {flashSaleTagId && (
        <Container>
          <FlashSaleSection
            title="Flash Sale"
            tagId={flashSaleTagId}
            endTime={settings?.metadata?.flash_sale_end_time}
            viewAllLink={`/search?tag=${flashSaleTagId}`}
            limit={8}
          />
        </Container>
      )}

      {/* Brands */}
      <Container>
        <BrandsSection />
      </Container>

      {/* New Arrivals */}
      {newArrivalTagId && (
        <Container>
          <ProductSection
            title="New Arrivals"
            tagId={newArrivalTagId}
            viewAllLink={`/search?tag=${newArrivalTagId}`}
            limit={8}
          />
        </Container>
      )}

      {/* Recommended */}
      {recommendedTagId && (
        <Container>
          <ProductSection
            title="Recommended for You"
            tagId={recommendedTagId}
            viewAllLink={`/search?tag=${recommendedTagId}`}
            limit={8}
          />
        </Container>
      )}
    </>
  );
}
