import Link from "next/link";
import { Clock, Users, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShareButton } from "@/components/ShareButton";
import { difficultyColor, getCategoryEmoji } from "@/lib/recipe-utils";
import type { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  baseUrl: string;
}

export function RecipeCard({ recipe, baseUrl }: RecipeCardProps) {
  const recipeUrl = `${baseUrl}/recipes/${recipe.slug}`;
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl" role="img" aria-label={recipe.category}>
            {getCategoryEmoji(recipe.category)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              difficultyColor[recipe.difficulty]
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs">
            {recipe.cuisine}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <Link
          href={`/recipes/${recipe.slug}`}
          className="group-hover:text-orange-600 transition-colors"
        >
          <h2 className="font-bold text-xl leading-tight line-clamp-2">
            {recipe.title}
          </h2>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {recipe.description}
        </p>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            {recipe.author}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto pt-0 flex items-center justify-between">
        <Link
          href={`/recipes/${recipe.slug}`}
          className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
        >
          View Recipe →
        </Link>
        <ShareButton
          title={recipe.title}
          text={`Check out this amazing recipe: ${recipe.title}`}
          url={recipeUrl}
        />
      </CardFooter>
    </Card>
  );
}
