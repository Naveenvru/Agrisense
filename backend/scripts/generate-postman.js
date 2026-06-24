const fs = require('fs');

const collection = {
  info: {
    name: "AgriSense Core API",
    description: "Postman collection for AgriSense Core Modules (Phase 6.9)",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:5000", type: "string" },
    { key: "jwtToken", value: "", type: "string" },
    { key: "landParcelId", value: "", type: "string" },
    { key: "farmerCropId", value: "", type: "string" },
    { key: "calendarEventId", value: "", type: "string" }
  ],
  item: [
    {
      name: "Authentication",
      item: [
        {
          name: "Register",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/auth/register", host: ["{{baseUrl}}"], path: ["auth", "register"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ name: "Postman User", email: "postman@agrisense.test", password: "Password123!", role: "farmer" }, null, 2)
            }
          }
        },
        {
          name: "Login",
          event: [{
            listen: "test",
            script: {
              exec: [
                "var data = pm.response.json();",
                "if (data.accessToken) pm.collectionVariables.set('jwtToken', data.accessToken);"
              ],
              type: "text/javascript"
            }
          }],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/auth/login", host: ["{{baseUrl}}"], path: ["auth", "login"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "postman@agrisense.test", password: "Password123!" }, null, 2)
            }
          }
        }
      ]
    },
    {
      name: "Farmer Profile",
      item: [
        {
          name: "Create Profile",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/farmer-profile", host: ["{{baseUrl}}"], path: ["farmer-profile"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ district: "Pune", state: "Maharashtra", village: "Hinjewadi", totalLandArea: 5.5, primarySoilType: "Black Cotton", primaryIrrigationType: "Drip" }, null, 2)
            }
          }
        },
        {
          name: "Get Profile",
          request: {
            method: "GET",
            header: [],
            url: { raw: "{{baseUrl}}/farmer-profile/me", host: ["{{baseUrl}}"], path: ["farmer-profile", "me"] }
          }
        }
      ]
    },
    {
      name: "Land Parcels",
      item: [
        {
          name: "Create Parcel",
          event: [{
            listen: "test",
            script: {
              exec: [
                "var data = pm.response.json();",
                "if (data.data && data.data.id) pm.collectionVariables.set('landParcelId', data.data.id);"
              ],
              type: "text/javascript"
            }
          }],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/land-parcels", host: ["{{baseUrl}}"], path: ["land-parcels"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ parcelName: "North Field", areaAcres: 5.0, soilType: "Black Cotton", latitude: 18.5204, longitude: 73.8567 }, null, 2)
            }
          }
        },
        {
          name: "List Parcels",
          request: {
            method: "GET",
            header: [],
            url: { raw: "{{baseUrl}}/land-parcels", host: ["{{baseUrl}}"], path: ["land-parcels"] }
          }
        }
      ]
    },
    {
      name: "Crops Catalog",
      item: [
        {
          name: "List Crops",
          request: {
            method: "GET",
            header: [],
            url: { raw: "{{baseUrl}}/crops", host: ["{{baseUrl}}"], path: ["crops"] }
          }
        }
      ]
    },
    {
      name: "Farmer Crops",
      item: [
        {
          name: "Assign Crop",
          event: [{
            listen: "test",
            script: {
              exec: [
                "var data = pm.response.json();",
                "if (data.data && data.data.id) pm.collectionVariables.set('farmerCropId', data.data.id);"
              ],
              type: "text/javascript"
            }
          }],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/farmer-crops", host: ["{{baseUrl}}"], path: ["farmer-crops"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ parcelId: "{{landParcelId}}", cropId: "1", cropVariety: "Pusa Ruby", sowingDate: "2024-03-01", estimatedYieldKg: 1000 }, null, 2)
            }
          }
        },
        {
          name: "List Assignments",
          request: {
            method: "GET",
            header: [],
            url: { raw: "{{baseUrl}}/farmer-crops", host: ["{{baseUrl}}"], path: ["farmer-crops"] }
          }
        }
      ]
    },
    {
      name: "Calendar",
      item: [
        {
          name: "Generate Calendar",
          request: {
            method: "POST",
            header: [],
            url: { raw: "{{baseUrl}}/calendar/generate/{{farmerCropId}}", host: ["{{baseUrl}}"], path: ["calendar", "generate", "{{farmerCropId}}"] }
          }
        },
        {
          name: "List Events",
          event: [{
            listen: "test",
            script: {
              exec: [
                "var data = pm.response.json();",
                "if (data.data && data.data.length > 0) pm.collectionVariables.set('calendarEventId', data.data[0].id);"
              ],
              type: "text/javascript"
            }
          }],
          request: {
            method: "GET",
            header: [],
            url: { raw: "{{baseUrl}}/calendar/events", host: ["{{baseUrl}}"], path: ["calendar", "events"] }
          }
        },
        {
          name: "Complete Event",
          request: {
            method: "PATCH",
            header: [],
            url: { raw: "{{baseUrl}}/calendar/events/{{calendarEventId}}/complete", host: ["{{baseUrl}}"], path: ["calendar", "events", "{{calendarEventId}}", "complete"] }
          }
        }
      ]
    }
  ],
  auth: {
    type: "bearer",
    bearer: [
      { key: "token", value: "{{jwtToken}}", type: "string" }
    ]
  }
};

fs.writeFileSync('C:\\Users\\Naveen M\\.gemini\\antigravity-ide\\brain\\d99c04d1-6532-4009-aabe-f2b5ea8264de\\agrisense_postman_collection.json', JSON.stringify(collection, null, 2));
console.log('Postman collection generated at artifacts directory.');
