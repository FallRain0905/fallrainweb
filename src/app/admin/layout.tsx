"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FolderOpen, Link2, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((session) => {
        if (!session?.user) {
          router.push("/admin/login");
        } else {
          setChecked(true);
        }
      });
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!checked) return null;

  const nav = [
    { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
    { href: "/admin/categories", label: "分组管理", icon: FolderOpen },
    { href: "/admin/links", label: "链接管理", icon: Link2 },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col bg-sidebar text-sidebar-text">
        <div className="border-b border-white/10 px-4 py-5">
          <Link href="/admin" className="text-lg font-bold">
            Nav 管理
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                pathname === href
                  ? "bg-sidebar-hover text-white"
                  : "text-sidebar-text/70 hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-text/70 transition-colors hover:bg-sidebar-hover hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-background p-6">{children}</main>
    </div>
  );
}
