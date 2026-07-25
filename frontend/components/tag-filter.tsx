"use client";
import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDown, Tags } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Badge } from "@/components/ui/badge";

import { X } from "lucide-react";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagFilter({
  tags,
  selectedTags,
  onChange,
}: TagFilterProps) {
  const [open, setOpen] = useState(false);
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(selectedTags);
  useEffect(() => {
    setTempSelectedTags(selectedTags);
  }, [selectedTags]);
 const toggleTag = (tag: string) => {
    if (tempSelectedTags.includes(tag)) {
      setTempSelectedTags(
        tempSelectedTags.filter((t) => t !== tag)
      );
    } else {
      setTempSelectedTags([...tempSelectedTags, tag]);
    }
  };
  return (
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="w-[220px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Tags className="h-4 w-4" />
          <div className="flex items-center gap-1 overflow-hidden">
            {selectedTags.length === 0 ? (
              <span>All Tags</span>
            ) : (
              <>
                {selectedTags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="max-w-20 truncate"
                  >
                    {tag}
                  </Badge>
                ))}

                {selectedTags.length > 2 && (
                  <Badge variant="outline">
                    +{selectedTags.length - 2}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        <ChevronDown className="h-4 w-4 opacity-60" />
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-80 p-0">
      <Command>
        <CommandInput placeholder="Search tags..." />

        <CommandList
          className="
            max-h-64
            overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30
            [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50
          "
        >
          <CommandEmpty>No tags found.</CommandEmpty>

          <CommandGroup heading={`${tempSelectedTags.length} Selected`}>
            {tags.map((tag) => (
              <CommandItem
                key={tag}
                onSelect={() => toggleTag(tag)}
                className="
                            data-[selected=true]:bg-muted
                            data-[selected=true]:text-foreground
                          "
               >
                <div className="flex w-full items-center gap-2">
                  <Checkbox checked={tempSelectedTags.includes(tag)} />
                  <span>{tag}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <div className="flex items-center justify-between border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTempSelectedTags([])}
        >
          Clear All
        </Button>

        <Button
          size="sm"
          onClick={() => {
            onChange(tempSelectedTags);
            setOpen(false);
          }}
        >
          Apply
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);
}