import { load_finbert, analyze_sentiment, llm_analyze } from './sentiment';
import { jest } from '@jest/globals';

// Mock external dependencies
jest.mock('@transformers/core');
jest.mock('@transformers/models');
jest.mock('openai');

describe('Financial Sentiment Analysis', () => {
  let mockSentimentPipeline;
  let mockOpenAI;

  beforeEach(() => {
    mockSentimentPipeline = jest.fn();
    mockOpenAI = {
      createChatCompletion: jest.fn()
    };
  });

  describe('load_finbert', () => {
    it('should load the FinBERT model and tokenizer', async () => {
      const pipeline = await load_finbert();
      expect(pipeline).toBeDefined();
    });
  });

  describe('analyze_sentiment', () => {
    const testCases = [
      {
        name: 'should classify positive sentiment',
        input: 'Company XYZ reports record profits',
        mockResult: [{ label: 'POSITIVE', score: 0.8 }],
        expected: {
          numerical_score: 0.8,
          classification: 'Positive',
          detailed_scores: { positive: 0.8 }
        }
      },
      {
        name: 'should classify negative sentiment',
        input: 'Company XYZ files for bankruptcy',
        mockResult: [{ label: 'NEGATIVE', score: 0.7 }],
        expected: {
          numerical_score: -0.7,
          classification: 'Negative',
          detailed_scores: { negative: 0.7 }
        }
      },
      {
        name: 'should classify neutral sentiment',
        input: 'Company XYZ maintains current operations',
        mockResult: [
          { label: 'POSITIVE', score: 0.05 },
          { label: 'NEGATIVE', score: 0.05 }
        ],
        expected: {
          numerical_score: 0,
          classification: 'Neutral',
          detailed_scores: { positive: 0.05, negative: 0.05 }
        }
      }
    ];

    testCases.forEach(({ name, input, mockResult, expected }) => {
      it(name, async () => {
        mockSentimentPipeline.mockResolvedValueOnce([mockResult]);
        const result = await analyze_sentiment(input, mockSentimentPipeline);
        expect(result).toEqual(expected);
      });
    });

    it('should handle custom threshold', async () => {
      mockSentimentPipeline.mockResolvedValueOnce([
        [{ label: 'POSITIVE', score: 0.15 }]
      ]);
      const result = await analyze_sentiment('test text', mockSentimentPipeline, 0.2);
      expect(result.classification).toBe('Neutral');
    });
  });

  describe('llm_analyze', () => {
    const mockText = 'Test financial news article';
    const mockSentimentResult = {
      numerical_score: 0.5,
      classification: 'Positive',
      detailed_scores: { positive: 0.8, negative: 0.3 }
    };

    it('should generate LLM analysis with correct prompt', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                summary: 'Test summary',
                market_implications: 'Test implications',
                recommendations: 'Test recommendations'
              })
            }
          }]
        }
      };

      mockOpenAI.createChatCompletion.mockResolvedValueOnce(mockResponse);

      const result = await llm_analyze(mockText, mockSentimentResult);
      
      expect(mockOpenAI.createChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-4',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.any(String)
          }),
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining(mockText)
          })
        ])
      }));

      expect(JSON.parse(result)).toEqual({
        summary: 'Test summary',
        market_implications: 'Test implications',
        recommendations: 'Test recommendations'
      });
    });

    it('should handle API errors', async () => {
      mockOpenAI.createChatCompletion.mockRejectedValueOnce(new Error('API Error'));
      await expect(llm_analyze(mockText, mockSentimentResult)).rejects.toThrow('API Error');
    });
  });
});