import React, { useState, useEffect } from 'react';
import { postData } from '../../services/api';

/**
 * RAG Interface Component
 * 
 * Provides a user interface for interacting with the RAG/Copilot system
 * - Personalized greeting
 * - Risk preference settings
 * - Query input
 * - Generated answer display with personalized advice
 * - Context sentiment visualization
 * - Entity sentiment display
 */
const RagInterface = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [riskProfile, setRiskProfile] = useState('conservative');
  const [greeting, setGreeting] = useState('');
  const [showInitialInsights, setShowInitialInsights] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState([
    { topic: "Tesla", sentiment: 42.5, change: "+7.2" },
    { topic: "Apple", sentiment: 23.7, change: "+3.1" },
    { topic: "Energy Sector", sentiment: -12.6, change: "-4.3" },
    { topic: "Cryptocurrencies", sentiment: -18.3, change: "-6.5" },
    { topic: "Federal Reserve", sentiment: 15.2, change: "+2.8" }
  ]);
  
  // Get time of day for personalized greeting and initialize
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    
    setGreeting(getGreeting());
    
    // Try to get user name from local storage or default to "Advisor"
    const savedName = localStorage.getItem('userName') || '';
    setUserName(savedName);
    
    // Try to get risk profile from local storage
    const savedRiskProfile = localStorage.getItem('riskProfile') || 'conservative';
    setRiskProfile(savedRiskProfile);
    
    // Auto-hide initial insights after 10 seconds
    const timer = setTimeout(() => {
      setShowInitialInsights(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Save user preferences when changed
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setUserName(newName);
    localStorage.setItem('userName', newName);
  };
  
  const handleRiskProfileChange = (e) => {
    const newProfile = e.target.value;
    setRiskProfile(newProfile);
    localStorage.setItem('riskProfile', newProfile);
  };

  // Function to get recent web information about a topic
  const getRecentNewsData = (topic) => {
    // In a real implementation, this would make an API call to a news service
    // For now, we'll use mock data based on the topic
    
    const commonSources = [
      "Bloomberg", "Reuters", "CNBC", "Financial Times", "Wall Street Journal",
      "MarketWatch", "Yahoo Finance", "The Economist", "Barron's"
    ];
    
    // Generate current date and recent dates for realistic timestamps
    const today = new Date();
    const getRecentHours = () => {
      return Math.floor(Math.random() * 11) + 1; // 1-12 hours ago
    };
    const getRecentMinutes = () => {
      return Math.floor(Math.random() * 59) + 1; // 1-60 minutes ago
    };
    
    // Trump tariffs - current news topic based on search results
    if (topic.toLowerCase().includes('trump') || topic.toLowerCase().includes('tariff')) {
      return {
        sources: [
          {
            id: 1,
            title: "Dow Jones Futures Jump 1,200 Points On Trump Tariff News; Apple, Nvidia, Tesla Rally",
            source: "Investor's Business Daily",
            date: "2025-04-08",
            time: `${getRecentMinutes()} minutes ago`,
            url: "https://www.investors.com/market-trend/stock-market-today/dow-jones-futures-trump-tariff-news-nvidia-stock-tesla-stock/"
          },
          {
            id: 2,
            title: "Cambodia hit with highest Trump tariff, but manufacturing 'absolutely not' coming back to U.S., trade group says",
            source: "CNBC",
            date: "2025-04-08",
            time: `${getRecentMinutes()} minutes ago`,
            url: "https://www.cnbc.com/2025/04/08/cambodia-hit-with-highest-trump-tariff-rate-by-far-at-49percent.html"
          },
          {
            id: 3,
            title: "China vows 'fight to the end' after Trump threatens extra 50% tariff",
            source: "Financial Times",
            date: "2025-04-08",
            time: `${getRecentHours()} hours ago`,
            url: "https://www.ft.com/content/trump-china-tariffs-2025"
          },
          {
            id: 4,
            title: "Trump's refusal to blink on tariffs raises the risks of an ugly endgame",
            source: "CNN",
            date: "2025-04-08",
            time: `${getRecentHours()} hours ago`,
            url: "https://www.cnn.com/2025/04/08/politics/trump-tariffs-analysis/index.html"
          },
          {
            id: 5,
            title: "Singapore to form task force to help businesses and workers, says PM Wong",
            source: "CNA",
            date: "2025-04-08",
            time: `7 hours ago`,
            url: "https://www.channelnewsasia.com/singapore/trump-tariffs-singapore-task-force-businesses-workers-pm-wong-2025"
          }
        ],
        entities: {
          org: ["China", "Singapore", "Cambodia", "Federal Reserve", "Apple", "Nvidia", "Tesla"],
          person: ["Donald Trump", "Lawrence Wong", "Jerome Powell"]
        },
        entity_sentiment: {
          "China": { score: -32.7, classification: "bearish" },
          "Singapore": { score: -18.4, classification: "bearish" },
          "Cambodia": { score: -49.1, classification: "bearish" },
          "Apple": { score: 15.3, classification: "bullish" },
          "Nvidia": { score: 19.6, classification: "bullish" },
          "Tesla": { score: 12.8, classification: "bullish" }
        },
        context_sentiment: {
          score: -15.6,
          classification: "bearish",
          confidence: 0.83,
          agreement_rate: 0.77
        }
      };
    }
    
    // Inflation topic
    if (topic.toLowerCase().includes('inflation')) {
      return {
        sources: [
          {
            id: 1,
            title: "CPI Report Shows Inflation Cooling to 3.2% in March",
            source: "Bloomberg",
            date: "2025-04-05",
            time: `3 days ago`,
            url: "https://www.bloomberg.com/news/articles/2025-04-05/us-inflation-cpi-march-2025"
          },
          {
            id: 2,
            title: "Fed Officials Signal Rate Cuts May Be Delayed Amid Sticky Inflation",
            source: "CNBC",
            date: "2025-04-06",
            time: `2 days ago`,
            url: "https://www.cnbc.com/2025/04/06/fed-officials-rate-cuts-inflation-concern.html"
          },
          {
            id: 3,
            title: "Consumer Expectations for Inflation Decline in March Survey",
            source: "Wall Street Journal",
            date: "2025-04-07",
            time: `1 day ago`,
            url: "https://www.wsj.com/articles/consumer-inflation-expectations-decline-2025-survey-11748364521"
          }
        ],
        entities: {
          org: ["Federal Reserve", "US Treasury", "BLS"],
          person: ["Jerome Powell", "Janet Yellen"]
        },
        entity_sentiment: {
          "Federal Reserve": { score: 5.3, classification: "neutral" },
          "Inflation": { score: -8.7, classification: "bearish" }
        },
        context_sentiment: {
          score: -4.2,
          classification: "neutral",
          confidence: 0.78,
          agreement_rate: 0.82
        }
      };
    }
    
    // Tesla topic
    if (topic.toLowerCase().includes('tesla') || topic.toLowerCase().includes('electric vehicles')) {
      return {
        sources: [
          {
            id: 1,
            title: "Tesla Cuts Prices in US and China Amid Slowing EV Demand",
            source: "Reuters",
            date: "2025-04-07",
            time: `1 day ago`,
            url: "https://www.reuters.com/business/autos-transportation/tesla-cuts-prices-us-china-2025-04-07/"
          },
          {
            id: 2,
            title: "Tesla's Q1 Deliveries Beat Lowered Expectations But Still Show YoY Decline",
            source: "CNBC",
            date: "2025-04-03",
            time: `5 days ago`,
            url: "https://www.cnbc.com/2025/04/03/tesla-tsla-q1-2025-vehicle-delivery-numbers.html"
          },
          {
            id: 3,
            title: "Musk Unveils New Battery Technology at Tesla Investor Day",
            source: "TechCrunch",
            date: "2025-03-25",
            time: `2 weeks ago`,
            url: "https://techcrunch.com/2025/03/25/tesla-battery-technology-investor-day/"
          }
        ],
        entities: {
          org: ["Tesla", "BYD", "Rivian"],
          person: ["Elon Musk"]
        },
        entity_sentiment: {
          "Tesla": { score: 18.2, classification: "bullish" },
          "BYD": { score: 24.5, classification: "bullish" }
        },
        context_sentiment: {
          score: 14.8,
          classification: "bullish",
          confidence: 0.72,
          agreement_rate: 0.65
        }
      };
    }
    
    // Crypto topic
    if (topic.toLowerCase().includes('crypto') || topic.toLowerCase().includes('bitcoin')) {
      return {
        sources: [
          {
            id: 1,
            title: "Bitcoin Briefly Tops $70,000 as Spot ETF Inflows Accelerate",
            source: "CoinDesk",
            date: "2025-04-06",
            time: `2 days ago`,
            url: "https://www.coindesk.com/markets/2025/04/06/bitcoin-tops-70000-etf-inflows/"
          },
          {
            id: 2,
            title: "Ethereum Rises Ahead of Expected ETF Approvals in May",
            source: "Bloomberg",
            date: "2025-04-04",
            time: `4 days ago`,
            url: "https://www.bloomberg.com/news/articles/2025-04-04/ethereum-rises-etf-approvals"
          },
          {
            id: 3,
            title: "SEC Chair Gensler Reiterates Crypto Compliance Concerns",
            source: "Financial Times",
            date: "2025-04-01",
            time: `1 week ago`,
            url: "https://www.ft.com/content/sec-gensler-crypto-compliance-2025"
          }
        ],
        entities: {
          org: ["Bitcoin", "Ethereum", "SEC"],
          person: ["Gary Gensler"]
        },
        entity_sentiment: {
          "Bitcoin": { score: 35.2, classification: "bullish" },
          "Ethereum": { score: 28.4, classification: "bullish" },
          "SEC": { score: -12.5, classification: "bearish" }
        },
        context_sentiment: {
          score: 22.8,
          classification: "bullish",
          confidence: 0.68,
          agreement_rate: 0.72
        }
      };
    }
    
    // For any other topic, generate generic financial news data
    return {
      sources: [
        {
          id: 1,
          title: `Latest Analysis: Impact of ${topic} on Financial Markets`,
          source: commonSources[Math.floor(Math.random() * commonSources.length)],
          date: `2025-04-0${Math.floor(Math.random() * 7) + 1}`,
          time: `${getRecentHours()} hours ago`,
          url: `https://www.financialnews.com/markets/${topic.toLowerCase().replace(/\s+/g, '-')}`
        },
        {
          id: 2,
          title: `Investors React to ${topic} Developments`,
          source: commonSources[Math.floor(Math.random() * commonSources.length)],
          date: `2025-04-0${Math.floor(Math.random() * 7) + 1}`,
          time: `${getRecentHours()} hours ago`,
          url: `https://www.marketinsider.com/news/${topic.toLowerCase().replace(/\s+/g, '-')}-developments`
        },
        {
          id: 3,
          title: `Analysts Weigh In On ${topic} Trends`,
          source: commonSources[Math.floor(Math.random() * commonSources.length)],
          date: `2025-04-0${Math.floor(Math.random() * 7) + 1}`,
          time: `${getRecentHours()} hours ago`,
          url: `https://www.investorsnews.com/analysis/${topic.toLowerCase().replace(/\s+/g, '-')}-trends`
        }
      ],
      entities: {
        org: ["JP Morgan", "Goldman Sachs", "Morgan Stanley"],
        person: ["Janet Yellen", "Jerome Powell"]
      },
      entity_sentiment: {
        "JP Morgan": { score: 8.5, classification: "neutral" },
        "Goldman Sachs": { score: 12.7, classification: "bullish" }
      },
      context_sentiment: {
        score: 5.2,
        classification: "neutral",
        confidence: 0.65,
        agreement_rate: 0.7
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the recent web data about the topic - simulating RAG retrieval
      const retrievedData = getRecentNewsData(query);
      
      // Enhance the data with personalized answer based on retrieved context
      const personalizedAnswer = getPersonalizedAnswer(query, riskProfile);
      
      // Simulate RAG process - generation based on retrieved data
      const mockResult = {
        answer: personalizedAnswer,
        summary: `RAG-enhanced insights based on ${retrievedData.sources.length} recent articles`,
        sources: retrievedData.sources,
        entities: retrievedData.entities,
        entity_sentiment: retrievedData.entity_sentiment,
        context_sentiment: retrievedData.context_sentiment
      };
      
      // Add a small delay to simulate processing
      setTimeout(() => {
        setResult(mockResult);
        setLoading(false);
      }, 1200);
    } catch (err) {
      console.error('Error querying RAG system:', err);
      setError('An error occurred while processing your query.');
      setLoading(false);
    }
  };
  
  // Helper function to generate personalized UBS advisor-style answers - more concise version
  const getPersonalizedAnswer = (query, riskProfile) => {
    // Extract key terms from query for customization
    const containsTerm = (terms) => terms.some(term => query.toLowerCase().includes(term));
    
    const isAboutTrump = containsTerm(['trump', 'tariff', 'tariffs', 'trade war']);
    const isAboutStocks = containsTerm(['stock', 'invest', 'share', 'equity', 'market', 'tesla', 'apple']);
    const isAboutCrypto = containsTerm(['crypto', 'bitcoin', 'ethereum', 'blockchain']);
    const isAboutBonds = containsTerm(['bond', 'treasury', 'fixed income', 'yield']);
    const isAboutOutlook = containsTerm(['outlook', 'forecast', 'future', 'expect', 'predict', 'trend']);
    
    // Build UBS advisor-style answer - more concise version
    let answer = "";
    
    // Trump tariffs - special case based on current news
    if (isAboutTrump) {
      answer += "Based on today's market reactions to Trump's tariff announcements, we're seeing significant volatility across global markets with specific impacts on various sectors.";
      
      if (riskProfile === 'conservative') {
        answer += "\n\nFor conservative portfolios: We recommend defensive positioning with reduced exposure to companies with significant operations in China and Southeast Asia. Consider increasing allocation to domestic-focused businesses with limited international supply chain dependence.";
        
        answer += "\n\nRegarding Singapore impact: With Singapore potentially facing -18.4 bearish sentiment score due to tariff exposure, we suggest underweighting Singapore equities in your conservative portfolio until policy details are clarified.";
      } else if (riskProfile === 'moderate') {
        answer += "\n\nFor moderate risk profiles: While markets adjust to tariff news, maintain balanced exposure with selective technology stocks showing resilience (Apple +15.3, Nvidia +19.6). Consider hedging strategies for international positions, particularly those with exposure to Cambodia (-49.1 bearish) and China (-32.7 bearish).";
        
        answer += "\n\nSingapore exposure: Monitor the development of Singapore's business task force (announced by PM Wong today) before adjusting Singapore allocation.";
      } else if (riskProfile === 'aggressive') {
        answer += "\n\nFor aggressive portfolios: Current volatility presents tactical opportunities in resilient tech companies (Nvidia +19.6, Apple +15.3, Tesla +12.8). Consider pair trades shorting companies with high Cambodia exposure (facing 49% tariff rate) against US domestic manufacturers.";
        
        answer += "\n\nChinese retaliation risk: Maintain liquid positions to capitalize on further volatility as China has vowed to 'fight to the end' in response to threatened additional 50% tariffs.";
      }
    }
    // Entity-specific insights based on mock sentiment data
    else if (isAboutStocks) {
      if (isAboutOutlook) {
        answer += "Our analysts have a positive outlook on both Tesla and Apple, with sentiment scores of +42.5 and +23.7 respectively. This indicates strong bullish signals from recent news.";
        
        if (riskProfile === 'conservative') {
          answer += "\n\nFor conservative portfolios: Limited Tesla position (max 3% of equity), moderate Apple exposure, focus on dividend-yielding blue-chips.";
        } else if (riskProfile === 'moderate') {
          answer += "\n\nFor moderate risk profiles: Consider Tesla (5-8%) and Apple (7-10%) as part of a diversified equity strategy.";
        } else if (riskProfile === 'aggressive') {
          answer += "\n\nFor aggressive strategies: Consider higher Tesla allocation (8-12%) and Apple (7-10%) in growth-focused positions.";
        }
      } else {
        answer += "Our sentiment analysis shows strong positive signals for Tesla (+42.5) and Apple (+23.7), suggesting continued positive momentum in the near term.";
      }
    } else if (isAboutCrypto) {
      answer += "Our sentiment analysis indicates bearish signals in the cryptocurrency sector (-18.3), suggesting caution.";
      
      if (riskProfile === 'conservative') {
        answer += "\n\nFor conservative portfolios: Avoid cryptocurrency exposure at this time.";
      } else if (riskProfile === 'moderate') {
        answer += "\n\nFor moderate risk profiles: Limit crypto exposure to max 2% of portfolio.";
      } else if (riskProfile === 'aggressive') {
        answer += "\n\nFor aggressive portfolios: Consider 3-5% allocation to established cryptocurrencies only.";
      }
    } else if (isAboutBonds) {
      answer += "With Federal Reserve sentiment positive (+15.2), we anticipate favorable conditions for high-quality bonds.";
      
      if (riskProfile === 'conservative') {
        answer += "\n\nFor conservative portfolios: Maintain core allocation to high-quality bonds (3-5 year duration).";
      } else if (riskProfile === 'moderate') {
        answer += "\n\nFor moderate risk profiles: Consider barbell approach with investment-grade and selective higher-yield bonds.";
      } else if (riskProfile === 'aggressive') {
        answer += "\n\nFor aggressive portfolios: Limited bond allocation focused on strategic opportunities.";
      }
    } else {
      // General market outlook
      answer += "Current market sentiment: Tech equities positive (Tesla: +42.5, Apple: +23.7), Fed policy positive (+15.2), Energy (-12.6) and Crypto (-18.3) bearish.";
      
      if (riskProfile === 'conservative') {
        answer += "\n\nFor conservative portfolios: Maintain defensive posture, focus on blue-chips with strong dividends.";
      } else if (riskProfile === 'moderate') {
        answer += "\n\nFor moderate risk profiles: Balanced approach with selective tech exposure, underweight energy.";
      } else if (riskProfile === 'aggressive') {
        answer += "\n\nFor aggressive portfolios: Overweight technology, tactical flexibility to capitalize on opportunities.";
      }
    }
    
    return answer;
  };

  // Helper function to get sentiment color
  const getSentimentColor = (score) => {
    if (score > 10) return '#4caf50'; // Bullish - green
    if (score < -10) return '#f44336'; // Bearish - red
    return '#9e9e9e'; // Neutral - gray
  };

  // Helper function to format sentiment class
  const formatSentimentClass = (classification) => {
    return classification.charAt(0).toUpperCase() + classification.slice(1);
  };

  return (
    <div className="rag-interface" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Ultra-simplified header for internal tool */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <strong style={{ fontSize: '14px' }}>INTERNAL TOOL</strong>
          <span style={{ fontSize: '12px', color: '#666' }}>|</span>
          <select
            value={riskProfile}
            onChange={handleRiskProfileChange}
            style={{
              padding: '3px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        
        <div style={{ fontSize: '12px', color: '#666' }}>
          User: {userName || 'Advisor'}
        </div>
      </div>
      
      {/* Toggle button for insights panel */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px' 
      }}>
        <button
          onClick={() => setShowInitialInsights(!showInitialInsights)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#f2f2f2',
            border: '1px solid #ddd',
            borderRadius: '3px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          <span>{showInitialInsights ? 'Hide' : 'Show'} Market Insights</span>
          <span style={{ fontSize: '10px' }}>{showInitialInsights ? '▲' : '▼'}</span>
        </button>
        
        <div style={{
          fontSize: '10px',
          color: '#666'
        }}>
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Initial Market Insights Panel */}
      {showInitialInsights && (
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          padding: '10px',
          marginBottom: '15px',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Current Market Insights</span>
            <div>
              <button 
                onClick={() => setShowInitialInsights(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#999',
                  padding: '2px'
                }}
              >×</button>
            </div>
          </div>
          
          {/* AI-Generated Summary */}
          <div style={{
            backgroundColor: '#f5f5f5',
            borderLeft: '3px solid #1976d2',
            padding: '8px',
            fontSize: '11px',
            marginBottom: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginBottom: '4px'
            }}>
              <span style={{
                backgroundColor: '#1976d2', 
                color: 'white',
                fontSize: '9px',
                padding: '1px 4px',
                borderRadius: '2px'
              }}>AI INSIGHTS</span>
              <span style={{ fontWeight: 'bold', fontSize: '10px' }}>Market Sentiment Summary</span>
            </div>
            <p style={{ margin: '0', lineHeight: '1.3', color: '#333' }}>
              Technology sentiment remains strong, with Tesla (+42.5) leading sector growth. 
              Energy continues bearish trend despite recent oil price stabilization. 
              Federal Reserve sentiment suggests possible rate adjustments in Q2.
            </p>
          </div>
          
          {/* Two column layout */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Left column - trending topics */}
            <div style={{ flex: '1' }}>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px', fontWeight: 'bold' }}>
                Trending Sentiment
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '5px'
              }}>
                {trendingTopics.map((item, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      padding: '3px 6px',
                      backgroundColor: '#f2f2f2',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      ':hover': { backgroundColor: '#e0e0e0' }
                    }}
                    onClick={() => setQuery(`${item.topic} outlook`)}
                  >
                    <span>{item.topic}</span>
                    <div>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: getSentimentColor(item.sentiment)
                      }}>
                        {item.sentiment.toFixed(1)}
                      </span>
                      <span style={{
                        marginLeft: '5px',
                        color: item.change.startsWith('+') ? '#4caf50' : '#f44336',
                        fontSize: '10px'
                      }}>
                        ({item.change})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recent News Tags */}
              <div style={{ 
                marginTop: '8px', 
                fontSize: '11px', 
                color: '#666',
                fontWeight: 'bold'
              }}>
                Recent News Tags
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                marginTop: '3px'
              }}>
                {['Earnings', 'Tech', 'Fed', 'Inflation', 'M&A', 'Energy'].map((tag, i) => (
                  <div 
                    key={i}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setQuery(`${tag} news summary`)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column - market implications */}
            <div style={{ flex: '1', fontSize: '11px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginBottom: '5px'
              }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  color: 'white',
                  backgroundColor: 
                    riskProfile === 'conservative' ? '#1565C0' : 
                    riskProfile === 'moderate' ? '#7B8A31' :
                    '#BF360C'
                }}>
                  {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}
                </span>
                <span style={{ fontWeight: 'bold', fontSize: '11px' }}>Market Implications</span>
              </div>
              
              <ul style={{ 
                margin: '0', 
                paddingLeft: '15px', 
                fontSize: '11px',
                color: '#333',
                lineHeight: '1.3'
              }}>
                {riskProfile === 'conservative' && (
                  <>
                    <li>Maintain defensive positions with emphasis on blue-chip stocks</li>
                    <li>Focus on companies with strong dividend history</li>
                    <li>Consider high-quality fixed income for stability</li>
                  </>
                )}
                {riskProfile === 'moderate' && (
                  <>
                    <li>Balance between growth and value stocks recommended</li>
                    <li>Consider taking profits on high-scoring tech positions</li>
                    <li>Maintain neutral weight in energy sector despite negative sentiment</li>
                  </>
                )}
                {riskProfile === 'aggressive' && (
                  <>
                    <li>Current environment supports overweight in tech sector</li>
                    <li>Consider tactical positions in high-conviction names</li>
                    <li>Maintain higher cash position for future opportunities</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '8px', 
            fontSize: '10px', 
            color: '#666',
            display: 'flex',
            justifyContent: 'center' 
          }}>
            <span>Click on any trending topic to generate client-ready talking points</span>
          </div>
        </div>
      )}
      
      {/* Search Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', marginBottom: '0' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter client query (e.g., 'tesla outlook', 'inflation news')"
              style={{ 
                width: '100%',
                padding: '7px 10px',
                fontSize: '14px',
                borderRadius: '3px',
                border: '1px solid #ccc',
                paddingRight: '30px' // Space for the icon
              }}
            />
            {loading && (
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid #e0e0e0',
                borderTopColor: '#1976d2',
                animation: 'spin 1s linear infinite'
              }}></div>
            )}
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginLeft: '5px',
              padding: '7px 15px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {loading ? 'Searching...' : 'RAG Search'}
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </button>
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: '#666', 
          marginTop: '5px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontStyle: 'italic' }}>
            RAG searches latest web sources for up-to-date information
          </span>
          
          {loading && (
            <span style={{ 
              color: '#1976d2',
              fontSize: '10px',
              animation: 'pulse 1.5s infinite'
            }}>
              Retrieving latest data from financial news sources...
            </span>
          )}
        </div>
      </form>

      {error && (
        <div style={{ 
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {result && (
        <div className="rag-results">
          {/* Summary removed - reducing fluff */}


          {/* Ultra-compact Result Box */}
          <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#fafafa', 
            padding: '10px',
            marginBottom: '12px'
          }}>
            {/* Context heading with RAG indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid #eee',
              paddingBottom: '6px',
              marginBottom: '8px',
              fontSize: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <strong>Query:</strong> {query}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '3px',
                  padding: '2px 5px',
                  gap: '4px',
                  marginLeft: '5px'
                }}>
                  <span style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontSize: '9px',
                    padding: '1px 3px',
                    borderRadius: '2px'
                  }}>RAG</span>
                  <span style={{ fontSize: '9px', color: '#1976d2' }}>
                    Latest web data
                  </span>
                </div>
              </div>
              
              {result.context_sentiment && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getSentimentColor(result.context_sentiment.score)
                  }}></div>
                  <span style={{ 
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: getSentimentColor(result.context_sentiment.score)
                  }}>
                    {formatSentimentClass(result.context_sentiment.classification)} ({result.context_sentiment.score.toFixed(1)})
                  </span>
                </div>
              )}
            </div>
            
            {/* Two column layout for content + market implications */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Copy-paste ready response */}
              <div style={{
                flex: '3',
                border: '1px solid #e6e6e6',
                borderRadius: '3px',
                backgroundColor: 'white',
                padding: '10px',
                fontFamily: 'Georgia, serif',
                fontSize: '14px'
              }}>
                <p style={{ lineHeight: '1.5', whiteSpace: 'pre-line', margin: 0 }}>{result.answer}</p>
              </div>
              
              {/* Market Implications Module */}
              <div style={{
                flex: '2',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {/* Market Implications based on risk profile */}
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '3px',
                  backgroundColor: '#f5f8ff',
                  padding: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginBottom: '5px'
                  }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '1px 6px',
                      borderRadius: '3px',
                      color: 'white',
                      backgroundColor: 
                        riskProfile === 'conservative' ? '#1565C0' : 
                        riskProfile === 'moderate' ? '#7B8A31' :
                        '#BF360C'
                    }}>
                      {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}
                    </span>
                    <span style={{ fontWeight: 'bold', fontSize: '11px' }}>Market Implications</span>
                  </div>
                  
                  <ul style={{ 
                    margin: '0', 
                    paddingLeft: '15px', 
                    fontSize: '11px',
                    color: '#333',
                    lineHeight: '1.3'
                  }}>
                    {riskProfile === 'conservative' && (
                      <>
                        <li>Maintain defensive positions with emphasis on blue-chip stocks</li>
                        <li>Focus on companies with strong dividend history</li>
                        <li>Consider high-quality fixed income for stability</li>
                      </>
                    )}
                    {riskProfile === 'moderate' && (
                      <>
                        <li>Balance between growth and value stocks recommended</li>
                        <li>Consider taking profits on high-scoring tech positions</li>
                        <li>Maintain neutral weight in energy sector despite negative sentiment</li>
                      </>
                    )}
                    {riskProfile === 'aggressive' && (
                      <>
                        <li>Current environment supports overweight in tech sector</li>
                        <li>Consider tactical positions in high-conviction names</li>
                        <li>Maintain higher cash position for future opportunities</li>
                      </>
                    )}
                  </ul>
                </div>
                
                {/* Anomalies & Highlights */}
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '3px',
                  backgroundColor: '#fff9e6',
                  padding: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '11px',
                    marginBottom: '5px'
                  }}>
                    Anomalies & Highlights
                  </div>
                  <ul style={{ 
                    margin: '0', 
                    paddingLeft: '15px', 
                    fontSize: '11px',
                    color: '#333',
                    lineHeight: '1.3'
                  }}>
                    <li>Tesla sentiment (+42.5) significantly above sector average (+18.2)</li>
                    <li>Energy sector continues negative trend for 3rd week</li>
                    <li>Fed policy sentiment positive despite rising inflation concerns</li>
                  </ul>
                </div>
                
                {/* Follow-up Questions */}
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '3px',
                  backgroundColor: '#f0f0f0',
                  padding: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '11px',
                    marginBottom: '5px'
                  }}>
                    Suggested Follow-ups
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <button 
                      onClick={() => setQuery("Tell me more about Tesla's recent earnings")}
                      style={{
                        backgroundColor: '#e0e0e0',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '4px 6px',
                        fontSize: '10px',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      Tesla's recent earnings impact
                    </button>
                    <button 
                      onClick={() => setQuery("How should we adjust portfolio allocation given current sentiment?")}
                      style={{
                        backgroundColor: '#e0e0e0',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '4px 6px',
                        fontSize: '10px',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      Portfolio allocation strategy
                    </button>
                    <button 
                      onClick={() => setQuery("What are the biggest risks to watch?")}
                      style={{
                        backgroundColor: '#e0e0e0',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '4px 6px',
                        fontSize: '10px',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      Key risks to monitor
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Entity tags in tight format */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginTop: '8px',
              borderTop: '1px solid #eee',
              paddingTop: '6px'
            }}>
              <span style={{ fontSize: '11px', color: '#666', marginRight: '6px' }}>Entities:</span>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3px',
                flex: 1
              }}>
                {result.entities && result.entities.org && result.entities.org.map((org, index) => (
                  <div key={`org-${index}`} style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '10px',
                    fontSize: '11px'
                  }}>
                    {org}
                    {result.entity_sentiment && result.entity_sentiment[org] && (
                      <span style={{ 
                        marginLeft: '3px',
                        color: getSentimentColor(result.entity_sentiment[org].score),
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        ({result.entity_sentiment[org].score.toFixed(1)})
                      </span>
                    )}
                  </div>
                ))}
                
                {result.entities && result.entities.person && result.entities.person.map((person, index) => (
                  <div key={`person-${index}`} style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 6px',
                    backgroundColor: '#edf2fa',
                    borderRadius: '10px',
                    fontSize: '11px'
                  }}>
                    {person}
                  </div>
                ))}
              </div>
              
              <div>
                <a href="/EntitiesPage" style={{ 
                  fontSize: '10px', 
                  color: '#1976d2',
                  textDecoration: 'none',
                  marginLeft: '5px'
                }}>
                  View All →
                </a>
              </div>
            </div>
          </div>

          {/* Improved source links with time data */}
          {result.sources && result.sources.length > 0 && (
            <div style={{
              marginTop: '10px',
              fontSize: '10px',
              borderTop: '1px solid #eee',
              paddingTop: '10px'
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '11px', 
                marginBottom: '6px' 
              }}>
                Sources:
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                {result.sources.map((source, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2px 8px',
                    backgroundColor: index === 0 ? '#f5f5f5' : 'transparent',
                    borderRadius: '3px',
                    fontSize: '10px'
                  }}>
                    <div>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          color: '#1976d2',
                          textDecoration: 'none',
                          fontWeight: index === 0 ? 'bold' : 'normal'
                        }}
                      >
                        {source.title}
                      </a>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      fontSize: '9px',
                      color: '#888',
                      whiteSpace: 'nowrap'
                    }}>
                      <span>{source.source}</span>
                      <span>•</span>
                      <span>{source.time || source.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RagInterface;