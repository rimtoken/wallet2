import { Button } from "@/components/ui/button";

export type NewsCategory = "all" | "market" | "technology" | "regulation" | "adoption" | "opinion" | "rimtoken";

interface NewsCategoriesProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

export function NewsCategories({ activeCategory, onCategoryChange }: NewsCategoriesProps) {
  const categories: { id: NewsCategory; label: string }[] = [
    { id: "all", label: "جميع الأخبار" },
    { id: "market", label: "أخبار السوق" },
    { id: "technology", label: "تكنولوجيا" },
    { id: "regulation", label: "تشريعات" },
    { id: "adoption", label: "تبني العملات" },
    { id: "rimtoken", label: "RIM Token" },
    { id: "opinion", label: "آراء ومقالات" },
  ];

  return (
    <div className="flex overflow-x-auto pb-2 hide-scrollbar">
      <div className="flex gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            className={
              activeCategory === category.id
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "text-gray-700 hover:text-amber-700 hover:border-amber-300"
            }
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}