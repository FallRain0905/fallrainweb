"use client";

import { useEffect, useState, useMemo } from "react";
import { SearchBar } from "@/components/search-bar";
import { NavGroup } from "@/components/nav-group";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  icon_url?: string | null;
}

interface CategoryItem {
  id: string;
  name: string;
  icon?: string | null;
  links: LinkItem[];
}

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        links: cat.links.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.url.toLowerCase().includes(q) ||
            (l.description && l.description.toLowerCase().includes(q))
        ),
      }))
      .filter((cat) => cat.links.length > 0);
  }, [categories, search]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-foreground whitespace-nowrap">
              Nav
            </h1>
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {filtered.length === 0 && search ? (
          <div className="py-20 text-center text-muted">
            没有找到匹配 &quot;{search}&quot; 的书签
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted">
            还没有书签，前往{" "}
            <a href="/admin" className="text-primary hover:underline">
              管理后台
            </a>{" "}
            添加
          </div>
        ) : (
          filtered.map((cat) => <NavGroup key={cat.id} category={cat} />)
        )}
      </main>
    </div>
  );
}
