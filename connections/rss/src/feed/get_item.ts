import { Tool } from "open-api-connection-types";
import { getRSSParser, getFeedUrl } from "../lib";

export const getRSSItem: Tool = {
  id: "getRSSItem",
  displayName: "Get RSS Feed Item",
  userDescription: "Fetches a specific item from an RSS feed by index",
  aiDescription:
    "Retrieves a single item from the RSS feed by its index position (0-based). Returns full details including title, link, content, and metadata",
  arguments: [
    {
      id: "index",
      displayName: "Item Index",
      type: "number",
      userDescription:
        "Zero-based index of the item to retrieve (e.g., 0 for first item)",
      aiDescription:
        "The index position of the item in the feed (0 for the first/newest item)",
    },
  ],
  async handler(config, args) {
    try {
      const parser = getRSSParser(config);
      const feedUrl = getFeedUrl(config);
      const { index } = args;

      const feed = await parser.parseURL(feedUrl);

      const indexNum = typeof index === 'number' ? index : parseInt(index as string, 10);
      if (isNaN(indexNum) || indexNum < 0) {
        return {
          results: {
            found: false,
          },
          log: {
            message: "Invalid index provided",
            data: { index },
          },
        };
      }

      const items = feed.items || [];
      if (indexNum >= items.length) {
        return {
          results: {
            found: false,
          },
          log: {
            message: `Index ${indexNum} out of range. Feed has ${items.length} items`,
            data: { index: indexNum, totalItems: items.length },
          },
        };
      }

      const item = items[indexNum];

      return {
        results: {
          found: true,
          title: item.title || "",
          link: item.link || "",
          pubDate: item.pubDate || "",
          creator: item.creator || "",
          content: item.content || item.contentSnippet || "",
          summary: item.contentSnippet || "",
          guid: item.guid || "",
          categories: item.categories || [],
        },
        log: {
          message: `Successfully retrieved item at index ${indexNum}`,
          data: {
            title: item.title,
            link: item.link,
          },
        },
      };
    } catch (error) {
      return {
        results: {
          found: false,
        },
        log: {
          message: "Failed to fetch RSS feed item",
          data: error,
        },
      };
    }
  },
};
