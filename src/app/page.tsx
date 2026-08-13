import { getAllRecipes } from "@/lib/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function HomePage() {
  const [recipes, baseUrl] = await Promise.all([getAllRecipes(), getBaseUrl()]);

  return (
    <div className="container mx-auto px-4 max-w-6xl py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Discover &amp; Share{" "}
          <span className="text-orange-600">Amazing Recipes</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our curated collection of recipes from around the world. Share
          your favorites instantly using your device&apos;s native share
          capabilities.
        </p>
      </div>

      {/* Stats strip */}
      <div className="flex justify-center gap-8 mb-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">
            {recipes.length}
          </div>
          <div className="text-sm text-muted-foreground">Recipes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">
            {[...new Set(recipes.map((r) => r.cuisine))].length}
          </div>
          <div className="text-sm text-muted-foreground">Cuisines</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">
            {[...new Set(recipes.map((r) => r.category))].length}
          </div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </div>
      </div>

      {/* Recipe grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No recipes found. Run{" "}
            <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
              npm run db:seed
            </code>{" "}
            to populate the database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} baseUrl={baseUrl} />
          ))}
        </div>
      )}
    </div>
  );
}
