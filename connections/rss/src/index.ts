import { OpenAPIConnectionDefinition, Tool } from "open-api-connection-types";
import { listRSSItems } from "./feed/list_items";
import { getRSSItem } from "./feed/get_item";

export const Connection: OpenAPIConnectionDefinition = {
  id: "rss",
  displayName: "RSS Feed",
  userDescription: "Connects to an RSS feed to read and monitor content",
  aiDescription:
    "Allows tools to fetch and read items from an RSS feed on behalf of the user",
  configurationArguments: [
    {
      id: "feedUrl",
      displayName: "Feed URL",
      userDescription: "The URL of the RSS feed to connect to",
      aiDescription: "The complete URL of the RSS or Atom feed to be parsed",
      type: "string",
    },
  ],
};

export const Tools: Tool[] = [listRSSItems, getRSSItem];
