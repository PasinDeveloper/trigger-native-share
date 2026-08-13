import { notFound } from "next/navigation";
import { getRecipeBySlug } from "@/lib/recipes";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ShareButton";
import { Clock, Users, ChefHat, Flame, BarChart3 } from "lucide-react";
import { headers } from "next/headers";
import { difficultyColor, getCategoryEmoji } from "@/lib/recipe-utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe not found" };
  return {
    title: `${recipe.title} — RecipeShare`,
    description: recipe.description,
  };
}

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const [recipe, baseUrl] = await Promise.all([
    getRecipeBySlug(slug),
    getBaseUrl(),
  ]);

  if (!recipe) notFound();

  const recipeUrl = `${baseUrl}/recipes/${recipe.slug}`;
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12">
      {/* Back link */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        ← Back to all recipes
      </a>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary">{recipe.cuisine}</Badge>
          <Badge variant="outline">{recipe.category}</Badge>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              difficultyColor[recipe.difficulty]
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
          {recipe.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {recipe.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <strong>Prep:</strong> {recipe.prepTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="h-4 w-4" />
            <strong>Cook:</strong> {recipe.cookTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-orange-500" />
            <strong>Total:</strong> {totalTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <strong>Serves:</strong> {recipe.servings}
          </span>
          <span className="flex items-center gap-1.5">
            <ChefHat className="h-4 w-4" />
            {recipe.author}
          </span>
        </div>

        {/* Share button */}
        <ShareButton
          title={recipe.title}
          text={`Check out this amazing recipe: ${recipe.title} — ${recipe.description}`}
          url={recipeUrl}
        />
      </div>

      {/* Hero image placeholder */}
      <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center mb-10">
        <span className="text-8xl" role="img" aria-label={recipe.category}>
          {getCategoryEmoji(recipe.category)}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🧂</span> Ingredients
          </h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>👨‍🍳</span> Instructions
          </h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 h-7 w-7 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Nutrition */}
      <div className="mt-10 p-6 rounded-xl border bg-muted/40">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-orange-500" /> Nutrition per
          serving
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Calories", value: String(recipe.nutrition.calories) },
            { label: "Protein", value: recipe.nutrition.protein },
            { label: "Carbs", value: recipe.nutrition.carbs },
            { label: "Fat", value: recipe.nutrition.fat },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="text-center p-3 rounded-lg bg-background border"
            >
              <div className="text-2xl font-bold text-orange-600">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {recipe.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Bottom share CTA */}
      <div className="mt-12 p-6 rounded-xl border bg-orange-50 dark:bg-orange-950/20 text-center">
        <p className="font-semibold text-lg mb-2">
          Love this recipe? Share it with friends!
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Use your device&apos;s native share dialog to send this recipe via
          messages, email, social media, and more.
        </p>
        <ShareButton
          title={recipe.title}
          text={`Check out this amazing recipe: ${recipe.title} — ${recipe.description}`}
          url={recipeUrl}
        />
      </div>
    </div>
  );
}
