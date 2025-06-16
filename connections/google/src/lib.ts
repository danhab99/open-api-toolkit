import { google } from "googleapis";
import { KVP } from "open-api-connection-types";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
];

export function getJWT(config: KVP) {
  const serviceAccountJson = config["serviceAccountJson"];
  if (!serviceAccountJson)
    throw new Error("Missing serviceAccountJson in config");

  const credentials =
    typeof serviceAccountJson === "string"
      ? JSON.parse(serviceAccountJson)
      : serviceAccountJson;

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  return auth;
}

export function getCalendar(config: KVP) {
  const auth = getJWT(config);
  return google.calendar({ version: "v3", auth });
}

