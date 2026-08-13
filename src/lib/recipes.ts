import { getDb } from "./db";
import { recipes } from "./schema";
import { eq } from "drizzle-orm";
import type { Recipe } from "@/types/recipe";

export async function getAllRecipes(): Promise<Recipe[]> {
  const rows = await getDb().select().from(recipes).orderBy(recipes.publishedAt);
  return rows.map(rowToRecipe);
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const rows = await getDb().select().from(recipes).where(eq(recipes.slug, slug));
  if (rows.length === 0) return null;
  return rowToRecipe(rows[0]);
}

function rowToRecipe(row: typeof recipes.$inferSelect): Recipe {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image,
    category: row.category,
    cuisine: row.cuisine,
    prepTime: row.prepTime,
    cookTime: row.cookTime,
    servings: row.servings,
    difficulty: row.difficulty as Recipe["difficulty"],
    tags: row.tags,
    ingredients: row.ingredients,
    instructions: row.instructions,
    nutrition: row.nutrition,
    author: row.author,
    publishedAt: row.publishedAt.toISOString().split("T")[0],
  };
}
