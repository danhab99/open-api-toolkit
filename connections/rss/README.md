# RSS Feed Connector

A connector for reading and monitoring RSS feeds in the Open API Toolkit.

## Overview

This connector enables integration with RSS and Atom feeds, allowing automated reading and processing of feed content.

## Configuration

The RSS connector requires a single configuration parameter:

- **feedUrl** (string): The complete URL of the RSS or Atom feed to connect to

Example feed URLs:
- `https://hnrss.org/frontpage` (Hacker News)
- `https://news.ycombinator.com/rss` (Hacker News)
- `https://feeds.bbci.co.uk/news/rss.xml` (BBC News)
- `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml` (NY Times)

## Available Tools

### 1. List RSS Feed Items

**Tool ID**: `listRSSItems`

Fetches and lists items from the configured RSS feed.

**Arguments**:
- `limit` (number, optional): Maximum number of items to return. If not specified, all items are returned.

**Returns**:
- `feedTitle`: Title of the RSS feed
- `feedDescription`: Description of the RSS feed
- `feedLink`: Link to the feed's website
- `items`: Array of feed items with the following properties:
  - `title`: Item title
  - `link`: Link to the full article/content
  - `pubDate`: Publication date
  - `creator`: Author/creator name
  - `content`: Full content (if available)
  - `summary`: Content snippet/summary
  - `guid`: Unique identifier
  - `categories`: Array of categories/tags
- `itemCount`: Number of items returned

**Example Usage**:
```javascript
// List all items
const result = await listRSSItems.handler(
  { feedUrl: "https://hnrss.org/frontpage" },
  {}
);

// List first 5 items
const result = await listRSSItems.handler(
  { feedUrl: "https://hnrss.org/frontpage" },
  { limit: 5 }
);
```

### 2. Get RSS Feed Item

**Tool ID**: `getRSSItem`

Retrieves a specific item from the RSS feed by its index position.

**Arguments**:
- `index` (number): Zero-based index of the item to retrieve (0 for the first/newest item)

**Returns**:
- `found`: Boolean indicating if the item was found
- `title`: Item title
- `link`: Link to the full article/content
- `pubDate`: Publication date
- `creator`: Author/creator name
- `content`: Full content (if available)
- `summary`: Content snippet/summary
- `guid`: Unique identifier
- `categories`: Array of categories/tags

**Example Usage**:
```javascript
// Get the first (newest) item
const result = await getRSSItem.handler(
  { feedUrl: "https://hnrss.org/frontpage" },
  { index: 0 }
);

// Get the third item
const result = await getRSSItem.handler(
  { feedUrl: "https://hnrss.org/frontpage" },
  { index: 2 }
);
```

## Implementation Details

### Dependencies

- **rss-parser**: RSS/Atom feed parsing library

### File Structure

```
connections/rss/
├── src/
│   ├── feed/
│   │   ├── get_item.ts    # Tool for fetching single RSS item
│   │   └── list_items.ts  # Tool for listing RSS items
│   ├── index.ts           # Connection definition and tool exports
│   └── lib.ts             # Helper functions
├── package.json
├── tsconfig.json
└── .gitignore
```

### Error Handling

Both tools include comprehensive error handling:
- Invalid feed URLs return appropriate error messages
- Network errors are caught and logged
- Invalid indices return `found: false`
- All errors include detailed logging information

## Usage in Applications

Once configured, the RSS connector can be used to:
- Monitor news feeds and blog updates
- Aggregate content from multiple sources
- Track specific topics via RSS feeds
- Build content curation systems
- Create automated notifications for new content

## Supported Feed Formats

- RSS 2.0
- RSS 1.0
- Atom 1.0

The connector automatically detects and parses any of these formats.
