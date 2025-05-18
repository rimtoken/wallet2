import React from "react";
import { useTheme } from "@/contexts/theme-context";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "light",
      name: "فاتح",
      preview: (
        <div className="w-full h-full bg-white border border-gray-200 rounded-md shadow p-3">
          <div className="flex items-center mb-2">
            <div className="w-8 h-2 bg-gray-300 rounded"></div>
            <div className="w-6 h-2 bg-blue-400 ml-2 rounded"></div>
          </div>
          <div className="w-full h-2 bg-purple-300 mb-2 rounded"></div>
          <div className="w-3/4 h-2 bg-amber-400 mb-2 rounded"></div>
          <div className="w-1/2 h-2 bg-green-400 rounded"></div>
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex justify-center items-center">
              <div className="w-4 h-4 rounded-full">
                <div className="flex justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mx-px"></div>
                  <div className="w-1 h-1 rounded-full bg-green-500 mx-px"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dark",
      name: "داكن",
      preview: (
        <div className="w-full h-full bg-gray-900 border border-gray-700 rounded-md shadow p-3">
          <div className="flex items-center mb-2">
            <div className="w-8 h-2 bg-gray-700 rounded"></div>
            <div className="w-6 h-2 bg-blue-400 ml-2 rounded"></div>
          </div>
          <div className="w-full h-2 bg-purple-500 mb-2 rounded"></div>
          <div className="w-3/4 h-2 bg-amber-400 mb-2 rounded"></div>
          <div className="w-1/2 h-2 bg-green-400 rounded"></div>
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 rounded-full bg-gray-800 flex justify-center items-center">
              <div className="w-4 h-4 rounded-full">
                <div className="flex justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mx-px"></div>
                  <div className="w-1 h-1 rounded-full bg-green-500 mx-px"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "spooky",
      name: "مخيف",
      preview: (
        <div className="w-full h-full bg-gray-950 border border-orange-900 rounded-md shadow p-3">
          <div className="flex items-center mb-2">
            <div className="w-8 h-2 bg-gray-800 rounded"></div>
            <div className="w-6 h-2 bg-orange-400 ml-2 rounded"></div>
          </div>
          <div className="w-full h-2 bg-purple-700 mb-2 rounded"></div>
          <div className="w-3/4 h-2 bg-amber-500 mb-2 rounded"></div>
          <div className="w-1/2 h-2 bg-green-500 rounded"></div>
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 rounded-full bg-gray-900 flex justify-center items-center">
              <div className="w-4 h-4 rounded-full">
                <div className="flex justify-center">
                  <div className="w-1 h-1 rounded-full bg-orange-500 mx-px"></div>
                  <div className="w-1 h-1 rounded-full bg-amber-500 mx-px"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={cn("theme-selector", className)}>
      <h2 className="text-2xl font-bold mb-6 text-center">الثيمات الرسمية</h2>
      <RadioGroup
        value={theme}
        onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'spooky' | 'system')}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {themes.map((t) => (
          <div key={t.id} className="relative">
            <RadioGroupItem
              value={t.id}
              id={`theme-${t.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`theme-${t.id}`}
              className="cursor-pointer"
            >
              <Card
                className={cn(
                  "overflow-hidden transition-all border-2",
                  theme === t.id
                    ? "border-amber-500 shadow-md"
                    : "border-transparent hover:border-amber-300"
                )}
              >
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden">
                    {t.preview}
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 flex items-center">
                    <div className="rounded-full bg-gray-300 dark:bg-gray-600 p-1 flex items-center justify-center w-8 h-8 mr-2">
                      <span className="text-xs">R</span>
                    </div>
                    <span>{t.name}</span>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}