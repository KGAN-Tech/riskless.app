import type { EnvType } from "~/app/types/api-clients.types";

export const APP_HOSTING = [
  {
    key: "local1",
    type: "local" as EnvType,
    client: "http://localhost:5173",
    server: "https://zero-api-aa3a0074fb47.herokuapp.com/api",
  },
  {
    key: "dev1",
    type: "development" as EnvType,
    client: "https://riskless-capstone.web.app",
    server: "https://zero-api-aa3a0074fb47.herokuapp.com/api",
  },
];

export const APP_SOCKET = [
  {
    key: "local1",
    type: "local",
    client: "http://localhost:5173",
    socket: "http://localhost:5000",
  },
  {
    key: "dev1",
    type: "development",
    client: "https://healthlink-develop.web.app",
    socket: "https://ftcc-health-dev-api-789dc06ee50e.herokuapp.com",
  },
  {
    key: "test1",
    type: "test",
    client: "https://healthlink-sandbox.web.app",
    socket: "https://healthlink-sandbox-api-8ebacbcc8646.herokuapp.com",
  },
];

export const APP_SECURITY = [
  {
    key: "local1",
    type: "local",
    client: "http://localhost:5173",
    isOn: false,
  },
  {
    key: "dev1",
    type: "development",
    client: "https://healthlink-develop.web.app",
    isOn: true,
  },
  {
    key: "test1",
    type: "test",
    client: "https://healthlink-sandbox.web.app",
    isOn: true,
  },
];
