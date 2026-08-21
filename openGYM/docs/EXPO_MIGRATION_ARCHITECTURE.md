# Expo migration architecture

## Audit baseline

- Source: `arvids-unavailable/openGym`, commit `c42ba6b98e3776af5981f20c05ba392238799670` (2026-08-03).
- Target: this Expo SDK 57 managed/CNG application.
- Upstream frontend: 79 files, 77 JavaScript/JSX modules, about 13,968 lines.
- Data: 1,324 built-in exercises, 1,324 thumbnails, 1,324 GIFs, 11 translated UI packs plus English, and 9 translated instruction packs plus English.
- Baseline verification: `npm test` passes 7 files / 192 tests; `npm run build` succeeds.
- Explicit exclusions: upstream `api/`, `web/`, Docker, WebAuthn, profiles, server sessions, cloud sync, admin, subscriptions, and WebView delivery.

## Existing application

### Entry, routing, and shell

`frontend/src/main.jsx` mounts `App.jsx` through React DOM. `App.jsx` uses a hash router and a global shell containing the current route, a five-item tab bar, rest timer, modal stack, toast, theme/language effects, and screen wake lock. Routes are Home, Plan, Routine Editor, Workout, Stats, History, Library, Settings, Login, and Admin. The standalone Capacitor build bypasses login and sets guest mode.

### Screens and component hierarchy

- Home: week strip, today's routine/start action, body-weight log and chart, streak summary, starter-plan empty state.
- Plan: weekly schedule, routines, starter plan, plan sharing/import, and routine navigation.
- Routine Editor: metadata, icon, progression policy, ordered exercises, supersets, exercise configuration, and planned muscle map.
- Library: 1,324 exercises plus custom exercises, search, adaptive body-part/equipment filters, details, media, and add-to-routine.
- Workout: start chooser, active workout header, current exercise/superset, media, set entry, work/rest timers, progression rationale, completion and PR summary.
- Stats/History: activity heatmap, weight and exercise charts, effort, estimated 1RM, muscle balance/body map, recent and full workout history.
- Settings: unit, theme/accent, language, body figure, effort scale, media size, sound, keep-awake, reminders, backup/import, plan tools, and server-only controls.
- Reusable presentation: BodyMap, Heatmap, LineChart, Media, Icon, RestTimer, modal/sheet host, toast, fields, steppers, buttons, rows, segmented controls, and switches.

### State and data flow

`useStore.js` owns a single `S` document with settings, body weight, routines, week/day overrides, exercise weights, workouts, active workout, custom exercises, reminder configuration, and effort mode. Mutations clone `S`, apply a producer, persist it, register custom exercises, and optionally sync to the server. `useUI.js` owns sheets, toast, rest timer, and timed-work state.

Standalone persistence is currently browser `localStorage` mirrored to `opengym-state.json` by Capacitor Filesystem. Local notifications mirror the weekly plan, and Capacitor Share exports a temporary file. The Expo version will preserve the `S` wire shape but use an asynchronous repository over AsyncStorage, with debounced writes and an AppState background flush.

### Business logic

The following modules are primarily platform-independent and must be ported with behavioral parity:

- `progression.js`: linear, Greyskull, double, time, bodyweight, stalls/deloads, prescription application.
- `history.js`: logging modes, routine selection, sets, volume, previous performance, supersets, streaks, and workout helpers.
- `onerm.js`: Epley/Brzycki/Lombardi estimates, cap, series, best set, and PR detection.
- `muscles.js`: exercise-to-muscle weighting, routine/workout load, relative levels, and balance ranking.
- `effort.js`: RIR/RPE normalization, summaries, weekly series, histogram, and hard-set classification.
- `import-csv.js`: CSV/XML parsing, source detection, exercise matching, conversion, and merge behavior.
- `plan-share.js`: plan bundle validation/merge and printable plan composition.
- `exercises.js`, `format.js`, `starter.js`, `glyphs.js`, and the exercise/body-path datasets.

The seven existing test modules cover demo seeding, effort, history, import effort, 1RM, progression, and wake-lock behavior. Wake-lock tests will be replaced by native service tests; the pure behavior tests remain parity gates.

### Browser, Capacitor, and backend dependencies

- Browser-only: React DOM, hash routing, `document` theme/visibility APIs, `window` scrolling/audio/printing, DOM SVG events and measurement, `localStorage`, FileReader/download/blob URLs, Web Share, Wake Lock, Web Push/service workers, and WebAuthn.
- Capacitor: Filesystem for state/export files, LocalNotifications for weekly reminders, Share for backups, and generated Android/iOS shells.
- Backend: authentication/profile/admin routes, `/api/data` synchronization, logout/session management, Web Push, and server rest alerts. None are required by standalone mode and none will be migrated.

## Target Expo architecture

```
src/app (routes only)
  -> src/screens / src/components
  -> Zustand useStore + useUI
  -> src/core pure business logic
  -> repository/service interfaces
  -> AsyncStorage and Expo native services
```

- Expo Router provides native stacks, a persistent five-action tab shell, and form-sheet/modal routes.
- Screen code uses React Native primitives, `expo-image`, virtualized lists, and `react-native-svg`.
- Services isolate storage, notifications, media, sharing/printing, keep-awake, audio/haptics, and local-profile behavior.
- UI translations and instruction packs use an explicit lazy import map that Metro can statically resolve.
- Licensed exercise media is bundled through a generated JavaScript `require()` manifest.
- The root waits for hydration before rendering routes so an active workout cannot be overwritten by the default state.
- The persisted schema remains compatible with existing full-state JSON and plan bundles; malformed imports are rejected before mutation.

## Risks and controls

- Behavioral drift: port pure modules first and require all parity tests to pass before UI work.
- Large media binary: generate and validate the manifest, measure native artifacts, and avoid decoding media outside visible rows/screens.
- Async persistence loss: debounce normal writes, flush on background, persist active workout changes, and test relaunch recovery.
- Timer suspension: store timestamps, reconcile through AppState, and schedule/cancel local rest notifications.
- Translation bundle size: statically enumerable dynamic imports, loading fallback, and long-label UI tests.
- License compliance: use AGPL for the derived app, preserve upstream/body-map notices, and include Gym visual attribution under the confirmed redistribution license.

## Implementation order

1. Audit documents and baseline.
2. JavaScript-only scaffold and pure logic parity.
3. Persistence, theme, localization, and native services.
4. Router shell plus Home, Plan, Routine Editor, and Library.
5. Workout and timers.
6. Stats, History, Settings, sharing/import, and attribution.
7. Static audits, Expo checks, native builds, smoke tests, and final handoff.
