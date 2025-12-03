This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## UI & API Guidelines

- **Design tokens**

  - **Border radius**: use `rounded-md` (8px) consistently across all components (buttons, cards, inputs, modals, etc.). Only deviate for special cases like badges (`rounded-full`) or specific design requirements.
  - **Spacing**:
    - **Gaps**: use `gap-2` (8px) for tight groups, `gap-4` (16px) for standard spacing, `gap-6` (24px) for sections, `gap-8` (32px) for major sections.
    - **Padding**: use `p-3` (12px) for compact elements, `p-4` (16px) for buttons/cards, `p-6` (24px) for containers.
    - **Margins**: follow the same scale as gaps (`m-2`, `m-4`, `m-6`, `m-8`).
    - Avoid arbitrary spacing values; stick to this scale for consistency.
  - **Typography**: use app-wide font sizes and weights (e.g. `text-sm`, `text-base`, `text-lg`) and avoid inline `style` font overrides.
  - **Colors**: use the design system tokens (e.g. `bg-muted`, `border-input`, `text-muted-foreground`) instead of raw hex values.

- **Naming conventions**

  - File and folder names must use **kebab-case** (e.g. `product-card.tsx`, `product-list`, `use-products.ts`) and never `camelCase` or `PascalCase`.
  - React components inside those files can still use `PascalCase` (e.g. `ProductCard`), but the file on disk stays kebab-cased.

- **URL state management**

  - Use [`nuqs`](https://github.com/react-libraries/nuqs) for all URL/query-string state (filters, selected variant, pagination, sorting, etc.).
  - Encode complex values (arrays/objects) with nuqs helpers instead of manual `URLSearchParams` manipulation.

- **Data fetching**

  - All network requests from the UI should be **client-side** and use [`swr`](https://swr.vercel.app/) (or small wrappers) for caching and revalidation.
  - Expose domain-specific hooks like `useProducts`, `useCategories`, `useCart`, etc. instead of calling `useSWR` directly in components.
  - Keep fetcher logic (URLs, headers, error handling) in a shared API layer and reuse across hooks.

- **Loading & skeletons**

  - Any component that relies on an API request must have a **matching skeleton counterpart** using shadcn's `Skeleton` component.
  - All skeleton components should live in `components/skeleton/` and be named after their counterpart (e.g. `ProductCardSkeleton` for `ProductCard`).
  - The skeleton should mirror the layout and approximate dimensions of the loaded component to avoid layout shift.

- **Component structure**

  - **Always prefer shadcn/ui components** when available. Use shadcn components (Button, Card, Input, Dialog, etc.) instead of building custom components from scratch.
  - Keep components small and focused; prefer composition over large "god" components.
  - Extract reusable pieces (buttons, cards, list items, badges, etc.) into the shared `components` folder.
  - Group related components into their own subfolder (e.g. `product/` containing `product-card.tsx`, `product-list.tsx`, `product-filters.tsx`) instead of a flat `components` directory.
  - Use `props` interfaces/types for all public components and avoid spreading arbitrary `any` props.

- **Design philosophy**

  - **Keep the design minimal and simple**. Avoid unnecessary visual complexity, excessive animations, or decorative elements that don't serve a functional purpose.
  - Prioritize clarity and usability over visual flair. Use whitespace effectively and maintain a clean, uncluttered interface.

- **State management**

  - Prefer local React state for purely presentational concerns and `nuqs` for URL-driven state.
  - Derive state from SWR data and URL params instead of duplicating server state in multiple places.

- **Error & empty states**

  - Every data-fetching view should handle **loading**, **error**, and **empty** states explicitly.
  - Use consistent patterns for error messaging and recovery actions (e.g. "Retry" buttons that revalidate SWR).

- **Accessibility & semantics**

  - Use semantic HTML elements (`button`, `nav`, `main`, `ul/li`, etc.) and ARIA attributes where appropriate.
  - Ensure interactive elements are keyboard-navigable and have visible focus states.

- **Performance & DX**
  - Prefer React Server Components for static/slow-changing data and client components only when necessary (interactivity, SWR, `nuqs`).
  - Co-locate tests and stories (if using Storybook) with components to keep UI behavior well documented.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
