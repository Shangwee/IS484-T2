import { postData } from "../services/api";

/**
 * Analyze the sentiment of a text using the backend service
 * @param {string} text - The text to analyze
 * @param {boolean} useOpenAI - Whether to use OpenAI as the second model (optional)
 * @returns {Promise} - Promise containing sentiment analysis results
 */
export default function analyzeSentiment(text, useOpenAI = false) {
  return postData("/sentiment/analyze", { text, useOpenAI });
}

/**
 * Get the unified entity sentiment score across multiple articles
 * @param {string} entityName - The name of the entity (company, etc.)
 * @param {Array} articles - Array of article objects with text and metadata
 * @param {Object} options - Optional weighting options
 * @returns {Promise} - Promise containing unified entity sentiment results
 */
export function getEntitySentiment(entityName, articles, options = {}) {
  const payload = {
    entity_name: entityName,
    articles: articles,
    weights: {
      confidence: options.weightByConfidence !== false, // Default to true
      time_decay: !!options.timeDecay, // Default to false
      decay_factor: options.decayFactor || 0.9,
      preferred_method: options.preferredMethod || 'confidence_weighted'
    }
  };
  
  return postData("/sentiment/entity", payload);
}

/**
 * Format sentiment classification for display
 * @param {string} classification - The sentiment classification from the backend
 * @returns {string} - Display-friendly sentiment classification with proper capitalization
 */
export function formatSentimentClassification(classification) {
  if (!classification) return 'Neutral';
  
  // First convert to lowercase
  const lowerClassification = classification.toLowerCase();
  
  // Capitalize first letter
  return lowerClassification.charAt(0).toUpperCase() + lowerClassification.slice(1);
}

/**
 * Get background color based on sentiment classification
 * @param {string} sentiment - The sentiment classification from the backend
 * @returns {string} - Corresponding background color for the sentiment
 */
export function getSentimentColor(sentiment) {
  switch (sentiment) {
    case 'positive':
      return '#28a745'; // Green
    case 'negative':
      return '#dc3545'; // Red
    case 'neutral':
      return '#6c757d'; // Gray
    default:
      return '#6c757d'; // Default to gray for unknown sentiment
  }
}