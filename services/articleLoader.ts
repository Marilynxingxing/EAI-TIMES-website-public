
import { Article } from '../types';
import { FALLBACK_ARTICLES } from '../constants';

// Define the shape of the external manifest file
interface ArticleManifestItem {
  id: string;
  title: string;
  summary: string;
  contentPath: string; // e.g., "/articles/my-post.md"
  externalUrl?: string;
  isPremium?: boolean;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export const fetchArticles = async (): Promise<Article[]> => {
  try {
    // We add a timestamp query param (?t=...) to bypass browser caching.
    // This ensures that as soon as you push to Git, the users see the update.
    const timestamp = new Date().getTime();
    const response = await fetch(`/data/manifest.json?t=${timestamp}`);
    
    if (!response.ok) {
      // It is normal to fail if the user hasn't created the file yet.
      // We fail silently and use fallback data.
      throw new Error(`Manifest not found (Status: ${response.status})`);
    }

    const manifest: ArticleManifestItem[] = await response.json();
    
    // Convert manifest items to Article objects
    return manifest.map(item => ({
      ...item,
      content: "" // Placeholder, will be fetched on demand
    }));

  } catch (error) {
    console.log("Using built-in fallback articles (External manifest not detected).");
    return FALLBACK_ARTICLES;
  }
};

export const fetchArticleContent = async (article: Article): Promise<string> => {
  // If the article is external, we don't fetch content
  if (article.externalUrl) {
    return "";
  }

  // If the article already has content (like fallback data), return it
  if (article.content && article.content.length > 50) {
    return article.content;
  }

  // If it has a path, fetch the markdown
  if (article.contentPath) {
    try {
      // Add cache busting here too for content updates
      const timestamp = new Date().getTime();
      const response = await fetch(`${article.contentPath}?t=${timestamp}`);
      
      if (!response.ok) throw new Error("Failed to load markdown");
      return await response.text();
    } catch (error) {
      console.error("Error loading article content:", error);
      return "# Error Loading Article\n\nUnable to retrieve content from server. Please check the file path.";
    }
  }

  return "# No Content Found";
};
