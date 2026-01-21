---
name: Add Unit Tests
overview: Add comprehensive vitest unit tests for all non-React packages first (array, date, error, keyframe, markdown, object, schema, style, theme, tree), then extend to React-based packages (hook, layer, form, storage, state) using @testing-library/react with renderHook and mocked storage.
todos:
  - id: array-tests
    content: Add unit tests for array package (each, filter, groupBy, map, reduce, unique)
    status: completed
  - id: error-tests
    content: Add unit tests for error package (invariant)
    status: completed
    dependencies:
      - array-tests
  - id: object-tests
    content: Add unit tests for object package (11 utility functions)
    status: completed
    dependencies:
      - error-tests
  - id: markdown-tests
    content: Add unit tests for markdown package (getWordCount, getReadingDuration, getHeadings)
    status: completed
    dependencies:
      - object-tests
  - id: tree-tests
    content: Add unit tests for tree package (13 tree operations)
    status: completed
    dependencies:
      - markdown-tests
  - id: keyframe-tests
    content: Add unit tests for keyframe package
    status: completed
    dependencies:
      - tree-tests
  - id: schema-tests
    content: Add unit tests for schema package (guards, validators, builders, toZod, fromZod)
    status: completed
    dependencies:
      - keyframe-tests
  - id: theme-tests
    content: Expand theme package tests (createVariable, createTheme, createThemes)
    status: completed
    dependencies:
      - schema-tests
  - id: style-tests
    content: Add plugin tests for style package
    status: completed
    dependencies:
      - theme-tests
  - id: hook-tests
    content: Add React hook tests using renderHook
    status: completed
    dependencies:
      - style-tests
  - id: storage-tests
    content: Add storage tests with mocked Storage interface
    status: completed
    dependencies:
      - hook-tests
  - id: form-tests
    content: Add form package tests
    status: completed
    dependencies:
      - storage-tests
  - id: layer-tests
    content: Add layer package tests
    status: completed
    dependencies:
      - form-tests
  - id: state-tests
    content: Expand state package tests
    status: completed
    dependencies:
      - layer-tests
---

# Unit Testing Plan for Weser Packages

## Testing Strategy

Build tests package-by-package, validating each before moving to the next. Each source file gets its own test file in a `__tests__` folder. Use the existing vitest config pattern from [`packages/date/vitest.config.ts`](packages/date/vitest.config.ts).---

## Phase 1: Pure Utility Packages (No React)

### 1. array Package

Test file per function in `packages/array/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `each.test.ts` | iterates all elements, provides correct index/length/array, handles empty array || `filter.test.ts` | filters elements by condition, returns new array, handles empty || `groupBy.test.ts` | groups by string key, groups by function, handles empty array || `map.test.ts` | transforms elements, provides correct iterator args || `reduce.test.ts` | reduces with accumulator, handles initial value || `unique.test.ts` | removes duplicates, preserves order, handles primitives and empty |

### 2. error Package

Test file in `packages/error/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `invariant.test.ts` | throws when condition is false, does not throw when true, uses correct error message |

### 3. object Package

Test files in `packages/object/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `each.test.ts` | iterates all properties || `entries.test.ts` | returns key-value pairs || `filter.test.ts` | filters by condition || `find.test.ts` | finds first matching entry || `keys.test.ts` | returns all keys || `map.test.ts` | transforms values || `mergeDeep.test.ts` | deep merges objects, handles nested objects, skips prototype pollution keys || `omit.test.ts` | omits specified keys || `pick.test.ts` | picks specified keys || `reduce.test.ts` | reduces object to value || `values.test.ts` | returns all values |

### 4. date Package (already has tests, expand if needed)

Existing tests in [`packages/date/src/__tests__/format.test.js`](packages/date/src/__tests__/format.test.js) - already comprehensive.

### 5. markdown Package

Test files in `packages/markdown/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `getWordCount.test.ts` | counts words correctly, handles empty string, ignores short words || `getReadingDuration.test.ts` | calculates duration, uses custom words-per-minute, rounds up || `getHeadings.test.ts` | extracts headings with correct depth, generates IDs, respects minDepth/maxDepth |

### 6. tree Package

Test files in `packages/tree/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `create.test.ts` | creates node with auto-generated id || `add.test.ts` | adds child to parent node || `clone.test.ts` | deep clones tree structure || `find.test.ts` | finds node by condition, returns null if not found || `findAll.test.ts` | finds all matching nodes || `get.test.ts` | gets node by id || `getParent.test.ts` | gets parent of node || `insert.test.ts` | inserts at specific position || `move.test.ts` | moves node to new parent || `remove.test.ts` | removes node from tree || `replace.test.ts` | replaces node with new node || `traverse.test.ts` | traverses top-down and bottom-up || `update.test.ts` | updates node properties |

### 7. keyframe Package

Test files in `packages/keyframe/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `getAnimationName.test.ts` | generates consistent hash-based name || `getValueFromCache.test.ts` | returns cached CSS, generates correct keyframe syntax || `createKeyframe.test.ts` | returns animation name and node tuple || `createKeyframes.test.ts` | handles multiple keyframes, returns map of names |

### 8. schema Package

Test files in `packages/schema/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `guards.test.ts` | isEnumSchema, isStringSchema, isNumberSchema, isBooleanSchema, isObjectSchema, isArraySchema || `validators.test.ts` | isValidEnumSchema, isValidStringSchema, etc. - valid and invalid cases || `builders.test.ts` | createEnumSchema, createStringSchema, createNumberSchema, createBooleanSchema, createArraySchema, createObjectSchema with various options || `toZod.test.ts` | converts each schema type to Zod, handles nested objects/arrays, throws on invalid schema || `fromZod.test.ts` | converts Zod types back to JSON Schema |

### 9. theme Package (already has color tests, add more)

Additional test files in `packages/theme/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `createVariable.test.ts` | creates CSS variable reference and declaration || `createVariableReference.test.ts` | creates var() reference || `createTheme.test.ts` | transforms tokens to CSS variables, generates CSS string, custom selector || `createThemes.test.ts` | creates multiple themed CSS outputs |Existing [`packages/theme/src/color/__tests__/color.test.js`](packages/theme/src/color/__tests__/color.test.js) is comprehensive.

### 10. style Package (already has renderer tests, add plugins)

Additional test files in `packages/style/src/plugins/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `unit.test.ts` | adds px units, custom units, handles unitless properties || `responsiveValue.test.ts` | expands array values to media queries || `fallbackValue.test.ts` | handles fallback values || `embedded.test.ts` | embeds nested styles || `customProperty.test.ts` | processes custom properties || `enforceLonghand.test.ts` | enforces longhand properties || `prefixer.test.ts` | adds vendor prefixes || `rtl.test.ts` | flips RTL properties || `sortCondition.test.ts` | sorts media queries mobile-first || `sortProperty.test.ts` | sorts properties alphabetically |---

## Phase 2: React Hook Packages

**Only these packages depend on React and need additional test dependencies:**

- hook
- storage
- form
- layer
- state

For these React-dependent packages only, add `@testing-library/react` and `jsdom`:

```bash
pnpm add -D @testing-library/react jsdom
```

Configure vitest with jsdom environment for React packages:

```typescript
// vitest.config.ts (for React packages only)
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.{js,ts,tsx}'],
    environment: 'jsdom',
  },
})
```

**Pure utility packages (array, error, object, date, markdown, tree, keyframe, schema, theme, style) only need vitest** - no React testing dependencies required. Use the simpler config:

```typescript
// vitest.config.ts (for pure utility packages)
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.{js,ts}'],
    globals: false,
  },
  esbuild: {
    target: 'esnext',
  },
})
```

### 11. hook Package

Test files in `packages/hook/src/__tests__/`:| Test File | Tests to Write ||-----------|----------------|| `useDisclosure.test.ts` | open/close/toggle work, initial state respected || `useFirstRender.test.ts` | returns true on first render, false after || `useList.test.ts` | add/remove/update items in list || `useRerender.test.ts` | forces component rerender || `useTrigger.test.ts` | triggers callback on condition || `useTree.test.ts` | manages tree state with operations || `useClientOnly.test.ts` | renders only on client || `useBreakpoint.test.ts` | mock matchMedia, test matching || `useClickAway.test.ts` | mock click events || `useFocusTrap.test.ts` | mock focus events || `useKeyDown.test.ts` | mock keyboard events || `useScrollBlocking.test.ts` | mock body scroll manipulation || `useRouteChange.test.ts` | mock Next.js router |

### 12. storage Package

For storage, create a mock storage interface:

```typescript
function createMockStorage(): Storage {
  const store: Record<string, string> = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value },
    removeItem: (key) => { delete store[key] },
    clear: () => { /* clear store */ },
    key: (i) => Object.keys(store)[i] ?? null,
    length: Object.keys(store).length,
  }
}
```

| Test File | Tests to Write ||-----------|----------------|| `useStorage.test.ts` | get/set with mock storage, hydration callback, encode/decode || `useLocalStorage.test.ts` | uses localStorage (mock `window.localStorage`) || `useSessionStorage.test.ts` | uses sessionStorage (mock) || `createIndexedStorage.test.ts` | mock IDB interface, async get/set || `useIndexedStorage.test.ts` | uses indexed storage hook |

### 13. form Package

| Test File | Tests to Write ||-----------|----------------|| `useField.test.ts` | field value/error state, onChange handling || `useForm.test.ts` | form state, validation, submit || `createForm.test.ts` | creates form context, Field component |

### 14. layer Package

| Test File | Tests to Write ||-----------|----------------|| `useLayer.test.ts` | layer management || `useLayerContext.test.ts` | context access || `LayerProvider.test.tsx` | provides context to children |

### 15. state Package (already has placeholder tests, expand)

The existing tests in [`packages/state/src/__tests__/`](packages/state/src/__tests__/) are stubs. Expand:| Test File | Tests to Write ||-----------|----------------|| `useStore.test.ts` | action dispatch, state updates, effect execution || `useOptimisticState.test.ts` | optimistic updates, rollback || `logger.test.ts` | logs actions with payload, prev/next state || `persistence.test.ts` | persists state to storage, hydrates on mount |---

## Execution Order

1. **array** - Simple utilities, good warmup
2. **error** - Single function, quick win
3. **object** - Similar to array, builds confidence
4. **markdown** - Parse testing, interesting cases
5. **tree** - Complex data structure operations
6. **keyframe** - DOM-adjacent but pure functions
7. **schema** - Zod integration testing
8. **theme** - Expand existing tests
9. **style** - Add plugin tests
10. **hook** - First React package with renderHook
11. **storage** - Mock storage testing
12. **form** - Zod + React integration
13. **layer** - Context testing