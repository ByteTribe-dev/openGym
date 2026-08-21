# Expo migration matrix

Actions describe migration into this Expo repository. `KEEP` for backend/deployment entries means they remain upstream and are not copied or modified.

| Existing File | Purpose | Expo Destination | Action | Reuse % | Difficulty | Notes |
|---|---|---|---|---:|---|---|
| `frontend/src/main.jsx` | DOM entry | `src/app/_layout.jsx` | REWRITE | 5 | Medium | Native providers and hydration gate |
| `frontend/src/App.jsx` | Router/global shell | `src/app/**`, `src/components/app-shell.jsx` | REWRITE | 25 | High | Expo Router, theme, timers, tabs |
| `frontend/src/index.css` | Full visual system | `src/theme/**`, native styles | ADAPT | 35 | High | Preserve hierarchy/tokens, no CSS |
| `frontend/src/sheets.jsx` | All modal workflows | `src/app/modals/**`, `src/screens/**` | REWRITE | 55 | High | Reuse mutations and validation |
| `frontend/src/store/useStore.js` | Domain state/persistence/sync | `src/store/useStore.js` | ADAPT | 70 | High | Remove server/auth/browser persistence |
| `frontend/src/store/useUI.js` | Sheets/toasts/timers | `src/store/useUI.js` | ADAPT | 65 | High | AppState and local notifications |
| `frontend/src/views/Home.jsx` | Home dashboard | `src/screens/home-screen.jsx` | REWRITE | 45 | High | Reuse selectors/calculations |
| `frontend/src/views/Plan.jsx` | Week/routine plan | `src/screens/plan-screen.jsx` | REWRITE | 50 | Medium | Native lists and sheets |
| `frontend/src/views/RoutineEdit.jsx` | Routine editor | `src/screens/routine-edit-screen.jsx` | REWRITE | 55 | High | Preserve data operations/supersets |
| `frontend/src/views/Workout.jsx` | Active workout | `src/screens/workout-screen.jsx` | REWRITE | 60 | Very high | Critical behavior slice |
| `frontend/src/views/Stats.jsx` | Analytics hub | `src/screens/stats-screen.jsx` | REWRITE | 55 | Very high | Keep calculations, replace charts |
| `frontend/src/views/History.jsx` | Workout history | `src/screens/history-screen.jsx` | REWRITE | 55 | Medium | FlatList |
| `frontend/src/views/Library.jsx` | Exercise catalogue | `src/screens/library-screen.jsx` | REWRITE | 55 | High | FlatList and native search/filter |
| `frontend/src/views/Settings.jsx` | Preferences/import/export | `src/screens/settings-screen.jsx` | REWRITE | 45 | Very high | Remove all account/server controls |
| `frontend/src/views/Login.jsx` | Passkey/guest entry | — | REMOVE | 0 | Low | Standalone has no account |
| `frontend/src/views/Admin.jsx` | Server admin | — | REMOVE | 0 | Low | Backend out of scope |
| `frontend/src/components/BodyMap.jsx` | Interactive muscle SVG | `src/components/body-map.jsx` | ADAPT | 70 | High | react-native-svg, keep geometry |
| `frontend/src/components/ErrorBoundary.jsx` | Route error containment | `src/components/error-boundary.jsx` | ADAPT | 70 | Medium | Native fallback/reset |
| `frontend/src/components/Heatmap.jsx` | Activity heatmap | `src/components/activity-heatmap.jsx` | ADAPT | 65 | High | Native horizontal layout |
| `frontend/src/components/Icon.jsx` | Hand-drawn SVG icon set | `src/components/icon.jsx` | ADAPT | 80 | Medium | react-native-svg paths |
| `frontend/src/components/LineChart.jsx` | Interactive trend chart | `src/components/line-chart.jsx` | ADAPT | 65 | High | Native gestures/measurement |
| `frontend/src/components/Media.jsx` | Exercise image/GIF | `src/components/exercise-media.jsx` | REWRITE | 45 | Medium | expo-image + local manifest |
| `frontend/src/components/Modals.jsx` | DOM modal stack | Expo Router form sheets | REPLACE | 10 | High | Native presentation |
| `frontend/src/components/NumField.jsx` | Numeric field alias | `src/components/number-field.jsx` | REWRITE | 35 | Medium | Native TextInput |
| `frontend/src/components/RestTimer.jsx` | Floating rest timer | `src/components/rest-timer.jsx` | ADAPT | 60 | High | Timestamp + notification |
| `frontend/src/components/Stepper.jsx` | Stepper alias | `src/components/stepper.jsx` | REWRITE | 45 | Medium | Accessible touch targets |
| `frontend/src/components/TabBar.jsx` | Five-action tab bar | `src/components/app-tab-bar.jsx` | ADAPT | 55 | High | Expo Router custom tab bar |
| `frontend/src/components/Toast.jsx` | Toast presentation | `src/components/toast.jsx` | REWRITE | 40 | Medium | Accessible native overlay |
| `frontend/src/components/ui.jsx` | Web UI primitives | `src/components/ui/**` | REWRITE | 30 | High | RN + Expo UI controls |
| `frontend/src/lib/api.js` | API/WebAuthn | — | REMOVE | 0 | Low | No backend/auth |
| `frontend/src/lib/body-paths.js` | Body SVG geometry | `src/core/body-paths.js` | MOVE | 100 | Low | Lazy native import |
| `frontend/src/lib/demo.js` | Build-time demo flags | — | REMOVE | 0 | Low | Starter plan covers onboarding |
| `frontend/src/lib/demoSeed.js` | Representative data | `src/core/demo-seed.js` | ADAPT | 95 | Low | Fixtures and optional reset |
| `frontend/src/lib/demoSeed.test.js` | Demo fixture tests | `src/core/demo-seed.test.js` | ADAPT | 95 | Low | Jest import changes only |
| `frontend/src/lib/effort.js` | Effort calculations | `src/core/effort.js` | MOVE | 100 | Low | Pure logic |
| `frontend/src/lib/effort.test.js` | Effort tests | `src/core/effort.test.js` | ADAPT | 98 | Low | Runner import only |
| `frontend/src/lib/exercises-data.js` | Exercise catalogue | `src/core/exercises-data.js` | MOVE | 100 | Low | Bundled data |
| `frontend/src/lib/exercises.js` | Exercise index/helpers/media URLs | `src/core/exercises.js` | ADAPT | 85 | Medium | Media resolution moves to service |
| `frontend/src/lib/format.js` | Date/number helpers | `src/core/format.js` | MOVE | 100 | Low | Pure logic |
| `frontend/src/lib/glyphs.js` | Routine glyph mapping | `src/core/glyphs.js` | MOVE | 100 | Low | Used by native icon component |
| `frontend/src/lib/history.js` | Workout/history calculations | `src/core/history.js` | MOVE | 100 | High | Core parity module |
| `frontend/src/lib/history.test.js` | History tests | `src/core/history.test.js` | ADAPT | 98 | Low | Runner import only |
| `frontend/src/lib/i18n.js` | Lazy i18n loader | `src/i18n/index.js` | ADAPT | 75 | Medium | Replace Vite glob with import map |
| `frontend/src/lib/import-csv.js` | CSV/XML import core | `src/core/import-csv.js` | MOVE | 100 | High | File picking moves to service |
| `frontend/src/lib/import-effort.test.js` | Import effort tests | `src/core/import-effort.test.js` | ADAPT | 98 | Low | Runner import only |
| `frontend/src/lib/mobile.js` | Capacitor files/reminders/share | `src/services/**` | REPLACE | 25 | High | Expo native services |
| `frontend/src/lib/muscles.js` | Muscle load calculations | `src/core/muscles.js` | MOVE | 100 | High | Pure logic |
| `frontend/src/lib/nav.js` | Global web navigation | Expo Router hooks | REMOVE | 0 | Low | No navigation singleton |
| `frontend/src/lib/onerm.js` | Estimated 1RM | `src/core/onerm.js` | MOVE | 100 | Low | Pure logic |
| `frontend/src/lib/onerm.test.js` | 1RM tests | `src/core/onerm.test.js` | ADAPT | 98 | Low | Runner import only |
| `frontend/src/lib/plan-share.js` | Plan bundle and DOM print | `src/core/plan-share.js`, sharing service | ADAPT | 75 | High | Split pure and native print |
| `frontend/src/lib/progression.js` | Progression algorithms | `src/core/progression.js` | MOVE | 100 | Very high | Core parity module |
| `frontend/src/lib/progression.test.js` | Progression tests | `src/core/progression.test.js` | ADAPT | 98 | Low | Runner import only |
| `frontend/src/lib/push.js` | Web Push | — | REMOVE | 0 | Low | Local notifications replace mobile need |
| `frontend/src/lib/sound.js` | WebAudio/vibration | `src/services/sound-service.js` | REPLACE | 25 | Medium | expo-audio/haptics |
| `frontend/src/lib/starter.js` | Starter routines | `src/core/starter.js` | MOVE | 100 | Low | Pure data |
| `frontend/src/lib/wakelock.js` | Browser Wake Lock | `src/services/keep-awake-service.js` | REPLACE | 30 | Medium | expo-keep-awake |
| `frontend/src/lib/wakelock.test.js` | Browser visibility tests | native service tests | REWRITE | 25 | Medium | AppState/adapter contract |
| `frontend/src/locales/de.js` | German UI | `src/i18n/locales/de.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/es.js` | Spanish UI | `src/i18n/locales/es.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/fr.js` | French UI | `src/i18n/locales/fr.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/hi.js` | Hindi UI | `src/i18n/locales/hi.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/it.js` | Italian UI | `src/i18n/locales/it.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/ko.js` | Korean UI | `src/i18n/locales/ko.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/pl.js` | Polish UI | `src/i18n/locales/pl.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/pt.js` | Portuguese UI | `src/i18n/locales/pt.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/ru.js` | Russian UI | `src/i18n/locales/ru.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/tr.js` | Turkish UI | `src/i18n/locales/tr.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/locales/zh.js` | Chinese UI | `src/i18n/locales/zh.js` | MOVE | 100 | Low | Translation keys preserved |
| `frontend/src/instr/es.js` | Spanish instructions | `src/i18n/instructions/es.js` | MOVE | 100 | Low | Lazy import |
| `frontend/src/instr/fr.js` | French instructions | `src/i18n/instructions/fr.js` | MOVE | 100 | Low | Lazy import |
| `frontend/src/instr/hi.js` | Hindi instructions | `src/i18n/instructions/hi.js` | MOVE | 100 | Low | Lazy import |
| `frontend/src/instr/it.js` | Italian instructions | `src/i18n/instructions/it.js` | MOVE | 100 | Low | Lazy import |
| `frontend/src/instr/ko.js` | Korean instructions | `src/i18n/instructions/ko.js` | MOVE | 100 | Low | Lazy import |
| `frontend/src/instr/pl.js` | Polish instructions | `src/i18n/instructions/pl.js` | MOVE | 100 | Low | Lazy import |
| `frontend/src/instr/ru.js` | Russian instructions | `src/i18n/instructions/ru.js` | MOVE | 100 | Low | Lazy import |
| `frontend/src/instr/tr.js` | Turkish instructions | `src/i18n/instructions/tr.js` | MOVE | 100 | Low | Lazy import |
| `frontend/src/instr/zh.js` | Chinese instructions | `src/i18n/instructions/zh.js` | MOVE | 100 | Low | Lazy import |
| `frontend/package.json` | Vite/Capacitor dependencies | root `package.json` | REPLACE | 20 | Medium | Expo-compatible dependencies only |
| `frontend/vite.config.js` | Web build/proxy | — | REMOVE | 0 | Low | Metro/Expo replaces Vite |
| `frontend/capacitor.config.json` | Capacitor identity/shell | `app.json` | REPLACE | 30 | Low | `dev.bytetribe.opengym` |
| `frontend/android/` | Generated Capacitor Android | Expo CNG output | REMOVE | 0 | Low | Not imported |
| `frontend/ios/` | Generated Capacitor iOS | Expo CNG output | REMOVE | 0 | Low | Not imported |
| `frontend/public/` | PWA assets/service worker | Expo assets/config | REPLACE | 25 | Medium | No PWA/service worker requirement |
| `frontend/resources/icon.svg` | openGym source icon | `assets/branding/` | ADAPT | 95 | Low | Generate Expo icon/splash assets |
| `media/img/` | Exercise thumbnails | `assets/exercises/img/` | MOVE | 100 | High | Licensed, 1,324 files |
| `media/gif/` | Exercise animations | `assets/exercises/gif/` | MOVE | 100 | High | Licensed, 1,324 files |
| `docs/MOBILE.md` | Capacitor build behavior | migration docs | REUSE | 60 | Low | Behavioral reference only |
| `api/`, `data/`, `web/` | Backend and deployment | upstream only | KEEP | 0 | None | Audited, not imported or changed |
| Docker/deployment configuration | Server deployment | upstream only | KEEP | 0 | None | Out of Phase 1 |
