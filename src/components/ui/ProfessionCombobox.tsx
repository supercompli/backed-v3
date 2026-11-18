"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProfessionOption {
  slug: string;
  name: string;
}

export function ProfessionCombobox({
  options,
  value,
  onChange,
  placeholder = "Start typing your profession…",
  inputClassName,
  id,
}: {
  options: ProfessionOption[];
  value: string;
  onChange: (slug: string) => void;
  placeholder?: string;
  inputClassName?: string;
  id?: string;
}) {
  const selected = options.find((o) => o.slug === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selected?.name ?? "");
  }, [selected?.name]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery(selected?.name ?? "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected?.name]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 50);
    return options.filter((o) => o.name.toLowerCase().includes(q)).slice(0, 50);
  }, [options, query]);

  function selectOption(option: ProfessionOption) {
    onChange(option.slug);
    setQuery(option.name);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((h) => Math.min(h + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = matches[highlighted];
      if (option) selectOption(option);
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery(selected?.name ?? "");
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setHighlighted(0);
          if (value) onChange("");
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={inputClassName}
      />
      {open && matches.length > 0 ? (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-md border border-border bg-white shadow-lg">
          {matches.map((option, index) => (
            <li key={option.slug}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
                className={cn(
                  "block w-full px-3 py-2.5 text-left text-sm text-text-dark hover:bg-soft-green",
                  index === highlighted && "bg-soft-green",
                )}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {open && query.trim() && matches.length === 0 ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-border bg-white px-3 py-2.5 text-sm text-text-secondary shadow-lg">
          No matching profession. Try a different search term.
        </div>
      ) : null}
    </div>
  );
}
