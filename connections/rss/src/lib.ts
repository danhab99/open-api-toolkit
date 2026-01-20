import Parser from "rss-parser";
import { KVP } from "open-api-connection-types";

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
