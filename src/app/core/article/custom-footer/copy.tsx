"use client";
import { Button } from "@/components/ui/button";
import emitter from "@/lib/emitter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyIcon } from "lucide-react";

type CopyFormat = "HTML" | "JSON" | "Markdown";

export default function CopyFormatSelector() {

  const handleFormatSelect = (format: CopyFormat) => {
    switch (format) {
      case "HTML":
        emitter.emit('toolbar-copy-html');
        break;
      case "JSON":
        emitter.emit('toolbar-copy-json');
        break;
      case "Markdown":
        emitter.emit('toolbar-copy-markdown');
        break;
    }
  };

  return (
    <div className="items-center gap-1 hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost"
            size="icon" 
            className="outline-none"
          >
            <CopyIcon className="!size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="top" 
          align="start"
          className="min-w-[6rem]"
        >
          <DropdownMenuItem onClick={() => handleFormatSelect("HTML")}>
            HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatSelect("JSON")}>
            JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatSelect("Markdown")}>
            Markdown
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}