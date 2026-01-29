/**
 * BottomSheet Component Examples
 * 
 * Demonstrates various usage patterns for the BottomSheet component.
 * This file serves as both documentation and a visual test.
 */

import React, { useState } from "react";
import { BottomSheet, BottomSheetTrigger } from "../BottomSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Example 1: Basic BottomSheet
 * 
 * Simple bottom sheet with minimal content.
 */
export function BasicBottomSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Basic BottomSheet</h2>
      
      <Button onClick={() => setOpen(true)}>Open Basic Sheet</Button>

      <BottomSheet open={open} onOpenChange={setOpen}>
        <div className="space-y-4">
          <p>This is a basic bottom sheet.</p>
          <p>On mobile (&lt; 768px), it slides up from the bottom.</p>
          <p>On desktop (≥ 768px), it appears as a centered dialog.</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </BottomSheet>
    </div>
  );
}

/**
 * Example 2: BottomSheet with Title and Description
 * 
 * Bottom sheet with header content for better context.
 */
export function BottomSheetWithHeaderExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">BottomSheet with Header</h2>
      
      <Button onClick={() => setOpen(true)}>Open Sheet with Header</Button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Action Menu"
        description="Choose an action to perform"
      >
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Action 1
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Action 2
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Action 3
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

/**
 * Example 3: BottomSheet with Form
 * 
 * Bottom sheet containing a form for user input.
 */
export function BottomSheetFormExample() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { name, email });
    setOpen(false);
    setName("");
    setEmail("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">BottomSheet with Form</h2>
      
      <Button onClick={() => setOpen(true)}>Open Form Sheet</Button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Contact Information"
        description="Please enter your details"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
}

/**
 * Example 4: BottomSheet with Trigger Component
 * 
 * Using the BottomSheetTrigger helper component.
 */
export function BottomSheetWithTriggerExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">BottomSheet with Trigger</h2>
      
      <BottomSheetTrigger onClick={() => setOpen(true)}>
        <Button>Open with Trigger</Button>
      </BottomSheetTrigger>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Triggered Sheet"
      >
        <p>This sheet was opened using the BottomSheetTrigger component.</p>
        <Button onClick={() => setOpen(false)} className="mt-4">
          Close
        </Button>
      </BottomSheet>
    </div>
  );
}

/**
 * Example 5: Confirmation Dialog
 * 
 * Using BottomSheet for confirmation actions.
 */
export function ConfirmationBottomSheetExample() {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setOpen(false);
    setTimeout(() => setConfirmed(false), 3000);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Confirmation BottomSheet</h2>
      
      {confirmed && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md">
          Action confirmed!
        </div>
      )}

      <Button onClick={() => setOpen(true)} variant="destructive">
        Delete Item
      </Button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this item? This action cannot be undone."
      >
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="flex-1">
            Delete
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

/**
 * Example 6: Multiple BottomSheets
 * 
 * Managing multiple bottom sheets independently.
 */
export function MultipleBottomSheetsExample() {
  const [sheet1Open, setSheet1Open] = useState(false);
  const [sheet2Open, setSheet2Open] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Multiple BottomSheets</h2>
      
      <div className="flex gap-2">
        <Button onClick={() => setSheet1Open(true)}>Open Sheet 1</Button>
        <Button onClick={() => setSheet2Open(true)} variant="secondary">
          Open Sheet 2
        </Button>
      </div>

      <BottomSheet
        open={sheet1Open}
        onOpenChange={setSheet1Open}
        title="First Sheet"
      >
        <p>This is the first bottom sheet.</p>
        <Button onClick={() => setSheet1Open(false)} className="mt-4">
          Close
        </Button>
      </BottomSheet>

      <BottomSheet
        open={sheet2Open}
        onOpenChange={setSheet2Open}
        title="Second Sheet"
      >
        <p>This is the second bottom sheet.</p>
        <Button onClick={() => setSheet2Open(false)} className="mt-4">
          Close
        </Button>
      </BottomSheet>
    </div>
  );
}

/**
 * Example 7: BottomSheet with Custom Styling
 * 
 * Applying custom classes to the BottomSheet.
 */
export function CustomStyledBottomSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Custom Styled BottomSheet</h2>
      
      <Button onClick={() => setOpen(true)}>Open Custom Sheet</Button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Custom Styled"
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/50"
      >
        <div className="space-y-4">
          <p className="text-purple-200">
            This bottom sheet has custom styling applied via the className prop.
          </p>
          <Button onClick={() => setOpen(false)} variant="outline">
            Close
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

/**
 * Example 8: Action Menu Pattern
 * 
 * Common mobile pattern for action menus.
 */
export function ActionMenuBottomSheetExample() {
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const actions = [
    { id: "share", label: "Share", icon: "📤" },
    { id: "edit", label: "Edit", icon: "✏️" },
    { id: "duplicate", label: "Duplicate", icon: "📋" },
    { id: "delete", label: "Delete", icon: "🗑️", variant: "destructive" as const },
  ];

  const handleAction = (actionId: string) => {
    setSelectedAction(actionId);
    setOpen(false);
    setTimeout(() => setSelectedAction(null), 2000);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Action Menu Pattern</h2>
      
      {selectedAction && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-md">
          Action selected: {selectedAction}
        </div>
      )}

      <Button onClick={() => setOpen(true)}>Open Actions</Button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Actions"
        description="Choose an action"
      >
        <div className="space-y-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || "outline"}
              className="w-full justify-start"
              onClick={() => handleAction(action.id)}
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </Button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

/**
 * All Examples Component
 * 
 * Renders all examples in a grid layout.
 */
export function AllBottomSheetExamples() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">BottomSheet Component Examples</h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-4">
          <BasicBottomSheetExample />
        </div>
        
        <div className="border rounded-lg p-4">
          <BottomSheetWithHeaderExample />
        </div>
        
        <div className="border rounded-lg p-4">
          <BottomSheetFormExample />
        </div>
        
        <div className="border rounded-lg p-4">
          <BottomSheetWithTriggerExample />
        </div>
        
        <div className="border rounded-lg p-4">
          <ConfirmationBottomSheetExample />
        </div>
        
        <div className="border rounded-lg p-4">
          <MultipleBottomSheetsExample />
        </div>
        
        <div className="border rounded-lg p-4">
          <CustomStyledBottomSheetExample />
        </div>
        
        <div className="border rounded-lg p-4">
          <ActionMenuBottomSheetExample />
        </div>
      </div>

      <div className="mt-8 p-4 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-2">Testing Instructions</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Resize your browser to test responsive behavior</li>
          <li>Below 768px: Sheets slide up from bottom with handle indicator</li>
          <li>Above 768px: Dialogs appear centered on screen</li>
          <li>Try swiping down on mobile to dismiss (if supported)</li>
          <li>Test keyboard navigation with Tab and Escape keys</li>
        </ul>
      </div>
    </div>
  );
}

export default AllBottomSheetExamples;
