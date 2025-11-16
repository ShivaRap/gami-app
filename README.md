# gami · Expo / React Native

Modern Expo Router scaffold that targets iOS, Android, and web from a single codebase.

## Prerequisites

- Node 18+ and npm 9+
- Xcode + iOS Simulator (for local iOS testing)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (`npm install -g expo-cli`)
- [EAS CLI](https://docs.expo.dev/eas/): `npm install -g eas-cli`
- Expo account for signing in (`expo login`) before running builds

## Local development

```bash
npm install           # install deps once
npm run ios           # start Metro + open iOS simulator
npm run android       # optional: Android emulator
npm run web           # optional: Web build
```

The entry point uses [Expo Router](https://docs.expo.dev/router/introduction/). Create new routes under `app/` and they will be picked up automatically. Static assets live under `assets/`, utilities under `hooks/`, `components/`, and `constants/`.

### Running on a device

1. Install Expo Go on the device (or install your development build via TestFlight/internal distribution).
2. Run `npm start` and scan the QR code from the Expo CLI output.  
   Use `npm run ios` for the simulator or `npm run android` for an emulator.

## iOS deployment with Expo

The project contains:

- `app.json` with a default bundle identifier `com.shivarap.gami` and build number `1`.
- `eas.json` profiles for `development`, `preview`, and `production` builds.

Build the native binary with EAS:

```bash
eas build --profile preview --platform ios        # internal distribution/TestFlight
eas build --profile production --platform ios     # App Store submission
```

Submitting to the App Store:

```bash
eas submit --platform ios --profile production
```

Update the bundle identifier, version, or build number in `app.json` before submitting to Apple. See [EAS Build docs](https://docs.expo.dev/build/introduction/) for provisioning profile details.

## Resetting the starter

The template ships with an opinionated structure. If you ever want a blank slate you can run:

```bash
npm run reset-project
```

That command moves the current example screens to `app-example/` and creates an empty `app/` directory.
