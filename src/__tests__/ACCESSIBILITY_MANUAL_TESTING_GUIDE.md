# Accessibility Manual Testing Guide

This guide provides step-by-step instructions for manual accessibility testing of the Native UI Overhaul. While automated tests cover most accessibility concerns, manual testing with real assistive technologies is essential for a complete accessibility audit.

## Prerequisites

### Tools Required

#### macOS
- **VoiceOver** (built-in screen reader)
  - Enable: System Preferences → Accessibility → VoiceOver
  - Shortcut: `Cmd + F5`

#### Windows
- **NVDA** (free screen reader)
  - Download: https://www.nvaccess.org/download/
  - Alternative: JAWS (commercial)

#### Browser Extensions
- **axe DevTools** - https://www.deque.com/axe/devtools/
- **WAVE** - https://wave.webaim.org/extension/
- **Lighthouse** (built into Chrome DevTools)

## 1. Screen Reader Testing

### VoiceOver Testing (macOS)

#### Basic Navigation
```
Cmd + F5          - Toggle VoiceOver on/off
VO + Right Arrow  - Move to next item
VO + Left Arrow   - Move to previous item
VO + Space        - Activate item
VO + Shift + Down - Enter group/container
VO + Shift + Up   - Exit group/container
```

#### Test Checklist

- [ ] **Dialog Components**
  ```
  1. Open a dialog (e.g., Settings, Budget Modal)
  2. Verify VoiceOver announces: "Dialog, [Title]"
  3. Navigate through dialog content
  4. Verify all interactive elements are announced
  5. Verify close button is announced as "Close, button"
  6. Press Escape to close
  7. Verify focus returns to trigger element
  ```

- [ ] **Sheet Components**
  ```
  1. Open a sheet (e.g., Settings on mobile)
  2. Verify VoiceOver announces: "Dialog, [Title]"
  3. Navigate through sheet content
  4. Verify swipe-to-dismiss gesture is accessible
  5. Verify close button works
  ```

- [ ] **Form Inputs**
  ```
  1. Navigate to a form (e.g., Login, Budget form)
  2. For each input, verify VoiceOver announces:
     - Label text
     - Input type (text field, email field, etc.)
     - Current value (if any)
     - Required status (if applicable)
  3. Enter invalid data
  4. Verify error messages are announced
  ```

- [ ] **Buttons**
  ```
  1. Navigate to buttons
  2. Verify VoiceOver announces: "[Label], button"
  3. For icon-only buttons, verify aria-label is announced
  4. Verify disabled state is announced
  ```

- [ ] **Command Menu**
  ```
  1. Press Cmd+K to open command menu
  2. Verify VoiceOver announces: "Search commands, search field"
  3. Type a search query
  4. Navigate results with arrow keys
  5. Verify each result is announced clearly
  6. Select a result and verify action executes
  ```

- [ ] **Navigation**
  ```
  1. Navigate through main navigation
  2. Verify page transitions are announced
  3. Verify current page is indicated
  4. Verify all navigation links are accessible
  ```

### NVDA Testing (Windows)

#### Basic Navigation
```
Ctrl + Alt + N    - Toggle NVDA on/off
Down Arrow        - Move to next item
Up Arrow          - Move to previous item
Enter/Space       - Activate item
Insert + F7       - Elements list
```

#### Test Checklist

- [ ] **Dialog Components**
  ```
  1. Open a dialog
  2. Verify NVDA announces: "Dialog, [Title]"
  3. Navigate with Tab key
  4. Verify all elements are announced
  5. Test Escape key to close
  ```

- [ ] **Form Validation**
  ```
  1. Navigate to a form
  2. Submit with invalid data
  3. Verify NVDA announces errors
  4. Verify error messages are associated with inputs
  ```

- [ ] **Dynamic Content**
  ```
  1. Trigger loading states
  2. Verify NVDA announces loading status
  3. Verify content updates are announced
  ```

## 2. Keyboard-Only Navigation

### Test Without Mouse

#### Global Navigation
- [ ] **Tab Order**
  ```
  1. Start at top of page
  2. Press Tab repeatedly
  3. Verify focus moves in logical order:
     - Header navigation
     - Main content
     - Interactive elements
     - Footer (if present)
  4. Verify no focus traps exist
  5. Verify all interactive elements are reachable
  ```

- [ ] **Shift+Tab (Reverse Navigation)**
  ```
  1. Navigate to bottom of page
  2. Press Shift+Tab repeatedly
  3. Verify reverse order matches forward order
  ```

#### Component-Specific Tests

- [ ] **Command Menu**
  ```
  1. Press Cmd+K (Mac) or Ctrl+K (Windows)
  2. Verify command menu opens
  3. Type to search
  4. Use arrow keys to navigate results
  5. Press Enter to select
  6. Press Escape to close
  ```

- [ ] **Dialogs**
  ```
  1. Open dialog with keyboard (Tab to button, press Enter)
  2. Verify focus moves into dialog
  3. Tab through all elements in dialog
  4. Verify focus stays trapped in dialog
  5. Press Escape to close
  6. Verify focus returns to trigger
  ```

- [ ] **Sheets (Mobile)**
  ```
  1. Resize browser to mobile width (< 768px)
  2. Open sheet with keyboard
  3. Navigate through sheet content
  4. Press Escape to close
  ```

- [ ] **Forms**
  ```
  1. Tab to first input
  2. Enter data
  3. Tab to next input
  4. Verify Tab order is logical
  5. Submit form with Enter key
  6. Navigate validation errors with Tab
  ```

- [ ] **Buttons**
  ```
  1. Tab to button
  2. Press Enter to activate
  3. Verify action executes
  4. Tab to another button
  5. Press Space to activate
  6. Verify action executes
  ```

- [ ] **Floating Action Button**
  ```
  1. Tab to FAB
  2. Press Enter to activate
  3. If expandable, verify secondary actions appear
  4. Tab through secondary actions
  5. Press Escape to collapse
  ```

#### Focus Indicators
- [ ] **Visibility**
  ```
  1. Tab through all interactive elements
  2. Verify visible focus ring on each element
  3. Verify focus ring has sufficient contrast
  4. Verify focus ring is not obscured by other elements
  ```

- [ ] **Focus Ring Specifications**
  ```
  Expected styles:
  - Ring width: 2px
  - Ring offset: 2px
  - Ring color: theme ring color (high contrast)
  - Applied via: focus-visible:ring-2
  ```

## 3. Color Contrast Verification

### Using Browser DevTools

#### Chrome DevTools
```
1. Open DevTools (F12)
2. Select element with text
3. View Computed styles
4. Look for "Contrast ratio" indicator
5. Verify ratio meets WCAG AA:
   - Normal text: 4.5:1 minimum
   - Large text (18pt+): 3:1 minimum
```

#### Test Checklist

- [ ] **Text on Backgrounds**
  ```
  Components to check:
  - [ ] Body text on page background
  - [ ] Button text on button backgrounds
  - [ ] Input text on input backgrounds
  - [ ] Dialog text on dialog backgrounds
  - [ ] Header text on glass header (with blur)
  - [ ] Muted text (secondary text)
  ```

- [ ] **Interactive Elements**
  ```
  - [ ] Button hover states
  - [ ] Button active states
  - [ ] Button disabled states
  - [ ] Link colors
  - [ ] Focus ring colors
  ```

- [ ] **Glassmorphism Effects**
  ```
  1. Navigate to components with backdrop-blur
  2. Scroll content behind blurred elements
  3. Verify text remains readable
  4. Test with different background colors
  ```

### Using axe DevTools

```
1. Install axe DevTools extension
2. Open DevTools
3. Navigate to "axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review "Color Contrast" issues
6. Fix any violations found
```

### Manual Contrast Testing

- [ ] **High Contrast Mode**
  ```
  Windows:
  1. Settings → Ease of Access → High Contrast
  2. Enable high contrast theme
  3. Navigate application
  4. Verify all content is visible
  
  macOS:
  1. System Preferences → Accessibility → Display
  2. Enable "Increase contrast"
  3. Navigate application
  4. Verify all content is visible
  ```

## 4. Zoom and Text Scaling

### Browser Zoom Testing

- [ ] **200% Zoom**
  ```
  1. Set browser zoom to 200% (Cmd/Ctrl + +)
  2. Navigate entire application
  3. Verify:
     - No horizontal scrolling required
     - All content is readable
     - No overlapping elements
     - Interactive elements remain accessible
  ```

- [ ] **400% Zoom**
  ```
  1. Set browser zoom to 400%
  2. Navigate critical flows
  3. Verify functionality is maintained
  ```

### Text Scaling

- [ ] **Browser Text Size**
  ```
  1. Increase browser text size (Settings → Appearance)
  2. Set to "Very Large"
  3. Navigate application
  4. Verify layouts adapt appropriately
  ```

## 5. Touch Target Size (Mobile)

### Testing on Mobile Devices

- [ ] **Minimum Touch Target Size**
  ```
  1. Open application on mobile device
  2. Test all interactive elements
  3. Verify minimum size: 44x44px
  4. Elements to check:
     - [ ] Buttons
     - [ ] Links
     - [ ] Form inputs
     - [ ] Close buttons (X)
     - [ ] FAB
     - [ ] Navigation items
  ```

### Using Browser DevTools

```
1. Open DevTools (F12)
2. Toggle device toolbar (Cmd/Ctrl + Shift + M)
3. Select mobile device (e.g., iPhone 12)
4. Inspect interactive elements
5. Verify dimensions meet 44x44px minimum
```

## 6. Gesture Support (Mobile)

### Swipe Gestures

- [ ] **Bottom Sheet Dismissal**
  ```
  1. Open bottom sheet on mobile
  2. Swipe down from top of sheet
  3. Verify sheet dismisses
  4. Verify focus returns appropriately
  ```

- [ ] **Alternative Dismissal Methods**
  ```
  1. Verify close button works
  2. Verify backdrop tap dismisses
  3. Verify Escape key works (with keyboard)
  ```

## 7. Animation and Motion

### Reduced Motion Testing

- [ ] **Prefers Reduced Motion**
  ```
  macOS:
  1. System Preferences → Accessibility → Display
  2. Enable "Reduce motion"
  3. Navigate application
  4. Verify animations are reduced/removed
  
  Windows:
  1. Settings → Ease of Access → Display
  2. Enable "Show animations in Windows"
  3. Navigate application
  4. Verify animations respect setting
  ```

### Animation Performance

- [ ] **Frame Rate**
  ```
  1. Open DevTools Performance tab
  2. Record during animations
  3. Verify 60fps maintained
  4. Check for jank or stuttering
  ```

## 8. Form Accessibility

### Form Testing Checklist

- [ ] **Labels**
  ```
  - [ ] All inputs have associated labels
  - [ ] Labels are visible (not placeholder-only)
  - [ ] Labels are properly associated (htmlFor/id)
  ```

- [ ] **Required Fields**
  ```
  - [ ] Required fields are indicated visually
  - [ ] Required fields are indicated to screen readers
  - [ ] Form cannot be submitted without required fields
  ```

- [ ] **Validation**
  ```
  - [ ] Validation errors are announced to screen readers
  - [ ] Errors are associated with specific inputs
  - [ ] Error messages are clear and actionable
  - [ ] Errors are visible and have sufficient contrast
  ```

- [ ] **Help Text**
  ```
  - [ ] Help text is associated with inputs (aria-describedby)
  - [ ] Help text is announced by screen readers
  ```

## 9. Automated Testing Tools

### Run Lighthouse Audit

```
1. Open Chrome DevTools
2. Navigate to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Generate report"
5. Review score and recommendations
6. Target: 95+ score
```

### Run WAVE Evaluation

```
1. Install WAVE extension
2. Click WAVE icon in browser
3. Review:
   - Errors (must fix)
   - Alerts (review)
   - Features (verify)
   - Structural elements
   - ARIA usage
```

## 10. Cross-Browser Testing

### Browsers to Test

- [ ] **Chrome** (latest)
  - Desktop and mobile
  
- [ ] **Firefox** (latest)
  - Desktop and mobile
  
- [ ] **Safari** (latest)
  - macOS and iOS
  
- [ ] **Edge** (latest)
  - Desktop

### Browser-Specific Issues

- [ ] **Safari**
  ```
  - Verify backdrop-blur works correctly
  - Test VoiceOver integration
  - Verify focus management
  ```

- [ ] **Firefox**
  ```
  - Verify ARIA attributes work
  - Test keyboard navigation
  - Verify focus indicators
  ```

## Testing Checklist Summary

### Critical Tests (Must Complete)
- [ ] Screen reader testing (VoiceOver or NVDA)
- [ ] Keyboard-only navigation
- [ ] Color contrast verification
- [ ] Focus management in modals
- [ ] Form accessibility

### Important Tests (Should Complete)
- [ ] Zoom and text scaling
- [ ] Touch target sizes (mobile)
- [ ] Reduced motion support
- [ ] Cross-browser testing

### Nice to Have Tests
- [ ] Gesture support
- [ ] Animation performance
- [ ] Multiple screen readers
- [ ] Various assistive technologies

## Reporting Issues

When you find an accessibility issue, document:

1. **Issue Description** - What's wrong?
2. **Severity** - Critical, High, Medium, Low
3. **WCAG Criterion** - Which guideline is violated?
4. **Steps to Reproduce** - How to find the issue
5. **Expected Behavior** - What should happen
6. **Actual Behavior** - What actually happens
7. **Assistive Technology** - Which tool revealed the issue
8. **Screenshots/Videos** - Visual documentation

## Resources

### WCAG Guidelines
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- Understanding WCAG: https://www.w3.org/WAI/WCAG21/Understanding/

### Testing Tools
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/
- Lighthouse: https://developers.google.com/web/tools/lighthouse

### Screen Readers
- VoiceOver Guide: https://www.apple.com/voiceover/info/guide/
- NVDA User Guide: https://www.nvaccess.org/files/nvda/documentation/userGuide.html

### Accessibility Standards
- Radix UI Accessibility: https://www.radix-ui.com/primitives/docs/overview/accessibility
- WAI-ARIA Practices: https://www.w3.org/WAI/ARIA/apg/

---

**Last Updated:** 2024
**Related:** `ACCESSIBILITY_TEST_SUMMARY.md`
