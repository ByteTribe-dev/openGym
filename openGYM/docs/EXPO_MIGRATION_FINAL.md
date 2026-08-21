# Expo migration final handoff

## Baseline and scope

The migration uses the audited upstream openGym frontend at commit `c42ba6b`. The upstream checkpoint contained 79 frontend source files, approximately 13,968 lines, 1,324 exercises, 12 UI languages, and 192 passing tests. Backend, authentication, subscription, administration, and server code were intentionally not migrated.

The destination is an Expo SDK 57 JavaScript/JSX application. Its iOS bundle identifier and Android package are both `dev.bytetribe.opengym`; its Expo slug and URL scheme are `opengym`.

## What was migrated

- Five persistent native routes: Home, Plan, Start/Resume, Stats, and Exercises, with a raised central workout action.
- Native stack routes for Settings, History, routine editing, exercise details, workout details, and form-sheet import/completion flows.
- Routine scheduling and editing, starter plans, custom exercise selection, search/filtering, workout initialization and recovery, set/cardio/timed logging, work/rest timers, supersets, progression, PR/1RM/history calculations, and workout completion.
- History and analytics presentation, including virtualized datasets, charts, heatmap data, effort and muscle calculations, and male/female SVG body maps.
- Unit, effort, timer, theme, eight-accent, language, body-map, sound/haptics, KeepAwake, and permission-gated reminder settings.
- Compatible training-backup and plan import/export plus selected CSV/Apple Health export-file import, OS sharing, and PDF plan printing.
- All 12 UI locales and 10 exercise instruction packs, with an explicit JavaScript lazy-import map and English fallback.
- 1,324 thumbnails and 1,324 GIFs, included through a generated static `require()` manifest and rendered with `expo-image`.
- AGPL-3.0 licensing and the upstream, dataset/media, MuscleMap, and Gym Visual attribution notices.

## Reused and rewritten boundaries

Pure business logic and the existing `DEF`, workout, routine, history, backup, and plan wire shapes were retained with minimal JavaScript adaptation. Progression, history, 1RM, muscle, effort, exercise, formatting, import, starter-plan, glyph, and body-path modules remain outside React components.

Browser and Capacitor boundaries were rewritten as native services:

| Previous boundary | Expo implementation |
| --- | --- |
| `localStorage` | AsyncStorage behind `storageService` and `stateRepository` |
| synchronous startup state | validated asynchronous hydration with corrupt-state fallback |
| direct persistence | debounced repository writes plus `AppState` background flush |
| `import.meta.glob` / media URLs | generated static JavaScript `require()` manifest |
| DOM image rendering | `expo-image` |
| DOM SVG | `react-native-svg` |
| browser files/download/share | Document Picker, FileSystem, and OS Sharing |
| HTML print window | `expo-print` PDF generation and sharing |
| browser timers | timestamp-based Zustand timers with foreground reconciliation |
| web notifications | `expo-notifications`, scheduled only after explicit permission |
| screen wake lock | `expo-keep-awake` |
| web audio | bundled WAV tones through `expo-audio` plus `expo-haptics` |
| React Router / Vite routes | Expo Router native tabs, stacks, and form sheets |

No application source uses React DOM, React Router, Vite, Capacitor, browser globals, a backend/API, or a WebView. Expo SDK dependencies may themselves contain transitive platform support modules; those are not used as application screens.

## State and offline behavior

`useStore.js` owns persisted domain data and actions. `useUI.js` owns transient timer and selection state. The repository adds a storage schema envelope and runtime normalization without changing the imported openGym payload shapes. Active workouts are persisted and recoverable, and completion updates workout history and clears the active workout in one state transition before persistence.

All core training behavior and exercise media are available offline. Notifications are optional and permission-gated. Data leaves the device only through an explicit share/export action. Migration from the Capacitor app is manual through compatible document import; private app containers are not accessed.

## Verification performed on 2026-08-21

| Check | Result |
| --- | --- |
| Upstream algorithm/import baseline | 192/192 passing before migration |
| Expo Jest suite | 210/210 passing (192 parity tests plus 18 native repository, timer, service, and navigation tests) |
| Expo lint | Passed with no warnings or errors |
| Expo Doctor | 21/21 checks passed |
| JavaScript/native boundary audit | Passed |
| iOS production Metro export | Passed; 11,070,933-byte Hermes bundle |
| Android production Metro export | Passed; 11,210,984-byte Hermes bundle and 2,679 reported assets |
| Expo Go, iPhone 17 Pro simulator (iOS 26.5) | Launched and visually verified, including bundled exercise image and instructions |
| Native iOS debug build | Built and installed successfully; 0 errors and one duplicate `-lc++` linker warning |
| Native Android debug build | Built in 29m 10s, installed, bundled, launched, and visually verified on Pixel 7a API 35 |
| Maestro definitions | Three smoke flows added; not executed because Maestro CLI is unavailable |

The Android Gradle build emitted dependency deprecation/manifest warnings and an SDK XML tooling warning, but completed successfully. The installed Android app rendered the native Home screen after Metro connected. The native iOS app built and installed, but automated development-client deep-link rendering was blocked by the simulator's first-use confirmation; iOS UI was instead verified in Expo Go. No claim is made for an unperformed test.

## Size observations

- Bundled exercise source media: 139,856 KiB on disk (1,324 JPG plus 1,324 GIF files).
- iOS production export directory: 150,940 KiB; uncompressed iOS simulator `.app`: 146,896 KiB.
- Android production export directory: 152,088 KiB; arm64 debug APK: 89,797,774 bytes (about 85.6 MiB).

These are local export/debug measurements, not App Store or Play Store download sizes. Final signed release size will differ because of platform packaging, architecture slicing, compression, and store processing. Bundled exercise GIFs dominate the payload.

## Dependency audit

`npm audit --omit=dev` reports 17 transitive issues (9 moderate, 8 high) in Expo's Metro/config build chain, chiefly `image-size` and `uuid`. npm's proposed forced remediation would downgrade Expo to SDK 53, so it was not applied. Expo Doctor reports the SDK 57 dependency graph as valid. Recheck these advisories when Expo publishes compatible patched Metro/config versions.

## Remaining release work and limitations

- Run the checked-in Maestro flows on a machine with Maestro installed and extend them for destructive confirmation, notification denial, missing media, and import-error cases.
- Perform signed release builds on physical iOS and Android devices, then record IPA/AAB and store-reported download sizes.
- Verify notification delivery and background rest completion on physical devices; simulator checks do not fully represent OS scheduling policy.
- The Apple Health path imports a user-selected export file; direct HealthKit access is intentionally not included.
- Expo web is best-effort and was not an acceptance target.
- Backend, accounts, cloud sync, subscriptions, and administration remain intentionally deferred.

The detailed pre-migration architecture and file-by-file disposition remain in `EXPO_MIGRATION_ARCHITECTURE.md` and `EXPO_MIGRATION_MATRIX.md`.
