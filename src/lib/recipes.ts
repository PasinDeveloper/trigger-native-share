import type { Recipe } from "@/types/recipe";

async function getAllRecipesFromDb(): Promise<Recipe[]> {
  const { getDb } = await import("./db");
  const { recipes } = await import("./schema");
  const rows = await getDb().select().from(recipes).orderBy(recipes.publishedAt);
  return rows.map(rowToRecipe);
}

function rowToRecipe(row: { id: number; slug: string; title: string; description: string; image: string; category: string; cuisine: string; prepTime: number; cookTime: number; servings: number; difficulty: string; tags: string[]; ingredients: string[]; instructions: string[]; nutrition: { calories: number; protein: string; carbs: string; fat: string }; author: string; publishedAt: Date }): Recipe {
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

async function getAllRecipesFromJson(): Promise<Recipe[]> {
  const fs = await import("fs");
  const path = await import("path");
  const dir = path.join(process.cwd(), "src", "data", "recipes");
  const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
  const recipes: Recipe[] = files.map((file: string) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    return JSON.parse(raw) as Recipe;
  });
  return recipes.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}

export async function getAllRecipes(): Promise<Recipe[]> {
  if (process.env.DATABASE_URL) {
    return getAllRecipesFromDb();
  }
  return getAllRecipesFromJson();
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  if (process.env.DATABASE_URL) {
    const { getDb } = await import("./db");
    const { recipes } = await import("./schema");
    const { eq } = await import("drizzle-orm");
    const rows = await getDb().select().from(recipes).where(eq(recipes.slug, slug));
    if (rows.length === 0) return null;
    return rowToRecipe(rows[0]);
  }
  const all = await getAllRecipesFromJson();
  return all.find((r) => r.slug === slug) ?? null;
}
