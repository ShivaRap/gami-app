# iOS Performance & Human Interface Guidelines

This document consolidates practical optimizations for building an Expo / React Native app that feels as fluid as a Swift-native experience, along with the Apple Human Interface Guidelines (HIG) highlights that help your product pass App Store review.

## 1. Performance Strategy

- **Budget per frame**: 16 ms for 60 fps devices, 8 ms for 120 fps ProMotion displays. Keep work per frame under budget; shift heavy logic off the JS thread.
- **Architecture**: Adopt the [React Native New Architecture](https://reactnative.dev/docs/new-architecture-intro) (enabled in `app.json`). Use TurboModules + Fabric-compatible libraries where possible.
- **Hermes engine**: Enabled by default in Expo SDK 54; it reduces startup memory and improves bytecode execution on iOS.
- **Over-the-air updates**: Use Expo Updates sparingly; large bundles slow startup. Split code with dynamic imports and route-level bundling when feasible.

## 2. Rendering Optimizations

- **Component purity**: Use `React.memo`, `useCallback`, and `useMemo` to avoid expensive re-renders. Ensure props remain stable (e.g., pass styles via `StyleSheet.create`).
- **Virtualized lists**: Prefer `FlashList` or optimized `FlatList` with `getItemLayout`, `removeClippedSubviews`, and stable keys. Avoid nesting scroll views.
- **Image handling**:
  - Use `expo-image` for better caching, content-aware resizing, and progressive decoding.
  - Preload hero images with `Image.prefetch` or `Asset.loadAsync`.
  - For remote assets, serve @2x and @3x sizes and use WebP/HEIF where allowed.
- **Text rendering**: Load fonts asynchronously via `useFonts` before showing text-heavy screens to avoid layout shifts.

## 3. JS & Native Thread Management

- **Worklets & Reanimated**: Offload gesture-driven animations to the UI thread using `react-native-reanimated` and `react-native-gesture-handler`.
- **Background tasks**: Use Web Workers (`expo-task-manager`, `expo-background-fetch`) for non-UI tasks. Avoid blocking the JS event loop with synchronous JSON parsing or large loops—chunk long tasks with `setImmediate` or `InteractionManager.runAfterInteractions`.
- **Bridgeless communication**: Favor native modules that support JSI to reduce serialization overhead.

## 4. Animation & Interaction Fluidity

- **60+ fps**: Use declarative animations (`Animated`, Reanimated shared values) rather than setTimeout loops. Avoid JS-driven `setState` on every gesture tick.
- **Navigation transitions**: Use `@react-navigation/native-stack` (Fabric & Reanimated ready) or Expo Router’s native stack for platform-appropriate transitions.
- **Haptics**: Use `expo-haptics` for taps, confirmations, and critical alerts; follow Apple’s [Haptics guidelines](https://developer.apple.com/design/human-interface-guidelines/technologies/haptics) by keeping feedback subtle and purposeful.

## 5. Networking & Data

- **Caching**: Implement normalized caches (TanStack Query / React Query) with stale-while-revalidate patterns. Cache GraphQL responses using offline storage if needed.
- **Batching requests**: Combine chatty endpoints; use HTTP/2 multiplexing where supported. Defer analytics uploads until idle moments.
- **Compression**: Enable gzip/brotli on your API. Use delta syncs for frequently updated large payloads.
- **Offline resilience**: Provide optimistic UI and queue mutations with retry; App Review values graceful offline states.

## 6. Memory & Resource Usage

- **Avoid leaks**: Clean up timers, subscriptions, and event listeners in `useEffect` return functions. Monitor memory with Xcode Instruments (Allocations, Leaks, Time Profiler).
- **Bundle size**: Remove unused polyfills, keep dependencies lean, and enable dead-code elimination via Metro’s production mode. Tree-shake icon libraries and avoid `require`-ing entire asset folders.
- **Native modules**: Remove unused Expo modules in `app.json > experiments.lazyImports` when available to reduce binary size.

## 7. Apple Human Interface Guidelines Essentials

### 7.1. Overall Principles

- **Clarity**: Favor legible typography (SF Pro Text/Display equivalents) and coherent hierarchy. Maintain a minimum 44 × 44 pt tap target.
- **Deference**: Content first; UI chrome should be subtle and translucency can hint layering. Respect safe areas and avoid custom status bar overlays unless necessary.
- **Depth**: Use motion and blurs consistently to convey hierarchy. Match iOS transition timings (ease-in-out ~0.35 s) unless a custom motion system is justified.

### 7.2. Navigation

- Employ native patterns: tab bars for 3–5 top-level sections, navigation stacks for drill-down flows. Keep tab labels concise and use SF Symbols.
- Support edge-swipe back gestures; do not block the interactive pop gesture without a strong reason.
- For onboarding or wizards, use paging indicators and allow “Skip” when possible to meet App Review guidance on user autonomy.

### 7.3. Layout & Adaptive Design

- Design for all modern device sizes, including Dynamic Island and iPad multitasking:
  - Use `SafeAreaView` and `useSafeAreaInsets`.
  - Support both light and dark appearances; provide complementary palettes.
  - On iPad, consider split-view layouts or center your content in a column for focus.
- Dynamic Type: respect user-selected text sizes with `ScaledSize` utilities and relative font scaling.

### 7.4. Touch, Gestures, and Haptics

- Recognize Apple-standard gestures (tap, swipe, pinch) before adding custom gestures. Provide visual affordances for custom gestures.
- Use haptics for confirmations, errors, and critical alerts only. Follow system conventions (e.g., `notificationSuccess`, `impactMedium`).

### 7.5. Color & Typography

- Base palette on semantic tokens (primary, secondary, background, elevated). Ensure WCAG 2.1 contrast ratios (≥4.5:1 for body text).
- Use San Francisco system fonts via `expo-font` loaded `.ttf` or `System` to stay consistent with iOS.
- Avoid using full black (#000) on OLED; prefer slightly off-black (e.g., #0A0A0A) per HIG recommendations.

### 7.6. Iconography & Imagery

- Use SF Symbols where possible; they scale well with Dynamic Type and support multicolor rendering.
- App icon: supply 1024 × 1024 asset with safe-zone padding, no rounded corners, no alpha per App Store rules.
- Provide launch/splash screens that match the first rendered frame to avoid perceived jank.

### 7.7. Text, Copy, and Localization

- Keep copy concise, action-driven, and title case for navigation items. Use sentence case for longer labels.
- Enable localization via `expo-localization` and `i18n-js` (or similar), and support right-to-left mirrored layouts.

### 7.8. Privacy, Security, and Permissions

- Request permissions (location, notifications, camera) contextually, with clear justifications in `Info.plist` (configured via `app.json > ios.infoPlist`).
- Provide in-app explanations before the system prompt; Apple may reject apps that lack rationale.
- Handle denied states gracefully and offer settings shortcuts.

### 7.9. Notifications & Background Modes

- Follow Apple’s [notification design](https://developer.apple.com/design/human-interface-guidelines/notifications). Use concise titles, actionable buttons, and relevance scores via APNs.
- Only enable background modes you truly need (VOIP, audio, location). Over-declaring can block App Review.

### 7.10. App Store Submission Checklist

- **Metadata**: Provide accurate descriptions, screenshots for all supported device sizes, and privacy nutrition labels in App Store Connect.
- **Review build**: Use `eas build --profile production --platform ios`; ensure the binary has production environment configs (no staging endpoints exposed).
- **Testing**: Run `TestFlight` builds on latest iOS beta and release versions; capture performance metrics with Xcode Instruments (Time Profiler, Core Animation).
- **Policy compliance**: Avoid private APIs, ensure third-party SDKs are up-to-date, and provide a working Sign in with Apple if using third-party logins (per App Store Review Guideline 4.8).

## 8. Tooling & Monitoring

- **Profiling**: Use `expo start --dev-client` with Xcode Instruments attached for CPU/memory tracing. `react-native-performance` or `why-did-you-render` (development-only) helps detect re-render issues.
- **Crash & Performance analytics**: Integrate Sentry, Bugsnag, or Firebase Crashlytics via Expo config plugins to monitor real-world performance.
- **CI/CD**: Automate linting (`expo lint`), type-checking (`tsc --noEmit`), and UI tests (Detox or Maestro) before triggering EAS builds.

Following this checklist keeps the React Native app performant and visually aligned with Apple’s expectations, significantly reducing friction during App Store review while delivering a native-feeling user experience.
