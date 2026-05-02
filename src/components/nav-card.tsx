"use client";

import Image from "next/image";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  icon_url?: string | null;
}

export function NavCard({ link }: { link: LinkItem }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:bg-card-hover hover:shadow-md hover:border-primary/30"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {link.icon_url ? (
          <Image
            src={link.icon_url}
            alt={link.title}
            width={24}
            height={24}
            className="rounded"
            unoptimized
          />
        ) : (
          <span className="text-lg font-bold text-primary">
            {link.title.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {link.title}
        </div>
        {link.description && (
          <div className="text-sm text-muted truncate">{link.description}</div>
        )}
      </div>
    </a>
  );
}
