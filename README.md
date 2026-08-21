<div align="center">

<img src="assets/branding/icon.png" alt="openGym icon" width="128" height="128">

<h1>openGym</h1>

**A private, offline-first workout tracker for iOS and Android.**

Plan your training week, run guided workouts, explore 1,324 exercises, and keep your
history on your own device—without an account, subscription, backend, or telemetry.

<br>

[![License: AGPL v3](https://img.shields.io/badge/license-AGPL--3.0-a3e635?style=flat-square)](LICENSE)
![Expo SDK 57](https://img.shields.io/badge/Expo-SDK%2057-000020?style=flat-square&logo=expo&logoColor=white)
![React Native 0.86](https://img.shields.io/badge/React%20Native-0.86-61dafb?style=flat-square&logo=react&logoColor=black)
![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-60a5fa?style=flat-square)
![Offline first](https://img.shields.io/badge/offline-first-a78bfa?style=flat-square)
![No telemetry](https://img.shields.io/badge/telemetry-none-f472b6?style=flat-square)
![Tests](https://img.shields.io/badge/tests-210%20passing-22c55e?style=flat-square)

</div>

<br>

<div align="center">
<table>
<tr>
<td align="center"><img src="docs/screenshots/home.png" alt="openGym home screen" width="210"><br><sub><b>Home</b> — today, streaks, and recent training</sub></td>
<td align="center"><img src="docs/screenshots/workout.png" alt="openGym active workout screen" width="210"><br><sub><b>Workout</b> — guided set logging and timers</sub></td>
<td align="center"><img src="docs/screenshots/exercises.png" alt="openGym exercise library screen" width="210"><br><sub><b>Exercises</b> — 1,324 bundled movements</sub></td>
<td align="center"><img src="docs/screenshots/stats.png" alt="openGym statistics screen" width="210"><br><sub><b>Stats</b> — volume, effort, and muscle balance</sub></td>
</tr>
</table>
</div>

## About this project

This repository is a native Expo/React Native migration of the standalone
[openGym](https://github.com/arvids-unavailable/openGym) frontend. It is based on upstream
commit [`c42ba6b`](https://github.com/arvids-unavailable/openGym/commit/c42ba6b98e3776af5981f20c05ba392238799670)
and preserves the local training model, calculation logic, backup formats, visual identity,
translations, and exercise library while replacing the browser and Capacitor layers with native
iOS and Android services.

This edition is intentionally personal and local-first. There is no login, API, server,
multi-device sync, admin dashboard, subscription, advertising, analytics, or WebView.

## Why openGym?

Workout data is personal. A training log should continue to work without an internet connection,
should not require an account, and should remain exportable in a format its owner can keep.
openGym stores its state locally, runs its training logic on-device, and only sends data outside
the app when you explicitly choose an import, export, print, or share action.

## Features

- **Weekly training plan** — assign routines to weekdays, edit routines, or load the included
  starter plan.
- **Guided workouts** — start the scheduled routine or train freestyle, enter weight and reps,
  add sets or exercises during the session, and move through the workout one exercise at a time.
- **Workout recovery** — an active session is persisted and can be resumed after the app is
  backgrounded, closed, or restarted.
- **Multiple logging modes** — supports conventional sets, timed work, cardio, bodyweight work,
  and per-side exercise configuration through the shared openGym training model.
- **Progression and records** — pure calculation modules cover prescriptions, progression rules,
  estimated one-rep max, personal records, workout volume, streaks, and previous performance.
- **Native timers** — mutually exclusive work and rest timers use timestamps so they reconcile
  after backgrounding; optional sound, haptics, and rest-complete notifications are included.
- **Keep awake while training** — optionally prevents the display from sleeping during an active
  workout.
- **1,324-exercise library** — searchable by name and body part, with locally bundled thumbnails,
  animated demonstrations, instructions, equipment, target muscles, and secondary muscles.
- **History and analytics** — recent sessions, full workout details, training-volume trends,
  effort summaries, and front/back muscle-balance maps.
- **Local reminders** — optional weekly workout reminders are scheduled on-device after explicit
  notification permission.
- **Portable data** — export or restore a full JSON backup, share a plan as JSON, print a plan to
  PDF, and import compatible FitNotes, Strong, Hevy, CSV, or Apple Health export files.
- **Personal appearance** — light, dark, and system themes; eight accent colors; metric or imperial
  units; male or female body maps; and optional RIR/RPE effort settings.
- **12 UI languages** — English, German, Spanish, French, Italian, Portuguese, Polish, Turkish,
  Russian, Chinese, Korean, and Hindi. Exercise instructions are localized in ten languages with
  an English fallback.
- **No tracking** — no account, telemetry, analytics SDK, advertising SDK, or hidden network sync.

## How it works

```text
Expo Router routes
        │
        ▼
Screens and native components
        │
        ├────────► Zustand UI state (timers and transient selections)
        │
        ▼
Zustand domain state
        │
        ├────────► Pure training logic (progression, history, 1RM, effort, muscles)
        │
        ▼
State repository ────────► AsyncStorage
        │
        └────────► Native services (notifications, media, sharing, audio, KeepAwake)
```

The application is JavaScript/JSX-only. Route files live in `src/app/`, screen bodies in
`src/screens/`, reusable presentation in `src/components/`, pure domain logic in `src/core/`, and
platform boundaries in `src/services/`.

| Area | Implementation |
| --- | --- |
| App framework | Expo SDK 57, React Native 0.86, React 19 |
| Navigation | Expo Router native tabs, stacks, and modal routes |
| State | Zustand with focused selectors |
| Persistence | AsyncStorage behind a validated, debounced repository |
| Images and GIFs | `expo-image` with a generated static Metro manifest |
| Charts and body maps | `react-native-svg` |
| Native UI | React Native primitives and `@expo/ui` controls |
| Device services | Expo Notifications, Audio, Haptics, KeepAwake, FileSystem, Sharing, and Print |
| Tests | Jest, `jest-expo`, and React Native Testing Library |

The detailed migration design and verification record are available in
[`docs/EXPO_MIGRATION_ARCHITECTURE.md`](docs/EXPO_MIGRATION_ARCHITECTURE.md),
[`docs/EXPO_MIGRATION_MATRIX.md`](docs/EXPO_MIGRATION_MATRIX.md), and
[`docs/EXPO_MIGRATION_FINAL.md`](docs/EXPO_MIGRATION_FINAL.md).

## Getting started

### Requirements

- Node.js and npm
- [Expo Go](https://expo.dev/go) for the quickest device preview, or a local native toolchain
- Xcode and CocoaPods for local iOS builds
- Android Studio, Android SDK, and JDK 17 for local Android builds

### Install and start

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` for the iOS Simulator and `a` for an Android
emulator. The exercise media is bundled, so the repository and native builds are significantly
larger than a typical starter Expo app.

### Run native builds

```bash
npm run ios
npm run android
```

A development build is recommended when validating notifications, background timer behavior,
sharing, printing, and other OS integrations. Notification delivery should also be tested on a
physical device because simulator behavior does not fully reproduce platform scheduling policy.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run ios` | Build and launch the native iOS app |
| `npm run android` | Build and launch the native Android app |
| `npm test` | Run the Jest suite serially |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run Expo ESLint checks |
| `npm run audit:javascript` | Check for TypeScript and prohibited browser/Capacitor boundaries |
| `npm run generate:media` | Regenerate the static media `require()` manifest |
| `npm run generate:sounds` | Regenerate bundled timer sounds |

Recommended verification before opening a pull request:

```bash
npm test
npm run lint
npm run audit:javascript
npx expo-doctor
```

## Data and privacy

- Training state is stored on the device with AsyncStorage.
- Normal writes are debounced and pending state is flushed when the app backgrounds.
- Malformed or corrupt saved state falls back safely to normalized defaults.
- Active workouts are included in persistence and survive relaunches.
- Notifications are scheduled locally and only after permission is granted.
- Import files are read locally; exports leave the app only through an explicit system share
  action.
- There is no backend, cloud account, analytics collection, or automatic upload.

Backups and shared plans retain the standalone openGym JSON shapes, with a small schema envelope
for runtime validation. Migration from the Capacitor application is supported through manual file
export and import; this app does not attempt to read another app's private storage container.

## Project status and scope

The core native journeys, persistence, exercise media, localization, import/export, and automated
test suite are implemented. iOS and Android debug builds have been exercised locally. Expo web is
best-effort and is not a primary target.

The following upstream server features are intentionally outside this repository's scope:

- Passkey login and user accounts
- Backend APIs and multi-device cloud synchronization
- Admin and subscription features
- Docker/nginx self-hosting
- Automatic access to data inside an installed Capacitor app

## Contributing

Issues and pull requests are welcome. Please keep changes local-first, preserve existing backup
and plan compatibility, place business rules outside React components, and include tests for any
calculation or persistence behavior you change.

Before contributing exercise assets or translated data, confirm that you have the right to
redistribute them and preserve all required attribution.

## Upstream and attribution

- **openGym** — Copyright © 2026 Duarte Santos. This Expo application is a derived native
  migration of the upstream project and retains its notices.
- **MuscleMap** — body-map geometry derived from
  [MuscleMap](https://github.com/melihcolpan/MuscleMap) by Melih Colpan, used under the MIT License.
- **Exercise dataset and media** — exercise names, instructions, thumbnails, and animations are
  sourced from [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
  and remain subject to their own applicable terms.

See [`NOTICE.md`](NOTICE.md) for the complete third-party notices and attribution text.

## License

The openGym application code is distributed under the
[GNU Affero General Public License v3.0](LICENSE). The retained upstream notice includes an
additional AGPL section 7 permission for app-store distribution, provided the corresponding
source remains available under the AGPL. This exception applies to the openGym code and does not
grant rights to third-party content.

> [!IMPORTANT]
> The exercise names, instructions, JPG thumbnails, and GIF animations are **not relicensed under
> the AGPL**. This repository currently contains those assets for the native offline build. Making
> the repository public, publishing a fork, or distributing a compiled app also distributes those
> files. Verify that you have the necessary rights and comply with the dataset/media terms before
> doing so; remove the affected assets if you cannot establish those rights.

---

<div align="center">

Built for training without accounts, subscriptions, or surveillance.

</div>
