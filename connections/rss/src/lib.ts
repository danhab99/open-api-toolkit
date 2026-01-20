import Parser from "rss-parser";
import { KVP } from "open-api-connection-types";

/**
 * Creates and returns an RSS parser instance.
 * @param config - Configuration object (included for consistency with connector pattern, 
 *                 may be used in future for parser options like custom fields or timeout settings)
 */
export function getRSSParser(config: KVP): Parser {
  return new Parser();
}

export function getFeedUrl(config: KVP): string {
  const { feedUrl } = config;
  if (!feedUrl) {
    throw new Error("feedUrl configuration is required");
  }
  return feedUrl as string;
}
