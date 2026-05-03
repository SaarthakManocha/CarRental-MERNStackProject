# Car Seed Selection Notes (Apr 5, 2026)

## CSV validation

- Source file: `real_racing_3_cars_v14_0.csv`
- Total rows: 540 cars
- Road collection cars: 308
- Manufacturers in road collection: 46

## Your provided brand counts

The major and smaller brand counts you shared are consistent with the road collection data in the CSV.

## Retained shortlist files

1. `seed_cars_road_drivable_uncapped_corebrands_170.csv` (recommended)

- Rule: In Road Collection = Yes, Is Available = Yes, Class != R
- Per-brand cap: None
- Selection logic: Include all eligible cars from Audi, BMW, Mercedes-Benz, Mercedes-AMG, then fill remaining slots by PR to 170
- Output: 170 cars
- Core-brand counts: Audi 9, BMW 14, Mercedes-Benz 5, Mercedes-AMG 2
- Note: Best fit for "no strict brand cap" while keeping total in target range

## Cleanup note

- Intermediate shortlist variants were removed to keep the repo clean.
- They can be regenerated anytime from `real_racing_3_cars_v14_0.csv`.

## Updated direction from user

- Do not enforce strict per-brand caps.
- It is acceptable for major brands to have higher car counts.
- Prefer showroom realism over strict balancing when choosing seed inventory.

## Recommendation

Use `seed_cars_road_drivable_uncapped_corebrands_170.csv` for initial DB seeding in the rental app.
It stays in your target range and supports higher representation for major brands without hard caps.

## Next implementation step

- Use this shortlist as input for backend seeding (`server/seed/seedData.js`) and keep all original stats:
  - Top Speed
  - Acceleration
  - Braking
  - Grip
