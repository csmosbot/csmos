import FlexSearch from "flexsearch";

interface Data {
  slug: string;
  title: string;
  content: string;
}

let index: FlexSearch.Index;
let data: Data[];

export function createIndex(searchData: Data[]) {
  index = new FlexSearch.Index({ tokenize: "forward" });

  searchData.forEach((post, i) => {
    const item = `${post.title} ${post.content}`;
    index.add(i, item);
  });

  data = searchData;
}

export function searchIndex(searchTerm: string) {
  const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const results = index.search(match);

  return results
    .map((index) => data[index as number])
    .map(({ slug, title, content }) => {
      return {
        slug,
        title: replaceTextWithMarker(title, match),
        content: getMatches(content, match),
      };
    });
}

function getMatches(text: string, searchTerm: string, limit = 1) {
  const regex = new RegExp(searchTerm, "gi");
  const indexes = [];
  let matches = 0;
  let match;

  while ((match = regex.exec(text)) !== null && matches < limit) {
    indexes.push(match.index);
    matches++;
  }

  return indexes.map((index) => {
    const start = index - 20;
    const end = index + 80;
    const excerpt = text.substring(start, end).trim();
    return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
  });
}

function replaceTextWithMarker(text: string, match: string) {
  const regex = new RegExp(match, "gi");
  return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
}
