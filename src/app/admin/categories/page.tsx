"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  icon?: string | null;
  sort_order: number;
  links: { id: string }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, name, icon: icon || null }),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon: icon || null }),
      });
    }
    setName("");
    setIcon("");
    setEditId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("删除分组会同时删除其下所有链接，确定？")) return;
    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function startEdit(cat: Category) {
    setEditId(cat.id);
    setName(cat.name);
    setIcon(cat.icon || "");
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">分组管理</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-muted">名称</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">图标（emoji）</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-20 rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            placeholder="📚"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          {editId ? "保存" : "添加"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => { setEditId(null); setName(""); setIcon(""); }}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            取消
          </button>
        )}
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {cat.icon && <span className="text-lg">{cat.icon}</span>}
              <span className="font-medium text-foreground">{cat.name}</span>
              <span className="text-sm text-muted">{cat.links.length} 个链接</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(cat)}
                className="rounded px-3 py-1 text-sm text-primary hover:bg-primary/10"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="rounded px-3 py-1 text-sm text-danger hover:bg-danger/10"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
