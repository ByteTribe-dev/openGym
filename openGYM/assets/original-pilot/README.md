# Original exercise-media pilot

This folder is an isolated five-exercise visual pilot. It does not replace or modify the production exercise library under `assets/exercises/`.

## Contents

- `sheets/`: original AI-generated pose sheets retained as provenance/source material.
- `img/`: first-frame thumbnails generated mechanically from the sheets.
- `gif/`: looping animations generated mechanically from the sheets.

Run `npm run generate:original-pilot` to reproduce `img/` and `gif/` from the checked-in sheets.

## Exercises

- Barbell back squat
- Flat barbell bench press
- Conventional barbell deadlift
- Strict overhand pull-up
- Standing alternating dumbbell curl

## Generation brief

The sheets were generated without passing the existing Gym Visual or exercise-dataset images as references. The shared brief requested an original, unbranded 3D educational render; a charcoal training outfit and studio background; lime joint markers; fixed camera and equipment; anatomically plausible movement stages; and no text, logos, or watermark.

Generated on 2026-08-21 using Codex's built-in image generation tool. These are pilot candidates, not medically certified instruction. A qualified human reviewer must approve biomechanics, pose continuity, equipment geometry, and visual identity before any production replacement or large-scale generation.
