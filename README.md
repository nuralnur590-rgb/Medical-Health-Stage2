<<<<<<< HEAD
# Medical-Health — Dermatology Mobile Application

A Kazakh-language mobile application built with Expo, React Native, and TypeScript. The visual direction follows the supplied Skin Firsts dermatology UI reference: blue primary color, white surfaces, pale-blue cards, rounded controls, and bottom navigation.

## Current implementation stage

This repository is the first clean implementation milestone based on the existing Expo SDK 54 project.

Implemented in this milestone:
- Splash and welcome screens
- Login, registration, and password recovery interface with input validation
- Guest preview entry (clearly separate from real authentication)
- Home dashboard and bottom navigation
- Doctors list and doctor details
- Booking form and payment-method selection preview
- Profile, edit profile, notifications, chat, and settings screens
- Shared color and spacing tokens

Not yet connected:
- Supabase authentication and database
- Persistent profile, favorites, bookings, notifications, and chat
- Real payment provider
- Live doctor availability and appointment scheduling

The login and registration forms deliberately do not pretend to authenticate users. They show a message until Supabase is configured. Payment is also a UI preview and does not charge money or confirm an appointment.

## Requirements

- Node.js 20.19.x or newer compatible with Expo SDK 54
- npm

## Install and run

```bash
npm ci
npx expo start
```

Run on Android with `a`, iOS with `i` (macOS + Xcode required), or web with `w` if web dependencies are installed.

## Type checking

```bash
npx tsc --noEmit
```

## Next development steps

1. Complete Kazakh localization and UI refinements against the full Figma file.
2. Configure Supabase project and environment variables.
3. Implement secure authentication and Row Level Security policies.
4. Replace preview doctor data with database-backed data.
5. Persist bookings, favorites, profile, notifications, and chat.
6. Integrate a compliant payment provider if required by the project.
7. Run Expo Doctor, TypeScript checks, and device testing after dependencies are installed.

## Medical disclaimer

The application is not a diagnostic device and does not replace an examination or consultation with a qualified healthcare professional.
=======
# Medical-Health-Stage2
>>>>>>> df0641f60be6ed040ba582eebb81f5422631e645
