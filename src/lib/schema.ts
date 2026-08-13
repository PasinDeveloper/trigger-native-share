import { integer, pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  cuisine: text("cuisine").notNull(),
  prepTime: integer("prep_time").notNull(),
  cookTime: integer("cook_time").notNull(),
  servings: integer("servings").notNull(),
  difficulty: text("difficulty").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  ingredients: jsonb("ingredients").$type<string[]>().notNull().default([]),
  instructions: jsonb("instructions").$type<string[]>().notNull().default([]),
  nutrition: jsonb("nutrition")
    .$type<{ calories: number; protein: string; carbs: string; fat: string }>()
    .notNull(),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RecipeRow = typeof recipes.$inferSelect;
export type NewRecipeRow = typeof recipes.$inferInsert;
