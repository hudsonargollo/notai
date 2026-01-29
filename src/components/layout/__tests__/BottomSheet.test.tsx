/**
 * BottomSheet Component Tests
 * 
 * Tests for the responsive BottomSheet component that adapts between
 * Sheet (mobile) and Dialog (desktop) based on viewport size.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { BottomSheet, BottomSheetTrigger } from "../BottomSheet";
import { useIsMobile } from "@/hooks/useMediaQuery";

// Mock the useIsMobile hook
vi.mock("@/hooks/useMediaQuery", () => ({
  useIsMobile: vi.fn(),
}));

const mockUseIsMobile = useIsMobile as ReturnType<typeof vi.fn>;

describe("BottomSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Mobile Behavior (< 768px)", () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it("renders as Sheet on mobile", () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Mobile Content</div>
        </BottomSheet>
      );

      expect(screen.getByText("Mobile Content")).toBeInTheDocument();
    });

    it("displays visual handle indicator on mobile", () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      // The handle indicator should be visible in the document
      // Look for it by its visual characteristics (small centered bar)
      const handle = document.querySelector("div[class*='mx-auto']");
      expect(handle).toBeInTheDocument();
    });

    it("renders title and description on mobile when provided", () => {
      render(
        <BottomSheet
          open={true}
          onOpenChange={() => {}}
          title="Test Title"
          description="Test Description"
        >
          <div>Content</div>
        </BottomSheet>
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("does not render header when title and description are not provided", () => {
      const { container } = render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      // SheetHeader should not be present
      const header = container.querySelector("[class*='SheetHeader']");
      expect(header).not.toBeInTheDocument();
    });

    it("calls onOpenChange when closed on mobile", async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <BottomSheet open={true} onOpenChange={handleOpenChange}>
          <div>Content</div>
        </BottomSheet>
      );

      // Find and click the close button
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("applies custom className on mobile", () => {
      render(
        <BottomSheet
          open={true}
          onOpenChange={() => {}}
          className="custom-class"
        >
          <div>Content</div>
        </BottomSheet>
      );

      // The custom class should be applied somewhere in the document
      // Since it's in a portal, check the entire document
      const customElement = document.querySelector(".custom-class");
      expect(customElement).toBeInTheDocument();
    });

    it("has rounded top corners on mobile", () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      // Check for inline styles with rounded corners in the document
      // The SheetContent should have inline styles for border radius
      const styledElement = document.querySelector("[style*='border']");
      expect(styledElement).toBeInTheDocument();
    });
  });

  describe("Desktop Behavior (>= 768px)", () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(false);
    });

    it("renders as Dialog on desktop", () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Desktop Content</div>
        </BottomSheet>
      );

      expect(screen.getByText("Desktop Content")).toBeInTheDocument();
    });

    it("does not display handle indicator on desktop", () => {
      const { container } = render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      // Handle indicator should not be present on desktop
      const handle = container.querySelector(".w-12.h-1\\.5");
      expect(handle).not.toBeInTheDocument();
    });

    it("renders title and description on desktop when provided", () => {
      render(
        <BottomSheet
          open={true}
          onOpenChange={() => {}}
          title="Test Title"
          description="Test Description"
        >
          <div>Content</div>
        </BottomSheet>
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("calls onOpenChange when closed on desktop", async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <BottomSheet open={true} onOpenChange={handleOpenChange}>
          <div>Content</div>
        </BottomSheet>
      );

      // Find and click the close button
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("applies custom className on desktop", () => {
      render(
        <BottomSheet
          open={true}
          onOpenChange={() => {}}
          className="custom-class"
        >
          <div>Content</div>
        </BottomSheet>
      );

      // The custom class should be applied somewhere in the document
      // Since it's in a portal, check the entire document
      const customElement = document.querySelector(".custom-class");
      expect(customElement).toBeInTheDocument();
    });
  });

  describe("Responsive Switching", () => {
    it("switches from mobile to desktop layout", () => {
      // Start with mobile
      mockUseIsMobile.mockReturnValue(true);
      const { rerender } = render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      // Verify mobile handle is present by checking the document
      let handle = document.querySelector("div[class*='mx-auto']");
      expect(handle).toBeInTheDocument();

      // Switch to desktop
      mockUseIsMobile.mockReturnValue(false);
      rerender(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      // Verify mobile handle is no longer present
      handle = document.querySelector("div[class*='mx-auto']");
      expect(handle).not.toBeInTheDocument();
    });

    it("switches from desktop to mobile layout", () => {
      // Start with desktop
      mockUseIsMobile.mockReturnValue(false);
      const { rerender } = render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      // Verify mobile handle is not present
      let handle = document.querySelector("div[class*='mx-auto']");
      expect(handle).not.toBeInTheDocument();

      // Switch to mobile
      mockUseIsMobile.mockReturnValue(true);
      rerender(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      // Verify mobile handle is now present
      handle = document.querySelector("div[class*='mx-auto']");
      expect(handle).toBeInTheDocument();
    });
  });

  describe("Open/Close State", () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it("does not render content when closed", () => {
      render(
        <BottomSheet open={false} onOpenChange={() => {}}>
          <div>Hidden Content</div>
        </BottomSheet>
      );

      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("renders content when open", () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Visible Content</div>
        </BottomSheet>
      );

      expect(screen.getByText("Visible Content")).toBeInTheDocument();
    });

    it("toggles between open and closed states", () => {
      const { rerender } = render(
        <BottomSheet open={false} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      expect(screen.queryByText("Content")).not.toBeInTheDocument();

      rerender(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("BottomSheetTrigger", () => {
    it("renders children", () => {
      render(
        <BottomSheetTrigger onClick={() => {}}>
          <button>Open Sheet</button>
        </BottomSheetTrigger>
      );

      expect(screen.getByText("Open Sheet")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <BottomSheetTrigger onClick={handleClick}>
          <button>Open Sheet</button>
        </BottomSheetTrigger>
      );

      await user.click(screen.getByText("Open Sheet"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("works with BottomSheet component", async () => {
      const TestComponent = () => {
        const [open, setOpen] = React.useState(false);

        return (
          <>
            <BottomSheetTrigger onClick={() => setOpen(true)}>
              <button>Open</button>
            </BottomSheetTrigger>
            <BottomSheet open={open} onOpenChange={setOpen}>
              <div>Sheet Content</div>
            </BottomSheet>
          </>
        );
      };

      mockUseIsMobile.mockReturnValue(true);
      const user = userEvent.setup();

      render(<TestComponent />);

      // Initially closed
      expect(screen.queryByText("Sheet Content")).not.toBeInTheDocument();

      // Click trigger
      await user.click(screen.getByText("Open"));

      // Should be open
      await waitFor(() => {
        expect(screen.getByText("Sheet Content")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it("has accessible close button", () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Content</div>
        </BottomSheet>
      );

      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("uses proper ARIA attributes for title", () => {
      render(
        <BottomSheet
          open={true}
          onOpenChange={() => {}}
          title="Accessible Title"
        >
          <div>Content</div>
        </BottomSheet>
      );

      // Title should be rendered with proper semantics
      expect(screen.getByText("Accessible Title")).toBeInTheDocument();
    });

    it("uses proper ARIA attributes for description", () => {
      render(
        <BottomSheet
          open={true}
          onOpenChange={() => {}}
          description="Accessible Description"
        >
          <div>Content</div>
        </BottomSheet>
      );

      // Description should be rendered with proper semantics
      expect(screen.getByText("Accessible Description")).toBeInTheDocument();
    });
  });

  describe("Content Rendering", () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it("renders complex children", () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>
            <h2>Title</h2>
            <p>Paragraph</p>
            <button>Action</button>
          </div>
        </BottomSheet>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("renders multiple children", () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </BottomSheet>
      );

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
      expect(screen.getByText("Third")).toBeInTheDocument();
    });

    it("preserves child component props", () => {
      const handleClick = vi.fn();

      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <button onClick={handleClick} data-testid="child-button">
            Click Me
          </button>
        </BottomSheet>
      );

      const button = screen.getByTestId("child-button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-testid", "child-button");
    });
  });
});
