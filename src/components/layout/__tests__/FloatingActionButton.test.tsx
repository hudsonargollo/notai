/**
 * FloatingActionButton Component Tests
 * 
 * Tests for the FAB component with expandable secondary actions.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { FloatingActionButton, FABGroup } from "../FloatingActionButton";
import { Plus, Camera, FileText, Filter } from "lucide-react";

describe("FloatingActionButton", () => {
  describe("Basic Rendering", () => {
    it("renders with icon and label", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add new item"
          onClick={() => {}}
        />
      );

      const button = screen.getByRole("button", { name: "Add new item" });
      expect(button).toBeInTheDocument();
    });

    it("applies default size classes", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={() => {}}
        />
      );

      const button = screen.getByRole("button", { name: "Add" });
      expect(button).toHaveClass("h-14", "w-14");
    });

    it("applies large size classes when size is lg", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={() => {}}
          size="lg"
        />
      );

      const button = screen.getByRole("button", { name: "Add" });
      expect(button).toHaveClass("h-16", "w-16");
    });

    it("applies custom className", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={() => {}}
          className="custom-fab"
        />
      );

      const container = document.querySelector(".custom-fab");
      expect(container).toBeInTheDocument();
    });

    it("has rounded-full class for circular shape", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={() => {}}
        />
      );

      const button = screen.getByRole("button", { name: "Add" });
      expect(button).toHaveClass("rounded-full");
    });

    it("has shadow-lg class for elevation", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={() => {}}
        />
      );

      const button = screen.getByRole("button", { name: "Add" });
      expect(button).toHaveClass("shadow-lg");
    });
  });

  describe("Positioning", () => {
    it("is positioned fixed in bottom-right corner", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={() => {}}
        />
      );

      const container = document.querySelector(".fixed.bottom-6.right-6");
      expect(container).toBeInTheDocument();
    });

    it("has high z-index for proper stacking", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={() => {}}
        />
      );

      const container = document.querySelector(".z-50");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Click Behavior", () => {
    it("calls onClick when clicked without secondary actions", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={handleClick}
        />
      );

      const button = screen.getByRole("button", { name: "Add" });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("expands to show secondary actions when clicked with secondary actions", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
        {
          icon: FileText,
          label: "Manual",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      // Initially, secondary actions should not be visible
      expect(screen.queryByRole("button", { name: "Scan" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Manual" })).not.toBeInTheDocument();

      // Click to expand
      const primaryButton = screen.getByRole("button", { name: "Add" });
      await user.click(primaryButton);

      // Secondary actions should now be visible
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Scan" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Manual" })).toBeInTheDocument();
      });
    });

    it("collapses when primary button is clicked again", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      const primaryButton = screen.getByRole("button", { name: "Add" });

      // Expand
      await user.click(primaryButton);
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Scan" })).toBeInTheDocument();
      });

      // Collapse
      await user.click(primaryButton);
      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Scan" })).not.toBeInTheDocument();
      });
    });

    it("calls secondary action onClick and collapses", async () => {
      const user = userEvent.setup();
      const handleSecondaryClick = vi.fn();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: handleSecondaryClick,
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      // Expand
      const primaryButton = screen.getByRole("button", { name: "Add" });
      await user.click(primaryButton);

      // Click secondary action
      const secondaryButton = await screen.findByRole("button", { name: "Scan" });
      await user.click(secondaryButton);

      expect(handleSecondaryClick).toHaveBeenCalledTimes(1);

      // Should collapse after clicking secondary action
      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Scan" })).not.toBeInTheDocument();
      });
    });

    it("collapses when backdrop is clicked", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      // Expand
      const primaryButton = screen.getByRole("button", { name: "Add" });
      await user.click(primaryButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Scan" })).toBeInTheDocument();
      });

      // Click backdrop
      const backdrop = document.querySelector(".fixed.inset-0");
      expect(backdrop).toBeInTheDocument();
      
      if (backdrop) {
        await user.click(backdrop as HTMLElement);
      }

      // Should collapse
      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Scan" })).not.toBeInTheDocument();
      });
    });
  });

  describe("Secondary Actions", () => {
    it("renders multiple secondary actions", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
        {
          icon: FileText,
          label: "Manual",
          onClick: vi.fn(),
        },
        {
          icon: Filter,
          label: "Filter",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      // Expand
      const primaryButton = screen.getByRole("button", { name: "Add" });
      await user.click(primaryButton);

      // All secondary actions should be visible
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Scan" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Manual" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
      });
    });

    it("applies secondary button styling", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      // Expand
      const primaryButton = screen.getByRole("button", { name: "Add" });
      await user.click(primaryButton);

      // Check secondary button styling
      const secondaryButton = await screen.findByRole("button", { name: "Scan" });
      expect(secondaryButton).toHaveClass("h-12", "w-12", "rounded-full", "shadow-lg");
    });

    it("positions secondary actions above primary button", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      // Expand
      const primaryButton = screen.getByRole("button", { name: "Add" });
      await user.click(primaryButton);

      // Check positioning
      await waitFor(() => {
        const container = document.querySelector(".absolute.bottom-20");
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe("Animations", () => {
    it("rotates primary button when expanded", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      const primaryButton = screen.getByRole("button", { name: "Add" });

      // Initially not rotated
      expect(primaryButton).not.toHaveClass("rotate-45");

      // Expand
      await user.click(primaryButton);

      // Should be rotated
      await waitFor(() => {
        expect(primaryButton).toHaveClass("rotate-45");
      });
    });

    it("removes rotation when collapsed", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      const primaryButton = screen.getByRole("button", { name: "Add" });

      // Expand
      await user.click(primaryButton);
      await waitFor(() => {
        expect(primaryButton).toHaveClass("rotate-45");
      });

      // Collapse
      await user.click(primaryButton);
      await waitFor(() => {
        expect(primaryButton).not.toHaveClass("rotate-45");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA label on primary button", () => {
      render(
        <FloatingActionButton
          icon={Plus}
          label="Add new item"
          onClick={() => {}}
        />
      );

      const button = screen.getByRole("button", { name: "Add new item" });
      expect(button).toHaveAttribute("aria-label", "Add new item");
    });

    it("has proper ARIA labels on secondary buttons", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan receipt",
          onClick: vi.fn(),
        },
        {
          icon: FileText,
          label: "Manual entry",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      // Expand
      const primaryButton = screen.getByRole("button", { name: "Add" });
      await user.click(primaryButton);

      // Check ARIA labels
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Scan receipt" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Manual entry" })).toBeInTheDocument();
      });
    });

    it("has aria-expanded attribute", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      const primaryButton = screen.getByRole("button", { name: "Add" });

      // Initially collapsed
      expect(primaryButton).toHaveAttribute("aria-expanded", "false");

      // Expand
      await user.click(primaryButton);

      // Should be expanded
      await waitFor(() => {
        expect(primaryButton).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("is keyboard accessible", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={handleClick}
        />
      );

      const button = screen.getByRole("button", { name: "Add" });
      
      // Focus the button
      button.focus();
      expect(button).toHaveFocus();

      // Press Enter
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty secondary actions array", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={handleClick}
          secondaryActions={[]}
        />
      );

      const button = screen.getByRole("button", { name: "Add" });
      await user.click(button);

      // Should call onClick, not expand
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles missing onClick with secondary actions", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      const button = screen.getByRole("button", { name: "Add" });
      
      // Should not throw error
      await user.click(button);

      // Should expand
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Scan" })).toBeInTheDocument();
      });
    });

    it("handles rapid clicks", async () => {
      const user = userEvent.setup();
      const secondaryActions = [
        {
          icon: Camera,
          label: "Scan",
          onClick: vi.fn(),
        },
      ];

      render(
        <FloatingActionButton
          icon={Plus}
          label="Add"
          secondaryActions={secondaryActions}
        />
      );

      const button = screen.getByRole("button", { name: "Add" });

      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Should handle gracefully without errors
      expect(button).toBeInTheDocument();
    });
  });
});

describe("FABGroup", () => {
  it("renders children", () => {
    render(
      <FABGroup>
        <FloatingActionButton icon={Plus} label="Add" onClick={() => {}} />
        <FloatingActionButton icon={Filter} label="Filter" onClick={() => {}} />
      </FABGroup>
    );

    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
  });

  it("applies fixed positioning", () => {
    render(
      <FABGroup>
        <FloatingActionButton icon={Plus} label="Add" onClick={() => {}} />
      </FABGroup>
    );

    const container = document.querySelector(".fixed.bottom-6.right-6");
    expect(container).toBeInTheDocument();
  });

  it("stacks FABs vertically with gap", () => {
    render(
      <FABGroup>
        <FloatingActionButton icon={Plus} label="Add" onClick={() => {}} />
        <FloatingActionButton icon={Filter} label="Filter" onClick={() => {}} />
      </FABGroup>
    );

    const container = document.querySelector(".flex.flex-col.gap-3");
    expect(container).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <FABGroup className="custom-group">
        <FloatingActionButton icon={Plus} label="Add" onClick={() => {}} />
      </FABGroup>
    );

    const container = document.querySelector(".custom-group");
    expect(container).toBeInTheDocument();
  });

  it("has high z-index", () => {
    render(
      <FABGroup>
        <FloatingActionButton icon={Plus} label="Add" onClick={() => {}} />
      </FABGroup>
    );

    const container = document.querySelector(".z-50");
    expect(container).toBeInTheDocument();
  });

  it("handles multiple FABs independently", async () => {
    const handleAdd = vi.fn();
    const handleFilter = vi.fn();
    const user = userEvent.setup();

    render(
      <FABGroup>
        <FloatingActionButton icon={Plus} label="Add" onClick={handleAdd} />
        <FloatingActionButton icon={Filter} label="Filter" onClick={handleFilter} />
      </FABGroup>
    );

    const addButton = screen.getByRole("button", { name: "Add" });
    const filterButton = screen.getByRole("button", { name: "Filter" });

    await user.click(addButton);
    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleFilter).not.toHaveBeenCalled();

    await user.click(filterButton);
    expect(handleFilter).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
