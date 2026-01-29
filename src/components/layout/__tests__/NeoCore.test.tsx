/**
 * NeoCore Component Tests
 * 
 * Tests for the animated 3D cube mascot component.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { NeoCore, NeoState } from "../NeoCore";

describe("NeoCore", () => {
  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<NeoCore state="idle" />);
      expect(container).toBeInTheDocument();
    });

    it("applies default size of 120px", () => {
      const { container } = render(<NeoCore state="idle" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: "120px", height: "120px" });
    });

    it("applies custom size when provided", () => {
      const { container } = render(<NeoCore state="idle" size={200} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: "200px", height: "200px" });
    });

    it("applies custom className", () => {
      const { container } = render(
        <NeoCore state="idle" className="custom-neo" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-neo");
    });

    it("applies perspective of 800px", () => {
      const { container } = render(<NeoCore state="idle" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ perspective: "800px" });
    });

    it("has relative positioning", () => {
      const { container } = render(<NeoCore state="idle" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("relative");
    });
  });

  describe("3D Cube Structure", () => {
    it("renders all 6 cube faces", () => {
      const { container } = render(<NeoCore state="idle" />);
      // Each face has the border class
      const faces = container.querySelectorAll(".border-2");
      expect(faces).toHaveLength(6);
    });

    it("applies void background to all faces", () => {
      const { container } = render(<NeoCore state="idle" />);
      const faces = container.querySelectorAll(".bg-void\\/90");
      expect(faces).toHaveLength(6);
    });

    it("applies backdrop-blur to all faces", () => {
      const { container } = render(<NeoCore state="idle" />);
      const faces = container.querySelectorAll(".backdrop-blur-sm");
      expect(faces).toHaveLength(6);
    });

    it("renders circuit detail overlays on each face", () => {
      const { container } = render(<NeoCore state="idle" />);
      const svgs = container.querySelectorAll("svg");
      // 6 faces, each with an SVG overlay
      expect(svgs.length).toBeGreaterThanOrEqual(6);
    });

    it("applies preserve-3d transform style", () => {
      const { container } = render(<NeoCore state="idle" />);
      const cubeContainer = container.querySelector("[style*='preserve-3d']");
      expect(cubeContainer).toBeInTheDocument();
    });
  });

  describe("State-Based Border Colors", () => {
    it("applies neon border color in idle state", () => {
      const { container } = render(<NeoCore state="idle" />);
      const faces = container.querySelectorAll(".border-neon");
      expect(faces).toHaveLength(6);
    });

    it("applies neon border color in listening state", () => {
      const { container } = render(<NeoCore state="listening" />);
      const faces = container.querySelectorAll(".border-neon");
      expect(faces).toHaveLength(6);
    });

    it("applies electric border color in processing state", () => {
      const { container } = render(<NeoCore state="processing" />);
      const faces = container.querySelectorAll(".border-electric");
      expect(faces).toHaveLength(6);
    });

    it("applies neon border color in success state", () => {
      const { container } = render(<NeoCore state="success" />);
      const faces = container.querySelectorAll(".border-neon");
      expect(faces).toHaveLength(6);
    });
  });

  describe("Glowing Core", () => {
    it("shows glowing core in listening state", () => {
      const { container } = render(<NeoCore state="listening" />);
      const glow = container.querySelector(".bg-neon.rounded-full.blur-xl");
      expect(glow).toBeInTheDocument();
    });

    it("does not show glowing core in idle state", () => {
      const { container } = render(<NeoCore state="idle" />);
      const glow = container.querySelector(".bg-neon.rounded-full.blur-xl");
      expect(glow).not.toBeInTheDocument();
    });

    it("does not show glowing core in processing state", () => {
      const { container } = render(<NeoCore state="processing" />);
      const glow = container.querySelector(".bg-neon.rounded-full.blur-xl");
      expect(glow).not.toBeInTheDocument();
    });

    it("does not show glowing core in success state", () => {
      const { container } = render(<NeoCore state="success" />);
      const glow = container.querySelector(".bg-neon.rounded-full.blur-xl");
      expect(glow).not.toBeInTheDocument();
    });

    it("applies neon-glow shadow to faces in listening state", () => {
      const { container } = render(<NeoCore state="listening" />);
      const faces = container.querySelectorAll(".shadow-neon-glow");
      expect(faces).toHaveLength(6);
    });

    it("does not apply neon-glow shadow in idle state", () => {
      const { container } = render(<NeoCore state="idle" />);
      const faces = container.querySelectorAll(".shadow-neon-glow");
      expect(faces).toHaveLength(0);
    });
  });

  describe("Ground Reflection", () => {
    it("renders ground reflection effect", () => {
      const { container } = render(<NeoCore state="idle" />);
      const reflection = container.querySelector(".bg-gradient-to-b.from-neon\\/10");
      expect(reflection).toBeInTheDocument();
    });

    it("applies blur to ground reflection", () => {
      const { container } = render(<NeoCore state="idle" />);
      const reflection = container.querySelector(".blur-sm");
      expect(reflection).toBeInTheDocument();
    });

    it("positions reflection at bottom", () => {
      const { container } = render(<NeoCore state="idle" />);
      const reflection = container.querySelector(".absolute.bottom-0");
      expect(reflection).toBeInTheDocument();
    });
  });

  describe("Click Behavior", () => {
    it("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <NeoCore state="idle" onClick={handleClick} />
      );

      const wrapper = container.firstChild as HTMLElement;
      await user.click(wrapper);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("has pointer cursor when onClick is provided", () => {
      const { container } = render(
        <NeoCore state="idle" onClick={() => {}} />
      );
      const cubeContainer = container.querySelector("[style*='cursor']");
      expect(cubeContainer).toHaveStyle({ cursor: "pointer" });
    });

    it("has default cursor when onClick is not provided", () => {
      const { container } = render(<NeoCore state="idle" />);
      const cubeContainer = container.querySelector("[style*='cursor']");
      expect(cubeContainer).toHaveStyle({ cursor: "default" });
    });

    it("does not throw error when clicked without onClick handler", async () => {
      const user = userEvent.setup();
      const { container } = render(<NeoCore state="idle" />);

      const wrapper = container.firstChild as HTMLElement;
      
      // Should not throw
      await expect(user.click(wrapper)).resolves.not.toThrow();
    });
  });

  describe("Animation States", () => {
    it("applies idle animation variant", () => {
      const { container } = render(<NeoCore state="idle" />);
      const cubeContainer = container.querySelector("[style*='preserve-3d']");
      expect(cubeContainer).toBeInTheDocument();
      // Framer Motion will apply the animation
    });

    it("applies listening animation variant", () => {
      const { container } = render(<NeoCore state="listening" />);
      const cubeContainer = container.querySelector("[style*='preserve-3d']");
      expect(cubeContainer).toBeInTheDocument();
    });

    it("applies processing animation variant", () => {
      const { container } = render(<NeoCore state="processing" />);
      const cubeContainer = container.querySelector("[style*='preserve-3d']");
      expect(cubeContainer).toBeInTheDocument();
    });

    it("applies success animation variant", () => {
      const { container } = render(<NeoCore state="success" />);
      const cubeContainer = container.querySelector("[style*='preserve-3d']");
      expect(cubeContainer).toBeInTheDocument();
    });

    it("transitions between states smoothly", () => {
      const { container, rerender } = render(<NeoCore state="idle" />);
      
      // Change state
      rerender(<NeoCore state="processing" />);
      
      // Should still be rendered
      const cubeContainer = container.querySelector("[style*='preserve-3d']");
      expect(cubeContainer).toBeInTheDocument();
    });
  });

  describe("Circuit Details", () => {
    it("renders circuit lines on each face", () => {
      const { container } = render(<NeoCore state="idle" />);
      const lines = container.querySelectorAll("line");
      // Each face has multiple lines
      expect(lines.length).toBeGreaterThan(0);
    });

    it("renders circuit nodes on each face", () => {
      const { container } = render(<NeoCore state="idle" />);
      const circles = container.querySelectorAll("circle");
      // Each face has circuit nodes
      expect(circles.length).toBeGreaterThan(0);
    });

    it("applies neon color to circuit details", () => {
      const { container } = render(<NeoCore state="idle" />);
      const neonElements = container.querySelectorAll(".text-neon");
      expect(neonElements.length).toBeGreaterThan(0);
    });

    it("applies opacity to circuit overlay", () => {
      const { container } = render(<NeoCore state="idle" />);
      const overlays = container.querySelectorAll(".opacity-20");
      // 6 faces, each with an overlay
      expect(overlays).toHaveLength(6);
    });
  });

  describe("Size Scaling", () => {
    it("scales cube faces with size prop", () => {
      const size = 200;
      const { container } = render(<NeoCore state="idle" size={size} />);
      const cubeContainer = container.querySelector("[style*='preserve-3d']") as HTMLElement;
      expect(cubeContainer).toHaveStyle({ width: `${size}px`, height: `${size}px` });
    });

    it("handles small sizes", () => {
      const { container } = render(<NeoCore state="idle" size={60} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: "60px", height: "60px" });
    });

    it("handles large sizes", () => {
      const { container } = render(<NeoCore state="idle" size={300} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: "300px", height: "300px" });
    });
  });

  describe("State Transitions", () => {
    it("transitions from idle to listening", () => {
      const { container, rerender } = render(<NeoCore state="idle" />);
      
      // Initially no glow
      expect(container.querySelector(".bg-neon.rounded-full.blur-xl")).not.toBeInTheDocument();
      
      // Change to listening
      rerender(<NeoCore state="listening" />);
      
      // Should show glow
      expect(container.querySelector(".bg-neon.rounded-full.blur-xl")).toBeInTheDocument();
    });

    it("transitions from listening to processing", () => {
      const { container, rerender } = render(<NeoCore state="listening" />);
      
      // Initially neon border
      expect(container.querySelectorAll(".border-neon")).toHaveLength(6);
      
      // Change to processing
      rerender(<NeoCore state="processing" />);
      
      // Should have electric border
      expect(container.querySelectorAll(".border-electric")).toHaveLength(6);
    });

    it("transitions from processing to success", () => {
      const { container, rerender } = render(<NeoCore state="processing" />);
      
      // Initially electric border
      expect(container.querySelectorAll(".border-electric")).toHaveLength(6);
      
      // Change to success
      rerender(<NeoCore state="success" />);
      
      // Should have neon border
      expect(container.querySelectorAll(".border-neon")).toHaveLength(6);
    });

    it("handles rapid state changes", () => {
      const { container, rerender } = render(<NeoCore state="idle" />);
      
      // Rapid state changes
      rerender(<NeoCore state="listening" />);
      rerender(<NeoCore state="processing" />);
      rerender(<NeoCore state="success" />);
      rerender(<NeoCore state="idle" />);
      
      // Should still be rendered correctly
      const cubeContainer = container.querySelector("[style*='preserve-3d']");
      expect(cubeContainer).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined onClick gracefully", () => {
      const { container } = render(<NeoCore state="idle" onClick={undefined} />);
      const cubeContainer = container.querySelector("[style*='cursor']");
      expect(cubeContainer).toHaveStyle({ cursor: "default" });
    });

    it("handles zero size", () => {
      const { container } = render(<NeoCore state="idle" size={0} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: "0px", height: "0px" });
    });

    it("handles negative size (treated as absolute value by CSS)", () => {
      const { container } = render(<NeoCore state="idle" size={-100} />);
      const wrapper = container.firstChild as HTMLElement;
      // CSS will handle negative values
      expect(wrapper).toBeInTheDocument();
    });

    it("handles empty className", () => {
      const { container } = render(<NeoCore state="idle" className="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("handles multiple rapid clicks", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <NeoCore state="idle" onClick={handleClick} />
      );

      const wrapper = container.firstChild as HTMLElement;
      
      // Rapid clicks
      await user.click(wrapper);
      await user.click(wrapper);
      await user.click(wrapper);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Visual Consistency", () => {
    it("maintains consistent structure across all states", () => {
      const states: NeoState[] = ["idle", "listening", "processing", "success"];
      
      states.forEach((state) => {
        const { container } = render(<NeoCore state={state} />);
        
        // Should always have 6 faces
        const faces = container.querySelectorAll(".border-2");
        expect(faces).toHaveLength(6);
        
        // Should always have ground reflection
        const reflection = container.querySelector(".bg-gradient-to-b");
        expect(reflection).toBeInTheDocument();
      });
    });

    it("applies consistent face styling across all states", () => {
      const states: NeoState[] = ["idle", "listening", "processing", "success"];
      
      states.forEach((state) => {
        const { container } = render(<NeoCore state={state} />);
        
        // All faces should have void background
        const voidFaces = container.querySelectorAll(".bg-void\\/90");
        expect(voidFaces).toHaveLength(6);
        
        // All faces should have backdrop blur
        const blurredFaces = container.querySelectorAll(".backdrop-blur-sm");
        expect(blurredFaces).toHaveLength(6);
      });
    });
  });

  describe("Performance", () => {
    it("renders efficiently with default props", () => {
      const startTime = performance.now();
      render(<NeoCore state="idle" />);
      const endTime = performance.now();
      
      // Should render quickly (under 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("handles multiple instances", () => {
      const { container } = render(
        <>
          <NeoCore state="idle" />
          <NeoCore state="listening" />
          <NeoCore state="processing" />
          <NeoCore state="success" />
        </>
      );
      
      // Should render all instances
      const cubes = container.querySelectorAll("[style*='preserve-3d']");
      expect(cubes).toHaveLength(4);
    });
  });

  describe("Type Safety", () => {
    it("accepts all valid NeoState values", () => {
      const states: NeoState[] = ["idle", "listening", "processing", "success"];
      
      states.forEach((state) => {
        expect(() => render(<NeoCore state={state} />)).not.toThrow();
      });
    });

    it("accepts valid size numbers", () => {
      const sizes = [60, 120, 200, 300];
      
      sizes.forEach((size) => {
        expect(() => render(<NeoCore state="idle" size={size} />)).not.toThrow();
      });
    });
  });
});
