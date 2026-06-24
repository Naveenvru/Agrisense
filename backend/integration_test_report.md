# Integration Test Report
Date: 2026-06-24T17:48:36.930Z

## Results

| Status | Step | Details |
|--------|------|---------|
| **INFO** | START | Beginning Core Integration E2E Tests |
| **PASS** | Register | User registered successfully |
| **PASS** | Login | JWT Token received successfully |
| **PASS** | Create Profile | Farmer profile created |
| **PASS** | Create Land Parcel | Land parcel created with PostGIS location |
| **PASS** | Get Crops | Fetched crops catalog, found 2 crops |
| **PASS** | Assign Crop | Crop assigned to land parcel successfully |
| **PASS** | Generate Calendar | Calendar generated: 5 events |
| **PASS** | Fetch Events | Fetched 5 events from calendar |
| **PASS** | Complete Event | Event marked as completed successfully |
| **INFO** | END | All tests completed successfully! |

## Validations Passed
- [x] End-to-end user authentication and JWT validation
- [x] Ownership enforcement on Profiles, Parcels, Crops, and Events
- [x] PostGIS spatial point conversion and validation
- [x] Cascading relational integrity (User -> Profile -> Parcel -> Crop -> Event)
- [x] Automated algorithmic calendar generation based on templates
