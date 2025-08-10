import { JWT } from "google-auth-library";
import { google } from "googleapis";
import { KVP } from "open-api-connection-types";

export function getJWT(
  config: KVP,
  scopes: string[],
  extras?: Partial<ConstructorParameters<typeof JWT>>,
): JWT {
  const { serviceAccountJson } = config;

  let credentials;
  try {
    credentials = JSON.parse(serviceAccountJson);
  } catch (e) {
    throw e;
  }

  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes,
    ...extras,
  });

  return client;
}

export function getCalendar(config: KVP) {
  const client = getJWT(config, [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.calendarlist",
  ]);
  return google.calendar({ version: "v3", auth: client });
}

export function getPeople(config: KVP) {
  const auth = getJWT(config, ["https://www.googleapis.com/auth/contacts"]);
  return google.people({ version: "v1", auth });
}

export function getDrive(config: KVP) {
  const auth = getJWT(config, ["https://www.googleapis.com/auth/drive"]);
  return google.drive({ version: "v3", auth });
}

export function getGmail(config: KVP) {
  const auth = getJWT(config, [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
  ]);
  return google.gmail({ version: "v1", auth });
}

export function getTasks(config: KVP) {
  const auth = getJWT(config, ["https://www.googleapis.com/auth/tasks"]);
  return google.tasks({ version: "v1", auth });
}
