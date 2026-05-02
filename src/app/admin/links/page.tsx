"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  icon?: string | null;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  icon_url?: string | null;
  category_id: string;
  category: Category;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [catId, setCatId] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    const [linksRes, catsRes] = await Promise.all([
      fetch("/api/links").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setLinks(linksRes);
    setCategories(catsRes);
    if (!catId && catsRes.length > 0) setCatId(catsRes[0].id);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          title,
          url,
          description: desc || null,
          category_id: catId,
        }),
      });
    } else {
      await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url,
          description: desc || null,
          category_id: catId,
        }),
      });
    }
    setTitle("");
    setUrl("");
    setDesc("");
    setEditId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除？")) return;
    await fetch("/api/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function startEdit(link: LinkItem) {
    setEditId(link.id);
    setTitle(link.title);
    setUrl(link.url);
    setDesc(link.description || "");
    setCatId(link.category_id);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">链接管理</h1>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-muted">
          请先前往{" "}
          <a href="/admin/categories" className="text-primary hover:underline">
            分组管理
          </a>{" "}
          创建至少一个分组
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-muted">标题</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
                placeholder="https://"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">描述</label>
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">分组</label>
              <select
                value={catId}
                onChange={(e) => setCatId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              {editId ? "保存" : "添加"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setUrl("");
                  setDesc("");
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
              >
                取消
              </button>
            )}
          </div>
        </form>
      )}

      <div className="space-y-2">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{link.title}</span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {link.category.name}
                </span>
              </div>
              <div className="truncate text-sm text-muted">{link.url}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(link)}
                className="rounded px-3 py-1 text-sm text-primary hover:bg-primary/10"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(link.id)}
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
