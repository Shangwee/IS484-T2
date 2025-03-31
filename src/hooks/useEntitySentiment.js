import { useState, useEffect } from 'react';
import { getEntitySentiment } from '../utils/sentimentAnalysis';

/**
 * Custom hook to fetch and manage entity sentiment data
 * 
 * @param {string} entityName - The name of the entity to analyze
 * @param {Array} articles - Array of articles containing text and metadata
 * @param {Object} options - Optional weighting configuration
 * @returns {Object} - Object containing entity sentiment data and loading state
 */
const useEntitySentiment = (entityName, articles = [], options = {}) => {
  const [entitySentiment, setEntitySentiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntitySentiment = async () => {
      // Don't fetch if no entity name or no articles
      if (!entityName || articles.length === 0) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getEntitySentiment(entityName, articles, options);
        setEntitySentiment(result);
      } catch (err) {
        console.error('Error fetching entity sentiment:', err);
        setError(err.message || 'Failed to fetch entity sentiment');
      } finally {
        setLoading(false);
      }
    };

    fetchEntitySentiment();
  }, [entityName, articles, options.weightByConfidence, options.timeDecay, options.decayFactor, options.preferredMethod]);

  return { entitySentiment, loading, error };
};

export default useEntitySentiment;