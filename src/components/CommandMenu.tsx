/**
 * CommandMenu Component
 * 
 * Global command palette for keyboard-driven navigation and actions.
 * Accessible via CMD+K (Mac) or CTRL+K (Windows/Linux).
 * 
 * Features:
 * - Keyboard shortcut activation (CMD+K / CTRL+K)
 * - Fuzzy search across commands
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Grouped commands by category
 * - Icon support with Lucide icons
 * - Extensible command registry
 */

import React, { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export interface CommandAction {
  /** Unique command ID */
  id: string;
  /** Display label */
  label: string;
  /** Icon component (Lucide icon) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Search keywords */
  keywords?: string[];
  /** Action to execute */
  action: () => void;
  /** Optional keyboard shortcut display */
  shortcut?: string[];
}

export interface CommandGroup {
  /** Group heading */
  heading: string;
  /** Commands in this group */
  commands: CommandAction[];
}

export interface CommandMenuProps {
  /** Command groups to display */
  commandGroups: CommandGroup[];
  /** Optional placeholder text */
  placeholder?: string;
}

/**
 * CommandMenu Component
 * 
 * Global command palette with keyboard shortcut support.
 * 
 * @example
 * const commandGroups = [
 *   {
 *     heading: "Navigation",
 *     commands: [
 *       {
 *         id: "nav-dashboard",
 *         label: "Go to Dashboard",
 *         icon: Home,
 *         keywords: ["home", "dashboard"],
 *         action: () => navigate("/dashboard"),
 *         shortcut: ["g", "d"],
 *       },
 *     ],
 *   },
 *   {
 *     heading: "Actions",
 *     commands: [
 *       {
 *         id: "action-new",
 *         label: "Add New Item",
 *         icon: Plus,
 *         keywords: ["add", "new", "create"],
 *         action: () => openNewItemModal(),
 *         shortcut: ["n"],
 *       },
 *     ],
 *   },
 * ];
 * 
 * <CommandMenu commandGroups={commandGroups} />
 */
export function CommandMenu({
  commandGroups,
  placeholder = "Type a command or search...",
}: CommandMenuProps) {
  const [open, setOpen] = useState(false);

  // Listen for CMD+K / CTRL+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {commandGroups.map((group, groupIndex) => (
          <div key={group.heading}>
            <CommandGroup heading={group.heading}>
              {group.commands.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => handleSelect(command.action)}
                  keywords={command.keywords}
                >
                  {command.icon && (
                    <command.icon className="mr-2 h-4 w-4" />
                  )}
                  <span>{command.label}</span>
                  {command.shortcut && (
                    <div className="ml-auto flex gap-1">
                      {command.shortcut.map((key, index) => (
                        <kbd
                          key={index}
                          className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {groupIndex < commandGroups.length - 1 && <CommandSeparator />}
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/**
 * useCommandMenu Hook
 * 
 * Hook to programmatically control the command menu.
 * 
 * @example
 * const { openCommandMenu } = useCommandMenu();
 * 
 * <Button onClick={openCommandMenu}>
 *   Open Command Menu
 * </Button>
 */
export function useCommandMenu() {
  const [open, setOpen] = useState(false);

  const openCommandMenu = () => setOpen(true);
  const closeCommandMenu = () => setOpen(false);
  const toggleCommandMenu = () => setOpen((prev) => !prev);

  return {
    open,
    openCommandMenu,
    closeCommandMenu,
    toggleCommandMenu,
  };
}

/**
 * CommandMenuTrigger Component
 * 
 * Visual trigger button for the command menu.
 * Shows the keyboard shortcut hint.
 * 
 * @example
 * <CommandMenuTrigger />
 */
export function CommandMenuTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <span>Search...</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
