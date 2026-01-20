import { Tool } from "open-api-connection-types";
import { getRSSParser, getFeedUrl } from "../lib";

export const listRSSItems: Tool = {
  id: "listRSSItems",
  displayName: "List RSS Feed Items",
  userDescription: "Fetches and lists items from an RSS feed",
  aiDescription:
    "Retrieves all items from the configured RSS feed, including title, link, content, publication date, and other metadata",
  arguments: [
    {
      id: "limit",
      displayName: "Limit",
      type: "number",
      userDescription: "Maximum number of items to return (optional)",
      aiDescription:
        "Maximum number of feed items to return. If not specified, all items are returned.",
    },
  ],
  async handler(config, args) {
    try {
      const parser = getRSSParser(config);
      const feedUrl = getFeedUrl(config);
      const { limit } = args;

      const feed = await parser.parseURL(feedUrl);

      let items = feed.items || [];

      if (limit) {
        const limitNum = typeof limit === 'number' ? limit : parseInt(limit as string, 10);
        if (!isNaN(limitNum) && limitNum > 0) {
          items = items.slice(0, limitNum);
        }
      }

      const formattedItems = items.map((item) => ({
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || "",
        creator: item.creator || "",
        content: item.content || item.contentSnippet || "",
        summary: item.contentSnippet || "",
        guid: item.guid || "",
        categories: item.categories || [],
      }));

      return {
        results: {
          feedTitle: feed.title || "",
          feedDescription: feed.description || "",
          feedLink: feed.link || "",
          items: formattedItems,
          itemCount: formattedItems.length,
        },
        log: {
          message: `Successfully retrieved ${formattedItems.length} items from RSS feed`,
          data: {
            feedTitle: feed.title,
            itemCount: formattedItems.length,
          },
        },
      };
    } catch (error) {
      return {
        results: {
          items: [],
          itemCount: 0,
        },
        log: {
          message: "Failed to fetch RSS feed",
          data: error,
        },
      };
    }
  },
};
