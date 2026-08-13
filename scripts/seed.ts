import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { recipes } from "../src/lib/schema";
import * as fs from "fs";
import * as path from "path";

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  const recipesDir = path.join(__dirname, "../src/data/recipes");
  const files = fs.readdirSync(recipesDir).filter((f) => f.endsWith(".json"));

  console.log(`Found ${files.length} recipe files. Seeding...`);

  for (const file of files) {
    const raw = fs.readFileSync(path.join(recipesDir, file), "utf-8");
    const recipe = JSON.parse(raw);

    await db
      .insert(recipes)
      .values({
        slug: recipe.slug,
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        tags: recipe.tags,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition,
        author: recipe.author,
        publishedAt: new Date(recipe.publishedAt),
      })
      .onConflictDoNothing();

    console.log(`  ✓ Seeded: ${recipe.title}`);
  }

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
