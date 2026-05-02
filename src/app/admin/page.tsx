"use client";

import { useEffect, useState } from "react";

interface Stats {
  categories: number;
  links: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ categories: 0, links: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/links").then((r) => r.json()),
    ]).then(([cats, links]) => {
      setStats({ categories: cats.length, links: links.length });
    });
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">仪表盘</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-sm text-muted">分组数</div>
          <div className="mt-1 text-3xl font-bold text-foreground">
            {stats.categories}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-sm text-muted">链接数</div>
          <div className="mt-1 text-3xl font-bold text-foreground">
            {stats.links}
          </div>
        </div>
      </div>
    </div>
  );
}
