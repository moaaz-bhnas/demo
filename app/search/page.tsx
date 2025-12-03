"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/container";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/skeleton/product-card-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { useTags } from "@/hooks/use-tags";

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";
  const tagParam = searchParams.get("tag") ?? "";

  const [searchQuery, setSearchQuery] = useState(queryParam);

  const { products, isLoading } = useProducts({
    query: queryParam || undefined,
    tagId: tagParam || undefined,
  });

  const { tags } = useTags();
  const selectedTag = tags.find((t) => t.id === tagParam);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const pageTitle = selectedTag
    ? selectedTag.value.replace(/-/g, " ")
    : queryParam
    ? `Search results for "${queryParam}"`
    : "Search";

  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative mx-auto max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 pr-24"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Results Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold capitalize">{pageTitle}</h1>
        {(queryParam || tagParam) && (
          <p className="mt-1 text-muted-foreground">
            {products.length} product{products.length !== 1 && "s"} found
          </p>
        )}
      </div>

      {/* Results */}
      <WithSkeleton isLoading={isLoading} skeleton={<ProductGridSkeleton count={12} />}>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (queryParam || tagParam) ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No products found. Try a different search term.
            </p>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Enter a search term to find products
            </p>
          </div>
        )}
      </WithSkeleton>
    </>
  );
}

export default function SearchPage() {
  return (
    <Container>
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <SearchContent />
      </Suspense>
    </Container>
  );
}

