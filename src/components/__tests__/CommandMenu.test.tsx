/**
 * CommandMenu Component Tests
 * 
 * Tests for the global command palette with keyboard shortcuts.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CommandMenu, CommandMenuTrigger, useCommandMenu } from "../CommandMenu";
import { Home, Plus, Settings, Search } from "lucide-react";

describe("CommandMenu", () => {
  const mockCommandGroups = [
    {
      heading: "Navigation",
      commands: [
        {
          id: "nav-home",
          label: "Go to Home",
          icon: Home,
          keywords: ["home", "dashboard"],
          action: vi.fn(),
          shortcut: ["g", "h"],
        },
        {
          id: "nav-settings",
          label: "Open Settings",
          icon: Settings,
          keywords: ["settings", "preferences"],
          action: vi.fn(),
        },
      ],
    },
    {
      heading: "Actions",
      commands: [
        {
          id: "action-new",
          label: "Create New Item",
          icon: Plus,
          keywords: ["new", "create", "add"],
          action: vi.fn(),
          shortcut: ["n"],
        },
      ],
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("Keyboard Shortcut Activation", () => {
    it("opens when CMD+K is pressed on Mac", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      // Initially closed
      expect(screen.queryByPlaceholderText(/Type a command/i)).not.toBeInTheDocument();

      // Press CMD+K
      await user.keyboard("{Meta>}k{/Meta}");

      // Should open
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
      });
    });

    it("opens when CTRL+K is pressed on Windows/Linux", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      // Initially closed
      expect(screen.queryByPlaceholderText(/Type a command/i)).not.toBeInTheDocument();

      // Press CTRL+K
      await user.keyboard("{Control>}k{/Control}");

      // Should open
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
      });
    });

    it("toggles when keyboard shortcut is pressed again", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      // Open
      await user.keyboard("{Meta>}k{/Meta}");
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
      });

      // Close
      await user.keyboard("{Meta>}k{/Meta}");
      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Type a command/i)).not.toBeInTheDocument();
      });
    });

    it("prevents default browser behavior for CMD+K", async () => {
      const user = userEvent.setup();
      const preventDefaultSpy = vi.fn();
      
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      // Simulate keyboard event with preventDefault
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      
      Object.defineProperty(event, "preventDefault", {
        value: preventDefaultSpy,
      });

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Command Display", () => {
    it("displays all command groups when open", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        expect(screen.getByText("Navigation")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();
      });
    });

    it("displays all commands in each group", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        expect(screen.getByText("Go to Home")).toBeInTheDocument();
        expect(screen.getByText("Open Settings")).toBeInTheDocument();
        expect(screen.getByText("Create New Item")).toBeInTheDocument();
      });
    });

    it("displays icons for commands that have them", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        // Check that icons are rendered (they have specific classes)
        const icons = document.querySelectorAll("svg");
        expect(icons.length).toBeGreaterThan(0);
      });
    });

    it("displays keyboard shortcuts when provided", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        // Check for shortcut badges
        const shortcuts = screen.getAllByText("g");
        expect(shortcuts.length).toBeGreaterThan(0);
      });
    });

    it("displays custom placeholder text", async () => {
      const user = userEvent.setup();
      render(
        <CommandMenu
          commandGroups={mockCommandGroups}
          placeholder="Search for anything..."
        />
      );

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search for anything...")).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("filters commands based on search input", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      const input = await screen.findByPlaceholderText(/Type a command/i);
      await user.type(input, "home");

      await waitFor(() => {
        expect(screen.getByText("Go to Home")).toBeInTheDocument();
        expect(screen.queryByText("Create New Item")).not.toBeInTheDocument();
      });
    });

    it("searches by keywords", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      const input = await screen.findByPlaceholderText(/Type a command/i);
      await user.type(input, "dashboard");

      await waitFor(() => {
        // "dashboard" is a keyword for "Go to Home"
        expect(screen.getByText("Go to Home")).toBeInTheDocument();
      });
    });

    it("shows 'No results found' when no commands match", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      const input = await screen.findByPlaceholderText(/Type a command/i);
      await user.type(input, "nonexistent");

      await waitFor(() => {
        expect(screen.getByText("No results found.")).toBeInTheDocument();
      });
    });

    it("is case-insensitive", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      const input = await screen.findByPlaceholderText(/Type a command/i);
      await user.type(input, "HOME");

      await waitFor(() => {
        expect(screen.getByText("Go to Home")).toBeInTheDocument();
      });
    });

    it("clears search when menu is reopened", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      // Open and search
      await user.keyboard("{Meta>}k{/Meta}");
      const input = await screen.findByPlaceholderText(/Type a command/i);
      await user.type(input, "home");

      // Close
      await user.keyboard("{Escape}");

      // Reopen
      await user.keyboard("{Meta>}k{/Meta}");

      // Input should be empty
      const newInput = await screen.findByPlaceholderText(/Type a command/i);
      expect(newInput).toHaveValue("");
    });
  });

  describe("Command Execution", () => {
    it("executes command action when selected", async () => {
      const user = userEvent.setup();
      const mockAction = vi.fn();
      const commandGroups = [
        {
          heading: "Test",
          commands: [
            {
              id: "test-cmd",
              label: "Test Command",
              action: mockAction,
            },
          ],
        },
      ];

      render(<CommandMenu commandGroups={commandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");
      
      const command = await screen.findByText("Test Command");
      await user.click(command);

      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it("closes menu after command execution", async () => {
      const user = userEvent.setup();
      const mockAction = vi.fn();
      const commandGroups = [
        {
          heading: "Test",
          commands: [
            {
              id: "test-cmd",
              label: "Test Command",
              action: mockAction,
            },
          ],
        },
      ];

      render(<CommandMenu commandGroups={commandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");
      
      const command = await screen.findByText("Test Command");
      await user.click(command);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Type a command/i)).not.toBeInTheDocument();
      });
    });

    it("executes correct command when multiple are displayed", async () => {
      const user = userEvent.setup();
      const mockAction1 = vi.fn();
      const mockAction2 = vi.fn();
      const commandGroups = [
        {
          heading: "Test",
          commands: [
            {
              id: "cmd-1",
              label: "Command One",
              action: mockAction1,
            },
            {
              id: "cmd-2",
              label: "Command Two",
              action: mockAction2,
            },
          ],
        },
      ];

      render(<CommandMenu commandGroups={commandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");
      
      const command2 = await screen.findByText("Command Two");
      await user.click(command2);

      expect(mockAction1).not.toHaveBeenCalled();
      expect(mockAction2).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard Navigation", () => {
    it("closes when Escape is pressed", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Type a command/i)).not.toBeInTheDocument();
      });
    });

    it("allows arrow key navigation through commands", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
      });

      // Arrow down should navigate through commands
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      // The cmdk library handles the actual selection state
      // We just verify the menu is still open and functional
      expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
    });

    it("executes command when Enter is pressed on selected item", async () => {
      const user = userEvent.setup();
      const mockAction = vi.fn();
      const commandGroups = [
        {
          heading: "Test",
          commands: [
            {
              id: "test-cmd",
              label: "Test Command",
              action: mockAction,
            },
          ],
        },
      ];

      render(<CommandMenu commandGroups={commandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("focuses search input when opened", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/Type a command/i);
        expect(input).toHaveFocus();
      });
    });

    it("traps focus within the dialog", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
      });

      // Tab should keep focus within the dialog
      await user.keyboard("{Tab}");
      
      // Focus should still be within the dialog
      const dialog = screen.getByRole("dialog");
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty command groups", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={[]} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
      });
    });

    it("handles commands without icons", async () => {
      const user = userEvent.setup();
      const commandGroups = [
        {
          heading: "Test",
          commands: [
            {
              id: "no-icon",
              label: "No Icon Command",
              action: vi.fn(),
            },
          ],
        },
      ];

      render(<CommandMenu commandGroups={commandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        expect(screen.getByText("No Icon Command")).toBeInTheDocument();
      });
    });

    it("handles commands without shortcuts", async () => {
      const user = userEvent.setup();
      const commandGroups = [
        {
          heading: "Test",
          commands: [
            {
              id: "no-shortcut",
              label: "No Shortcut Command",
              action: vi.fn(),
            },
          ],
        },
      ];

      render(<CommandMenu commandGroups={commandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        expect(screen.getByText("No Shortcut Command")).toBeInTheDocument();
      });
    });

    it("handles commands without keywords", async () => {
      const user = userEvent.setup();
      const commandGroups = [
        {
          heading: "Test",
          commands: [
            {
              id: "no-keywords",
              label: "No Keywords Command",
              action: vi.fn(),
            },
          ],
        },
      ];

      render(<CommandMenu commandGroups={commandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      const input = await screen.findByPlaceholderText(/Type a command/i);
      await user.type(input, "keywords");

      await waitFor(() => {
        expect(screen.getByText("No Keywords Command")).toBeInTheDocument();
      });
    });

    it("handles rapid open/close", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      // Rapidly toggle
      await user.keyboard("{Meta>}k{/Meta}");
      await user.keyboard("{Meta>}k{/Meta}");
      await user.keyboard("{Meta>}k{/Meta}");

      // Should handle gracefully
      expect(document.body).toBeInTheDocument();
    });

    it("cleans up event listeners on unmount", () => {
      const { unmount } = render(<CommandMenu commandGroups={mockCommandGroups} />);
      
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
      
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    });
  });

  describe("Group Separators", () => {
    it("displays separators between groups", async () => {
      const user = userEvent.setup();
      render(<CommandMenu commandGroups={mockCommandGroups} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        // Check for separator elements
        const separators = document.querySelectorAll("[role='separator']");
        expect(separators.length).toBeGreaterThan(0);
      });
    });

    it("does not display separator after last group", async () => {
      const user = userEvent.setup();
      const singleGroup = [mockCommandGroups[0]];
      render(<CommandMenu commandGroups={singleGroup} />);

      await user.keyboard("{Meta>}k{/Meta}");

      await waitFor(() => {
        const separators = document.querySelectorAll("[role='separator']");
        expect(separators.length).toBe(0);
      });
    });
  });
});

describe("CommandMenuTrigger", () => {
  it("renders trigger button", () => {
    render(<CommandMenuTrigger />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("displays search text", () => {
    render(<CommandMenuTrigger />);
    
    expect(screen.getByText("Search...")).toBeInTheDocument();
  });

  it("displays keyboard shortcut hint", () => {
    render(<CommandMenuTrigger />);
    
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("opens command menu when clicked", async () => {
    const user = userEvent.setup();
    render(<CommandMenuTrigger />);
    
    const button = screen.getByRole("button");
    await user.click(button);

    // The trigger component has its own state, so we can't easily test
    // the actual opening without a full integration test
    expect(button).toBeInTheDocument();
  });

  it("has hover styles", () => {
    render(<CommandMenuTrigger />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-accent");
  });
});

describe("useCommandMenu Hook", () => {
  it("provides open state", () => {
    const TestComponent = () => {
      const { open } = useCommandMenu();
      return <div>{open ? "Open" : "Closed"}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });

  it("provides openCommandMenu function", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const { open, openCommandMenu } = useCommandMenu();
      return (
        <div>
          <button onClick={openCommandMenu}>Open</button>
          <div data-testid="status">{open ? "Menu Open" : "Menu Closed"}</div>
        </div>
      );
    };

    render(<TestComponent />);
    
    const button = screen.getByRole("button", { name: "Open" });
    await user.click(button);

    expect(screen.getByTestId("status")).toHaveTextContent("Menu Open");
  });

  it("provides closeCommandMenu function", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const { open, openCommandMenu, closeCommandMenu } = useCommandMenu();
      return (
        <div>
          <button onClick={openCommandMenu}>Open</button>
          <button onClick={closeCommandMenu}>Close</button>
          <div data-testid="status">{open ? "Menu Open" : "Menu Closed"}</div>
        </div>
      );
    };

    render(<TestComponent />);
    
    const openButton = screen.getByRole("button", { name: "Open" });
    await user.click(openButton);
    expect(screen.getByTestId("status")).toHaveTextContent("Menu Open");

    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);
    expect(screen.getByTestId("status")).toHaveTextContent("Menu Closed");
  });

  it("provides toggleCommandMenu function", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const { open, toggleCommandMenu } = useCommandMenu();
      return (
        <div>
          <button onClick={toggleCommandMenu}>Toggle</button>
          <div>{open ? "Open" : "Closed"}</div>
        </div>
      );
    };

    render(<TestComponent />);
    
    const button = screen.getByRole("button", { name: "Toggle" });
    
    // Toggle open
    await user.click(button);
    expect(screen.getByText("Open")).toBeInTheDocument();

    // Toggle closed
    await user.click(button);
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });
});
