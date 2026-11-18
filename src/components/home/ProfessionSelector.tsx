"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { professionSelectorList } from "@/data/professions";
import { Button } from "@/components/ui/Button";
import { ProfessionCombobox } from "@/components/ui/ProfessionCombobox";

export function ProfessionSelector() {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(slug ? `/quote?profession=${slug}` : "/quote");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-border p-2.5 flex flex-col sm:flex-row gap-2.5 shadow-sm"
    >
      <label htmlFor="profession-select" className="sr-only">
        What do you do?
      </label>
      <div className="flex-1">
        <ProfessionCombobox
          id="profession-select"
          options={professionSelectorList}
          value={slug}
          onChange={setSlug}
          placeholder="What do you do? Start typing your profession"
          inputClassName="w-full bg-transparent px-4 py-3.5 text-[15px] text-text-dark rounded-md outline-none border border-border"
        />
      </div>
      <Button type="submit" size="lg" className="sm:w-auto w-full">
        Get My Quote
      </Button>
    </form>
  );
}
