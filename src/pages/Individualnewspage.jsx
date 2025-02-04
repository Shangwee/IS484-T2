import { pipeline } from '@transformers/core';
import { AutoTokenizer, AutoModelForSequenceClassification } from '@transformers/models';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function load_finbert() {
  const model_name = "yiyanghkust/finbert-tone";
  const tokenizer = await AutoTokenizer.fromPretrained(model_name);
  const model = await AutoModelForSequenceClassification.fromPretrained(model_name);
  return pipeline("sentiment-analysis", model, tokenizer);
}

export async function analyze_sentiment(text, sentiment_pipeline, threshold = 0.1) {
  const results = await sentiment_pipeline(text);
  const scores = results[0];
  const scores_dict = Object.fromEntries(
    scores.map(item => [item.label.toLowerCase(), item.score])
  );
  
  const numerical_score = (scores_dict.positive || 0) - (scores_dict.negative || 0);
  
  let classification;
  if (numerical_score > threshold) {
    classification = "Positive";
  } else if (numerical_score < -threshold) {
    classification = "Negative";
  } else {
    classification = "Neutral";
  }

  return {
    numerical_score,
    classification,
    detailed_scores: scores_dict
  };
}

export async function llm_analyze(text, sentiment_result) {
  const prompt = `
Analyze the following financial news article along with its sentiment analysis results.
Identify key factors (e.g., market trends, risks, opportunities) mentioned in the text.
Provide:
  1. A summary of the article's main points.
  2. Potential market implications.
  3. Specific recommendations for investors.

Article:
${text}

Sentiment Analysis Results:
- Numerical Score: ${sentiment_result.numerical_score}
- Classification: ${sentiment_result.classification}
- Detailed Scores: ${JSON.stringify(sentiment_result.detailed_scores)}

Please provide a clear and concise analysis.

Please output the analysis as a JSON object with keys: 'summary', 'market_implications', and 'recommendations'.
`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an experienced financial analyst and client advisor." },
      { role: "user", content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.7
  });

  return response.data.choices[0].message.content.trim();
}
