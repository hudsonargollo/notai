/**
 * Validation Tests for Responsive Utilities
 * 
 * These tests validate the implementation without requiring a full test framework.
 * They check type safety, exports, and basic functionality.
 */

import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useResponsiveConfig,
  useBreakpointValue,
  getResponsiveConfig,
  getBreakpointValue,
  BREAKPOINTS,
  MEDIA_QUERIES,
  type ResponsiveConfig,
} from "../useMediaQuery";

// Type validation tests
type AssertTrue<T extends true> = T;
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;
type IsObject<T> = T extends object ? true : false;

// Validate hook types
type _UseMediaQueryIsFunction = AssertTrue<IsFunction<typeof useMediaQuery>>;
type _UseIsMobileIsFunction = AssertTrue<IsFunction<typeof useIsMobile>>;
type _UseIsTabletIsFunction = AssertTrue<IsFunction<typeof useIsTablet>>;
type _UseIsDesktopIsFunction = AssertTrue<IsFunction<typeof useIsDesktop>>;
type _UseResponsiveConfigIsFunction = AssertTrue<IsFunction<typeof useResponsiveConfig>>;
type _UseBreakpointValueIsFunction = AssertTrue<IsFunction<typeof useBreakpointValue>>;

// Validate helper function types
type _GetResponsiveConfigIsFunction = AssertTrue<IsFunction<typeof getResponsiveConfig>>;
type _GetBreakpointValueIsFunction = AssertTrue<IsFunction<typeof getBreakpointValue>>;

// Validate constant types
type _BreakpointsIsObject = AssertTrue<IsObject<typeof BREAKPOINTS>>;
type _MediaQueriesIsObject = AssertTrue<IsObject<typeof MEDIA_QUERIES>>;

// Validate ResponsiveConfig interface
const validateResponsiveConfig = (config: ResponsiveConfig) => {
  const _breakpoint: number = config.breakpoint;
  const _useMobileLayout: boolean = config.useMobileLayout;
  const _useBottomSheet: boolean = config.useBottomSheet;
  const _touchTargetSize: number = config.touchTargetSize;
  const _enableGestures: boolean = config.enableGestures;
};

// Validate BREAKPOINTS values
const validateBreakpoints = () => {
  const expectedBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const errors: string[] = [];

  for (const [key, expectedValue] of Object.entries(expectedBreakpoints)) {
    const actualValue = BREAKPOINTS[key as keyof typeof BREAKPOINTS];
    if (actualValue !== expectedValue) {
      errors.push(`BREAKPOINTS.${key}: expected ${expectedValue}, got ${actualValue}`);
    }
  }

  return errors;
};

// Validate MEDIA_QUERIES format
const validateMediaQueries = () => {
  const errors: string[] = [];

  // Check that all media queries are strings
  for (const [key, value] of Object.entries(MEDIA_QUERIES)) {
    if (typeof value !== "string") {
      errors.push(`MEDIA_QUERIES.${key}: expected string, got ${typeof value}`);
    }
    if (!value.startsWith("(")) {
      errors.push(`MEDIA_QUERIES.${key}: expected to start with '(', got '${value}'`);
    }
  }

  return errors;
};

// Validate getResponsiveConfig behavior
const validateGetResponsiveConfig = () => {
  const errors: string[] = [];

  // Test mobile config (< 768px)
  const mobileConfig = getResponsiveConfig(500);
  if (!mobileConfig.useMobileLayout) {
    errors.push("getResponsiveConfig(500): expected useMobileLayout to be true");
  }
  if (!mobileConfig.useBottomSheet) {
    errors.push("getResponsiveConfig(500): expected useBottomSheet to be true");
  }
  if (mobileConfig.touchTargetSize !== 44) {
    errors.push(`getResponsiveConfig(500): expected touchTargetSize to be 44, got ${mobileConfig.touchTargetSize}`);
  }
  if (!mobileConfig.enableGestures) {
    errors.push("getResponsiveConfig(500): expected enableGestures to be true");
  }

  // Test desktop config (>= 768px)
  const desktopConfig = getResponsiveConfig(1024);
  if (desktopConfig.useMobileLayout) {
    errors.push("getResponsiveConfig(1024): expected useMobileLayout to be false");
  }
  if (desktopConfig.useBottomSheet) {
    errors.push("getResponsiveConfig(1024): expected useBottomSheet to be false");
  }
  if (desktopConfig.touchTargetSize !== 32) {
    errors.push(`getResponsiveConfig(1024): expected touchTargetSize to be 32, got ${desktopConfig.touchTargetSize}`);
  }
  if (desktopConfig.enableGestures) {
    errors.push("getResponsiveConfig(1024): expected enableGestures to be false");
  }

  return errors;
};

// Validate getBreakpointValue behavior
const validateGetBreakpointValue = () => {
  const errors: string[] = [];

  const values = {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    "2xl": 6,
  };

  // Test default (< 640px)
  const defaultValue = getBreakpointValue(500, values);
  if (defaultValue !== 1) {
    errors.push(`getBreakpointValue(500): expected 1, got ${defaultValue}`);
  }

  // Test sm (640px - 767px)
  const smValue = getBreakpointValue(700, values);
  if (smValue !== 2) {
    errors.push(`getBreakpointValue(700): expected 2, got ${smValue}`);
  }

  // Test md (768px - 1023px)
  const mdValue = getBreakpointValue(800, values);
  if (mdValue !== 3) {
    errors.push(`getBreakpointValue(800): expected 3, got ${mdValue}`);
  }

  // Test lg (1024px - 1279px)
  const lgValue = getBreakpointValue(1100, values);
  if (lgValue !== 4) {
    errors.push(`getBreakpointValue(1100): expected 4, got ${lgValue}`);
  }

  // Test xl (1280px - 1535px)
  const xlValue = getBreakpointValue(1300, values);
  if (xlValue !== 5) {
    errors.push(`getBreakpointValue(1300): expected 5, got ${xlValue}`);
  }

  // Test 2xl (>= 1536px)
  const xxlValue = getBreakpointValue(1600, values);
  if (xxlValue !== 6) {
    errors.push(`getBreakpointValue(1600): expected 6, got ${xxlValue}`);
  }

  return errors;
};

// Run all validations
export const runValidations = () => {
  const allErrors: string[] = [];

  console.log("Running responsive utilities validation tests...\n");

  // Validate breakpoints
  console.log("Validating BREAKPOINTS...");
  const breakpointErrors = validateBreakpoints();
  if (breakpointErrors.length === 0) {
    console.log("✓ BREAKPOINTS validation passed");
  } else {
    console.error("✗ BREAKPOINTS validation failed:");
    breakpointErrors.forEach((error) => console.error(`  - ${error}`));
    allErrors.push(...breakpointErrors);
  }

  // Validate media queries
  console.log("\nValidating MEDIA_QUERIES...");
  const mediaQueryErrors = validateMediaQueries();
  if (mediaQueryErrors.length === 0) {
    console.log("✓ MEDIA_QUERIES validation passed");
  } else {
    console.error("✗ MEDIA_QUERIES validation failed:");
    mediaQueryErrors.forEach((error) => console.error(`  - ${error}`));
    allErrors.push(...mediaQueryErrors);
  }

  // Validate getResponsiveConfig
  console.log("\nValidating getResponsiveConfig...");
  const responsiveConfigErrors = validateGetResponsiveConfig();
  if (responsiveConfigErrors.length === 0) {
    console.log("✓ getResponsiveConfig validation passed");
  } else {
    console.error("✗ getResponsiveConfig validation failed:");
    responsiveConfigErrors.forEach((error) => console.error(`  - ${error}`));
    allErrors.push(...responsiveConfigErrors);
  }

  // Validate getBreakpointValue
  console.log("\nValidating getBreakpointValue...");
  const breakpointValueErrors = validateGetBreakpointValue();
  if (breakpointValueErrors.length === 0) {
    console.log("✓ getBreakpointValue validation passed");
  } else {
    console.error("✗ getBreakpointValue validation failed:");
    breakpointValueErrors.forEach((error) => console.error(`  - ${error}`));
    allErrors.push(...breakpointValueErrors);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  if (allErrors.length === 0) {
    console.log("✓ All validation tests passed!");
    return true;
  } else {
    console.error(`✗ ${allErrors.length} validation test(s) failed`);
    return false;
  }
};

// Auto-run validations if this file is executed directly
if (typeof window !== "undefined") {
  runValidations();
}
