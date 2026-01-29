/**
 * FloatingActionButton Component Examples
 * 
 * Demonstrates various usage patterns for the FloatingActionButton component.
 * This file serves as both documentation and a visual test.
 */

import React, { useState } from "react";
import { FloatingActionButton, FABGroup } from "../FloatingActionButton";
import { Plus, Camera, FileText, Edit, Trash2, Share2, Filter, Download, Upload } from "lucide-react";

/**
 * Example 1: Simple FAB
 * 
 * Basic floating action button with a single action.
 */
export function SimpleFABExample() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="relative h-96 border rounded-lg bg-muted/20 p-4">
      <h2 className="text-xl font-semibold mb-4">Simple FAB</h2>
      <p className="text-sm text-muted-foreground mb-2">
        A basic FAB with a single action. Click count: {clickCount}
      </p>

      <FloatingActionButton
        icon={Plus}
        label="Add new item"
        onClick={() => setClickCount(clickCount + 1)}
      />
    </div>
  );
}

/**
 * Example 2: FAB with Secondary Actions
 * 
 * FAB that expands to show multiple action options.
 */
export function FABWithSecondaryActionsExample() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const secondaryActions = [
    {
      icon: Camera,
      label: "Scan receipt",
      onClick: () => setLastAction("Scan receipt"),
    },
    {
      icon: FileText,
      label: "Manual entry",
      onClick: () => setLastAction("Manual entry"),
    },
    {
      icon: Upload,
      label: "Upload file",
      onClick: () => setLastAction("Upload file"),
    },
  ];

  return (
    <div className="relative h-96 border rounded-lg bg-muted/20 p-4">
      <h2 className="text-xl font-semibold mb-4">FAB with Secondary Actions</h2>
      <p className="text-sm text-muted-foreground mb-2">
        Click the FAB to expand and see secondary actions.
      </p>
      {lastAction && (
        <div className="mt-2 p-2 bg-green-500/20 border border-green-500 rounded text-sm">
          Last action: {lastAction}
        </div>
      )}

      <FloatingActionButton
        icon={Plus}
        label="Add"
        secondaryActions={secondaryActions}
      />
    </div>
  );
}

/**
 * Example 3: Large FAB
 * 
 * FAB with larger size variant.
 */
export function LargeFABExample() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="relative h-96 border rounded-lg bg-muted/20 p-4">
      <h2 className="text-xl font-semibold mb-4">Large FAB</h2>
      <p className="text-sm text-muted-foreground mb-2">
        A larger FAB for more prominent actions.
      </p>
      {clicked && (
        <div className="mt-2 p-2 bg-blue-500/20 border border-blue-500 rounded text-sm">
          Large FAB clicked!
        </div>
      )}

      <FloatingActionButton
        icon={Plus}
        label="Add new item"
        onClick={() => setClicked(true)}
        size="lg"
      />
    </div>
  );
}

/**
 * Example 4: FAB with Many Secondary Actions
 * 
 * FAB with multiple secondary actions to demonstrate scrolling behavior.
 */
export function FABWithManyActionsExample() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const secondaryActions = [
    {
      icon: Edit,
      label: "Edit",
      onClick: () => setSelectedAction("Edit"),
    },
    {
      icon: Share2,
      label: "Share",
      onClick: () => setSelectedAction("Share"),
    },
    {
      icon: Download,
      label: "Download",
      onClick: () => setSelectedAction("Download"),
    },
    {
      icon: Upload,
      label: "Upload",
      onClick: () => setSelectedAction("Upload"),
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: () => setSelectedAction("Delete"),
    },
  ];

  return (
    <div className="relative h-96 border rounded-lg bg-muted/20 p-4">
      <h2 className="text-xl font-semibold mb-4">FAB with Many Actions</h2>
      <p className="text-sm text-muted-foreground mb-2">
        FAB with multiple secondary actions.
      </p>
      {selectedAction && (
        <div className="mt-2 p-2 bg-purple-500/20 border border-purple-500 rounded text-sm">
          Selected: {selectedAction}
        </div>
      )}

      <FloatingActionButton
        icon={Plus}
        label="Actions"
        secondaryActions={secondaryActions}
      />
    </div>
  );
}

/**
 * Example 5: FABGroup
 * 
 * Multiple FABs stacked vertically.
 */
export function FABGroupExample() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="relative h-96 border rounded-lg bg-muted/20 p-4">
      <h2 className="text-xl font-semibold mb-4">FAB Group</h2>
      <p className="text-sm text-muted-foreground mb-2">
        Multiple FABs stacked vertically for different primary actions.
      </p>
      {lastAction && (
        <div className="mt-2 p-2 bg-orange-500/20 border border-orange-500 rounded text-sm">
          Action: {lastAction}
        </div>
      )}

      <FABGroup>
        <FloatingActionButton
          icon={Plus}
          label="Add"
          onClick={() => setLastAction("Add")}
        />
        <FloatingActionButton
          icon={Filter}
          label="Filter"
          onClick={() => setLastAction("Filter")}
        />
        <FloatingActionButton
          icon={Download}
          label="Download"
          onClick={() => setLastAction("Download")}
        />
      </FABGroup>
    </div>
  );
}

/**
 * Example 6: Custom Styled FAB
 * 
 * FAB with custom positioning via className.
 */
export function CustomStyledFABExample() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="relative h-96 border rounded-lg bg-muted/20 p-4">
      <h2 className="text-xl font-semibold mb-4">Custom Styled FAB</h2>
      <p className="text-sm text-muted-foreground mb-2">
        FAB with custom positioning (bottom-left instead of bottom-right).
      </p>
      {clicked && (
        <div className="mt-2 p-2 bg-pink-500/20 border border-pink-500 rounded text-sm">
          Custom FAB clicked!
        </div>
      )}

      <FloatingActionButton
        icon={Plus}
        label="Add"
        onClick={() => setClicked(true)}
        className="!left-6 !right-auto"
      />
    </div>
  );
}

/**
 * Example 7: FAB in Context
 * 
 * FAB used in a realistic context with content.
 */
export function FABInContextExample() {
  const [items, setItems] = useState([
    "Item 1",
    "Item 2",
    "Item 3",
  ]);

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  const secondaryActions = [
    {
      icon: Camera,
      label: "Scan",
      onClick: () => setItems([...items, "Scanned Item"]),
    },
    {
      icon: FileText,
      label: "Manual",
      onClick: () => setItems([...items, "Manual Entry"]),
    },
  ];

  return (
    <div className="relative h-96 border rounded-lg bg-muted/20 p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">FAB in Context</h2>
      <p className="text-sm text-muted-foreground mb-4">
        FAB used in a list context. Try adding items!
      </p>

      <div className="space-y-2 mb-16">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-background border rounded-lg"
          >
            {item}
          </div>
        ))}
      </div>

      <FloatingActionButton
        icon={Plus}
        label="Add item"
        onClick={addItem}
        secondaryActions={secondaryActions}
      />
    </div>
  );
}

/**
 * Example 8: Interactive Demo
 * 
 * Interactive demo showing all features.
 */
export function InteractiveFABDemo() {
  const [size, setSize] = useState<"default" | "lg">("default");
  const [hasSecondary, setHasSecondary] = useState(true);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const logAction = (action: string) => {
    setActionLog([...actionLog, `${new Date().toLocaleTimeString()}: ${action}`]);
  };

  const secondaryActions = hasSecondary
    ? [
        {
          icon: Camera,
          label: "Scan",
          onClick: () => logAction("Scan clicked"),
        },
        {
          icon: FileText,
          label: "Manual",
          onClick: () => logAction("Manual clicked"),
        },
        {
          icon: Upload,
          label: "Upload",
          onClick: () => logAction("Upload clicked"),
        },
      ]
    : undefined;

  return (
    <div className="relative h-96 border rounded-lg bg-muted/20 p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Interactive Demo</h2>

      <div className="space-y-4 mb-16">
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={size === "default"}
              onChange={() => setSize("default")}
            />
            Default Size
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={size === "lg"}
              onChange={() => setSize("lg")}
            />
            Large Size
          </label>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasSecondary}
            onChange={(e) => setHasSecondary(e.target.checked)}
          />
          Show Secondary Actions
        </label>

        <div className="p-3 bg-background border rounded-lg">
          <h3 className="font-semibold mb-2">Action Log:</h3>
          <div className="space-y-1 text-xs font-mono max-h-32 overflow-auto">
            {actionLog.length === 0 ? (
              <p className="text-muted-foreground">No actions yet</p>
            ) : (
              actionLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </div>
      </div>

      <FloatingActionButton
        icon={Plus}
        label="Add"
        onClick={() => logAction("Primary clicked")}
        secondaryActions={secondaryActions}
        size={size}
      />
    </div>
  );
}

/**
 * All Examples Component
 * 
 * Renders all examples in a grid layout.
 */
export function AllFloatingActionButtonExamples() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">FloatingActionButton Component Examples</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <SimpleFABExample />
        <FABWithSecondaryActionsExample />
        <LargeFABExample />
        <FABWithManyActionsExample />
        <FABGroupExample />
        <CustomStyledFABExample />
        <FABInContextExample />
        <InteractiveFABDemo />
      </div>

      <div className="mt-8 p-4 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-2">Component Features</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Fixed positioning in bottom-right corner (customizable)</li>
          <li>Spring physics animations on hover and tap</li>
          <li>Elevation shadow for depth perception</li>
          <li>Expandable to show secondary actions</li>
          <li>Smooth animations using Framer Motion</li>
          <li>Accessible with proper ARIA labels</li>
          <li>Two size variants: default and large</li>
          <li>FABGroup component for multiple primary actions</li>
          <li>Backdrop click to collapse expanded state</li>
          <li>Rotation animation when expanded</li>
        </ul>
      </div>

      <div className="mt-4 p-4 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-2">Usage Guidelines</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Use for the primary action on a screen</li>
          <li>Keep secondary actions to 3-5 items maximum</li>
          <li>Provide clear, descriptive labels for accessibility</li>
          <li>Use appropriate icons that clearly represent actions</li>
          <li>Consider using FABGroup when you have multiple primary actions</li>
          <li>Ensure FAB doesn't obscure important content</li>
          <li>Test on mobile devices to ensure touch targets are adequate</li>
        </ul>
      </div>
    </div>
  );
}

export default AllFloatingActionButtonExamples;
