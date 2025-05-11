// src/types/category.ts
export interface Category {
  id: string;
  userId: string;
  name: string;
  color?: string; // optional—for display
  icon?: string; // optional icon name or URL
}
