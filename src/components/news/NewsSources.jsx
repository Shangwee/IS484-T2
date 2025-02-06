import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SentimentScore from '../ui/SentimentScore';
import { Link } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';

// Dummy news data
const newsData = [
  {
		"id" : 136,
		"publisher" : "Yahoo Finance",
		"description" : "Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC, saw its shares scale northward after posting record fourth-quarter net income, which topped analysts’ projections. The foundry behemoths’ fourth-quarter net profit soared 57% to $374.68 billion from a year earlier, driven by a surge in demand for artificial intelligence (AI) chipsets.\n\nBut it’s not the latest quarterly result that propelled its shares higher. The TSMC stock has already gained 91% in the past year with the advent of AI. However, can the TSMC stock sustain this growth and remain a good buy? Let’s see –\n\n3 Reasons to be Bullish on TSMC Stock\n\nWhile the current quarterly results have boosted the TSMC stock, the long-term growth trajectory depends on the long-term growth prospects. TSMC’s first-quarter revenue guidance of $25 billion to $25.8 billion is 6% higher than expectations, suggesting strong near-term growth. Also, management expects a 20% revenue CAGR over the next five-year period, driven by growth opportunities in AI, 5G smartphones, and high-performance computing.\n\nThe rising demand for TSMC’s custom AI chips from Broadcom Inc. AVGO and Marvell Technology, Inc. MRVL has strengthened its future growth. Meanwhile, Apple Inc. AAPL has witnessed a rise in demand for its smartphones that require TSMC’s chips, a positive development for the latter. TSMC’s bright future is also due to the forthcoming launch of their highly efficient 2-nanometer (nm) chips this year, with pre-order demand exceeding 3 and 5nm.\n\nTSMC’s dominant position in the global foundry market means the stock is well-poised to take advantage of the growing opportunities. After all, the semiconductor market worldwide is projected to generate $1.47 trillion in revenues in 2030 from $729 billion in 2022, per SNS Insider. Management mentioned that the U.S. government’s curb on chip sales to China is “manageable.”\n\nSecond, the new Stargate AI infrastructure program is expected to be a game changer for the TSMC stock. President Trump intends to allocate $500 billion for AI infrastructure, boosting AI stocks. TSMC stands to benefit as its advanced chips are essential for operating AI data centers.\n\nThird, the TSMC stock is likely to rise because the company generates profits efficiently, with a net profit margin of 40.52%, slightly more than the Semiconductor - Circuit Foundry industry’s 40.51%, indicating a high margin.\n\nImage Source: Zacks Investment Research\n\nConsider Buying TSMC Stock\n\nWith the TSMC stock poised to gain in the long term due to multiple growth opportunities, a new Stargate AI infrastructure project, and strong fundamentals, it is judicious for investors to place their bets on the stock now. Brokers also expect the TSMC stock to rise and have raised its average short-term price target by 7.5% to $235.13 from the previous $218.70. The highest short-term price target is $265, indicating an upside of 21.2%.",
		"published_date" : "2025-01-23T12:05:00.000Z",
		"title" : "3 Reasons to Buy TSMC Stock Beyond Record Q4 Net Profit - Yahoo Finance",
		"url" : "https:\/\/finance.yahoo.com\/news\/3-reasons-buy-tsmc-stock-200500471.html",
		"entities" : "{\"entities\": [\"TSMC\"]}",
		"sentiment" : null
	},
	{
		"id" : 137,
		"publisher" : "Arizona Big Media",
		"description" : "Reinforcing a commitment to invest locally in new pathways into the semiconductor industry, today TSMC Arizona was joined by Governor Katie Hobbs and Mayor Kate Gallego to announce the expansion of its Registered Technician Apprenticeship program, offering a road to new jobs. This announcement comes at the start of National Apprenticeship Week, and alongside a one-day Governors Apprenticeship Innovation Summit hosted by the National Association of Governors and held in downtown Phoenix.\n\nMORE NEWS: Here is the global investment outlook for 2025\n\nTechnicians play a vital role in the successful operation of TSMC’s cutting-edge semiconductor manufacturing facilities – or “fabs”. TSMC Arizona’s program expansion includes:\n\nNewly created Equipment Technician Apprenticeships, supported with in-classroom learning at Estrella Mountain Community College.\n\nNewly created Process Technician Apprenticeships, supported with curriculum through Northern Arizona University and Rio Salado College.\n\nNewly created Manufacturing Technician Specialist Intensive Program, with training offered through Grand Canyon University and Western Maricopa Education Center (West-MEC).\n\nAdditional Facilities Technician Apprenticeships, with continued in-classroom learning at Estrella Mountain Community College.\n\n“One of the top considerations in TSMC’s decision to expand here was the opportunity to tap a local and diverse talent pipeline and collaborate with a world class US education system. Our first-of-its kind program for semiconductor technicians represents what’s possible when government, industry and education come together,” said Rose Castaneres, president of TSMC Arizona. “We are deeply committed to creating job opportunities for local Arizonans. Our newest technician apprentices will get the support and training they need to thrive in their new careers, and help us make the most advanced semiconductor technology in the United States.”\n\n“The semiconductor industry has created opportunities for countless Arizonans to gain access to good-paying, stable jobs,” said Governor Katie Hobbs. “Today, we are making that opportunity more accessible by creating new pathways into this growing, high-tech sector through robust new apprenticeship programs. With strong partners like TSMC, Arizona has been a leader in synchronizing our workforce efforts and investing in training that meets private sector needs and target key industries powering our economy, and today’s announcement is a continuation of our commitment to connecting Arizonans to the jobs of the future.”\n\n“Today’s announcement is a significant step forward in our commitment to invest in our residents and create new, high-wage career pathways into Arizona’s growing semiconductor industry. By expanding the registered apprenticeship program and adding even more opportunities for training, TSMC is helping to build and upskill the strong workforce it needs to continue making the cutting-edge chips that power virtually every piece of technology in the modern world. The City of Phoenix is proud to support TSMC in building off our existing partnership to ensure Phoenicians have access to top-tier instruction and rewarding jobs,” said Mayor Kate Gallego.\n\nEarlier this year, TSMC Arizona unveiled a first-of-its-kind semiconductor-industry focused Registered Technician Apprenticeship for Facilities Technicians. This program was sponsored by the City of Phoenix, and supported with classroom curriculum co-developed with Maricopa Community Colleges. The first cohort started as TSMC Arizona full time employees in April, and are now earning their on-the-job training hours, and attending courses at Estrella Mountain Community College. The estimated time to complete an apprenticeship is 18-24 months, with opportunities to pursue stackable credentials and an optional associates degree.\n\nTSMC Arizona is investing more than $5M in this program representing on-the-job training hours and education tuition support for its apprentice employees as they earn their apprenticeships or “journeyman cards.” The program is also supported by the City of Phoenix and the Arizona Commerce Authority. This effort is also backed by the Department of Commerce as part of the CHIPS Act funding incentive program to mobilize the regional workforce for large-scale semiconductor investments.\n\nOnce all three TSMC Arizona advanced-manufacturing fabs are fully operational in Phoenix, its local workforce will near 6000, which will include thousands of technicians. TSMC Arizona is partnering with these educational institutions now to recruit and hire more nearly 130 new apprentices and trainees in 2025. This is in addition to the hundreds of open positions for its Phoenix operation.",
		"published_date" : "2025-01-23T04:10:30.000Z",
		"title" : "TSMC Arizona offers new jobs via Technician Apprentice Program - Arizona Big Media",
		"url" : "https:\/\/azbigmedia.com\/business\/tsmc-arizona-offers-new-jobs-via-technician-apprentice-program\/",
		"entities" : "{\"entities\": [\"TSMC\"]}",
		"sentiment" : null
	},
	{
		"id" : 138,
		"publisher" : "AOL",
		"description" : "TAIPEI (Reuters) -Chipmaker TSMC said on Tuesday that all its sites were operating following an overnight 6.4 magnitude earthquake in southern Taiwan that was centred on a mountainous rural area and caused only minor damage and light injuries.\n\nTaiwan Semiconductor Manufacturing Co, the dominant maker of advanced chips and a major supplier to companies including Apple and Nvidia said it had evacuated workers at some sites in central and southern Taiwan as a precaution after the quake, which hit shortly past midnight on Tuesday.\n\n\"Post-earthquake structural inspections have been completed at all sites, confirming that the structures are safe and operations are gradually resuming,\" it said in an emailed statement.\n\n\"Currently, the water supply, power, and workplace safety systems are functioning normally and all TSMC's sites are operating. Detailed inspections and impact assessments are ongoing.\"\n\nTSMC's construction sites were unaffected and they have continued regular operations following environmental safety checks, it added.\n\nTaiwan's fire department said 27 people were treated in hospital for their injuries following the quake, while Taipower said electricity had been restored by mid-morning for all 30,000 households impacted by blackouts.\n\nTaiwan lies near the junction of two tectonic plates and is prone to earthquakes.\n\nTaiwan's last major earthquake was in April, a 7.2 magnitude temblor that hit the east coast county of Hualien, killing 13 people.\n\n(Reporting by Ben Blanchard; Editing by Himani Sarkar and Saad Sayeed)",
		"published_date" : "2025-01-23T18:19:20.000Z",
		"title" : "TSMC says all its sites operating following Taiwan quake - AOL",
		"url" : "https:\/\/www.aol.com\/news\/tsmc-says-sites-operating-following-040739515.html",
		"entities" : "{\"entities\": [\"TSMC\"]}",
		"sentiment" : null
	},
	{
		"id" : 139,
		"publisher" : "TrendForce",
		"description" : "After the 6.4 earthquake on January 21, Taiwanese foundry giant TSMC reportedly managed to restore operations and largely resume normal production by January 23, according to the Commercial Times.\n\nMeanwhile, another report from Liberty Times highlights that while TSMC’s Fab 18, specializing in advanced 3nm and 5nm nodes, was fully operational by January 23, the recovery timeline for Fab 14, which focuses on legacy nodes, remains uncertain.\n\nThe Liberty Times report, citing supply chain sources, discloses that Fab 18 is a newly built facility with a high seismic resistance rating. However, the earthquake might still cause an estimated 30-40% impact on equipment, with over 25,000 to 30,000 wafers reportedly damaged.\n\nOn the other hand, TSMC’s Fab 14 might not be as fortunate, as it is an older facility producing mature nodes. According to Liberty Times, supply chain sources estimate that around half of the equipment in the fab was affected, with over 30,000 wafers from Fab 14A and 14B rendered unusable.\n\nThe Commercial Times suggests that in the 7.1 magnitude earthquake in April 2024, TSMC reported earthquake-related losses of only NT$3 billion (USD 91.6 million), which affected its Q2 gross margin by approximately 0.5 percentage points. In comparison, the financial impact of this recent earthquake is expected to be manageable, the report adds.\n\nTrendForce notes that TSMC operates an 8-inch fab and two 12-inch fabs in Tainan, producing a wide range of technologies from mature nodes to advanced 5\/4nm and 3nm processes.\n\nAccording to TrendForce, while the Tainan fabs produce a diverse range of products, the overall utilization rate for mature processes is currently at 70–80%, reflecting the seasonal lull in component demand. This provides significant flexibility for production adjustments. For advanced nodes, TrendForce believes most current wafer starts are for inventory preparation, and the short downtime or minor debris impact can be easily mitigated. As a result, no significant disruptions are anticipated.\n\nRead more\n\n[News] 6.4 Magnitude Earthquake Hits Southern Taiwan, TSMC Evacuates Factories, Impact Under Review\n\n(Photo credit: TSMC)",
		"published_date" : "2025-01-23T18:36:00.000Z",
		"title" : "[News] TSMC Reportedly Expects Fab 18 Recovery by Jan. 23, Fab 14 Timeline Uncertain After 6.4 Earthquake - TrendForce",
		"url" : "https:\/\/www.trendforce.com\/news\/2025\/01\/24\/news-tsmc-reportedly-expects-fab-18-recovery-by-jan-23-fab-14-timeline-uncertain-after-6-4-magnitude-earthquake\/",
		"entities" : "{\"entities\": [\"TSMC\"]}",
		"sentiment" : null
	},
	{
		"id" : 140,
		"publisher" : "DIGITIMES",
		"description" : "Save my User ID and Password\n\nSome subscribers prefer to save their log-in information so they do not have to enter their User ID and Password each time they visit the site. To activate this function, check the 'Save my User ID and Password' box in the log-in section. This will save the password on the computer you're using to access the site.",
		"published_date" : "2025-01-23T21:48:24.000Z",
		"title" : "Trump policies drive supply chain shift to Arizona - DIGITIMES",
		"url" : "https:\/\/www.digitimes.com\/news\/a20250122PD220\/arizona-production-tsmc-supply-chain-market.html",
		"entities" : "{\"entities\": [\"TSMC\"]}",
		"sentiment" : null
	}
];

// Main News Component
const NewsSources = () => {
    const location = useLocation();
    console.log("Location object:", location);
    const { id } = location.state || {id: null}; // Retrieve the id from state
    console.log(id);  
    const filteredNewsData = id ? newsData.filter((newsItem) => newsItem.id === id) : newsData;
    const styles = {

    newsBox: {
        minHeight: '350px', // Ensure all boxes are at least 350px tall
        maxHeight: '400px', // Optional: Limit maximum height to prevent large content overflow
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px', // Add some padding for better spacing
        display: 'flex', // Flex container for child alignment
        flexDirection: 'column', // Align content vertically
        justifyContent: 'space-between', // Space out the header, content, and footer evenly
        overflow: 'hidden', // Handle overflow gracefully
    },
    newsHeader: {
      fontSize: 'calc(10px + 1vw)', // Dynamic font size
      fontWeight: 'bold',
      color: '#555555',

    },
    newsSummary: {
        fontSize: 'calc(12px + 0.5vw)',
        color: '#555555',
        overflow: 'hidden', // Hide overflowing content
        textOverflow: 'ellipsis', // Add ellipsis for truncated text
        display: '-webkit-box', // Ensure multiline truncation works
        WebkitLineClamp: 5, // Limit to 5 lines
        WebkitBoxOrient: 'vertical',
    },
    newsDate: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: '#555555',
    },
    
    newsLink: {
      fontSize: 'calc(12px + 0.5vw)', // Dynamic font size
      color: '#555555',
    }, 
    sentimentScore: {
      fontSize: '14px',
      color: '#4CAF50', // Example color for sentiment score
      fontWeight: 'bold',
      position: 'absolute', // Position sentiment score absolutely inside the news box
      top: '20px',  // Adjust this value for vertical positioning
      right: '10px', // Adjust this value for horizontal positioning
    }

  };

  if (!id) {
    return <p>No ID provided. Please navigate correctly.</p>;
  } else {
  return (
    <Container fluid className="news-container">
      <Row style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredNewsData.map((newsItem) => (
          <Col key={newsItem.id} md={5} className="mb-4 ml-4" style={{ display: 'flex' }}>
             
            <div style={styles.newsBox} className="news-box">
              <Link 
              to={newsItem.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.newsLink}
              >  
                <h4 style={styles.newsHeader}>{newsItem.title}</h4>  
              </Link> 
              <div style={styles.sentiment}>
                <SentimentScore  newsId={newsItem.id} />
              </div>
              <h4 style={styles.newsDate}>{new Date(newsItem.published_date).toLocaleDateString()}</h4> 
              {/* <h4 style={styles.newsLink}>{newsItem.link}</h4>  */}
              <p style={styles.newsSummary}>{newsItem.description}</p> 
              <div style={styles.sentiment}>
              </div>
              

            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
}

export default NewsSources;

