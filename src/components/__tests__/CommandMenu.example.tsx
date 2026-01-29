/**
 * CommandMenu Example
 * 
 * Demonstrates usage of the CommandMenu component with various command types.
 */

import React, { useState } from "react";
import { CommandMenu, CommandMenuTrigger } from "../CommandMenu";
import {
  Home,
  Settings,
  User,
  FileText,
  Plus,
  Search,
  Camera,
  DollarSign,
  BarChart,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

export function CommandMenuExample() {
  const [message, setMessage] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const commandGroups = [
    {
      heading: "Navigation",
      commands: [
        {
          id: "nav-dashboard",
          label: "Go to Dashboard",
          icon: Home,
          keywords: ["home", "dashboard", "main"],
          action: () => setMessage("Navigating to Dashboard..."),
          shortcut: ["g", "d"],
        },
        {
          id: "nav-profile",
          label: "View Profile",
          icon: User,
          keywords: ["profile", "account", "user"],
          action: () => setMessage("Opening Profile..."),
          shortcut: ["g", "p"],
        },
        {
          id: "nav-settings",
          label: "Open Settings",
          icon: Settings,
          keywords: ["settings", "preferences", "config"],
          action: () => setMessage("Opening Settings..."),
          shortcut: ["g", "s"],
        },
        {
          id: "nav-reports",
          label: "View Reports",
          icon: BarChart,
          keywords: ["reports", "analytics", "stats"],
          action: () => setMessage("Opening Reports..."),
          shortcut: ["g", "r"],
        },
      ],
    },
    {
      heading: "Actions",
      commands: [
        {
          id: "action-new-expense",
          label: "Add New Expense",
          icon: Plus,
          keywords: ["add", "new", "create", "expense"],
          action: () => setMessage("Creating new expense..."),
          shortcut: ["n", "e"],
        },
        {
          id: "action-scan",
          label: "Scan Receipt",
          icon: Camera,
          keywords: ["scan", "camera", "receipt", "photo"],
          action: () => setMessage("Opening camera..."),
          shortcut: ["s"],
        },
        {
          id: "action-search",
          label: "Search Transactions",
          icon: Search,
          keywords: ["search", "find", "transactions"],
          action: () => setMessage("Opening search..."),
          shortcut: ["/"],
        },
        {
          id: "action-budget",
          label: "Set Budget",
          icon: DollarSign,
          keywords: ["budget", "limit", "spending"],
          action: () => setMessage("Opening budget settings..."),
          shortcut: ["b"],
        },
      ],
    },
    {
      heading: "Preferences",
      commands: [
        {
          id: "pref-theme",
          label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
          icon: theme === "dark" ? Sun : Moon,
          keywords: ["theme", "dark", "light", "mode"],
          action: () => {
            const newTheme = theme === "dark" ? "light" : "dark";
            setTheme(newTheme);
            setMessage(`Switched to ${newTheme} mode`);
          },
          shortcut: ["t"],
        },
        {
          id: "pref-export",
          label: "Export Data",
          icon: FileText,
          keywords: ["export", "download", "data", "backup"],
          action: () => setMessage("Exporting data..."),
        },
        {
          id: "pref-logout",
          label: "Log Out",
          icon: LogOut,
          keywords: ["logout", "signout", "exit"],
          action: () => setMessage("Logging out..."),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Command Menu Example</h1>
          <p className="text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘K</kbd> or{" "}
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd> to open the
            command menu
          </p>
        </div>

        {/* Trigger Button */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Visual Trigger</h2>
          <p className="text-sm text-muted-foreground mb-4">
            You can also click this button to open the command menu:
          </p>
          <CommandMenuTrigger />
        </div>

        {/* Message Display */}
        {message && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Available Commands */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Commands</h2>
          
          {commandGroups.map((group) => (
            <div key={group.heading} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {group.heading}
              </h3>
              <div className="grid gap-2">
                {group.commands.map((command) => (
                  <div
                    key={command.id}
                    className="flex items-center justify-between p-3 bg-card border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {command.icon && (
                        <command.icon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{command.label}</span>
                    </div>
                    {command.shortcut && (
                      <div className="flex gap-1">
                        {command.shortcut.map((key, index) => (
                          <kbd
                            key={index}
                            className="px-2 py-1 bg-muted rounded text-xs font-mono"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Features</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Keyboard shortcut activation (⌘K / Ctrl+K)</li>
            <li>✓ Fuzzy search across all commands</li>
            <li>✓ Keyword-based search</li>
            <li>✓ Arrow key navigation</li>
            <li>✓ Enter to execute, Escape to close</li>
            <li>✓ Grouped commands with separators</li>
            <li>✓ Icon support with Lucide icons</li>
            <li>✓ Keyboard shortcut hints</li>
            <li>✓ Accessible with proper ARIA attributes</li>
          </ul>
        </div>

        {/* Usage Tips */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Usage Tips</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Search by label:</strong> Type "dashboard" to find "Go to Dashboard"
            </p>
            <p>
              <strong>Search by keywords:</strong> Type "home" to find "Go to Dashboard"
              (keyword match)
            </p>
            <p>
              <strong>Navigate:</strong> Use ↑ and ↓ arrow keys to move through results
            </p>
            <p>
              <strong>Execute:</strong> Press Enter or click to run a command
            </p>
            <p>
              <strong>Close:</strong> Press Escape or click outside to close
            </p>
          </div>
        </div>
      </div>

      {/* Command Menu Component */}
      <CommandMenu commandGroups={commandGroups} />
    </div>
  );
}

/**
 * Minimal Example
 * 
 * Shows the simplest possible implementation.
 */
export function MinimalCommandMenuExample() {
  const commandGroups = [
    {
      heading: "Quick Actions",
      commands: [
        {
          id: "action-1",
          label: "Action One",
          action: () => alert("Action One executed!"),
        },
        {
          id: "action-2",
          label: "Action Two",
          action: () => alert("Action Two executed!"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Minimal Command Menu</h1>
        <p className="text-muted-foreground mb-8">
          Press ⌘K or Ctrl+K to open
        </p>
        <CommandMenu commandGroups={commandGroups} />
      </div>
    </div>
  );
}

/**
 * Integration Example
 * 
 * Shows how to integrate with routing and state management.
 */
export function IntegratedCommandMenuExample() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [notifications, setNotifications] = useState(3);

  const commandGroups = [
    {
      heading: "Navigation",
      commands: [
        {
          id: "nav-dashboard",
          label: "Dashboard",
          icon: Home,
          action: () => setCurrentPage("dashboard"),
          shortcut: ["g", "d"],
        },
        {
          id: "nav-settings",
          label: "Settings",
          icon: Settings,
          action: () => setCurrentPage("settings"),
          shortcut: ["g", "s"],
        },
      ],
    },
    {
      heading: "Actions",
      commands: [
        {
          id: "clear-notifications",
          label: `Clear Notifications (${notifications})`,
          icon: FileText,
          action: () => setNotifications(0),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Integrated Example</h1>
          <p className="text-muted-foreground">
            Current page: <strong>{currentPage}</strong>
          </p>
          <p className="text-muted-foreground">
            Notifications: <strong>{notifications}</strong>
          </p>
        </div>
        <CommandMenuTrigger />
        <CommandMenu commandGroups={commandGroups} />
      </div>
    </div>
  );
}

export default CommandMenuExample;
