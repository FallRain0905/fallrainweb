"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative mx-auto max-w-xl transition-all ${
        focused ? "max-w-2xl" : ""
      }`}
    >
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="搜索书签..."
        className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-10 text-foreground placeholder:text-muted outline-none transition-all focus:border-primary focus:shadow-lg focus:shadow-primary/5"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
