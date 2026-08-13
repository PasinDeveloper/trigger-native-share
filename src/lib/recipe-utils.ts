import type { Recipe } from "@/types/recipe";

export const difficultyColor: Record<Recipe["difficulty"], string> = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
};

const categoryEmojiMap: Record<string, string> = {
  Pasta: "🍝",
  Curry: "🍛",
  Breakfast: "🍳",
  Tacos: "🌮",
  Dessert: "🍫",
  Salad: "🥗",
  Soup: "🍜",
  Stew: "🥘",
  Pizza: "🍕",
};

export function getCategoryEmoji(category: string): string {
  return categoryEmojiMap[category] ?? "🍽️";
}
