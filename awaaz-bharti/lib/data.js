// Centralized dummy data — replace with API calls later

const sampleContent = `
<p>The Parliament of India has officially passed the landmark Digital India Bill 2026, marking a significant milestone in the nation's journey towards becoming a global digital powerhouse. The bill, which received overwhelming support from both the ruling and opposition parties, aims to provide a comprehensive legal framework for the country's rapidly evolving digital ecosystem.</p>

<p>The legislation introduces sweeping reforms in several key areas, including data privacy, artificial intelligence (AI) governance, and digital infrastructure development. One of the most notable features of the bill is the establishment of a dedicated Digital Protection Authority, which will be responsible for overseeing the implementation of data protection standards and addressing grievances related to digital rights.</p>

<h3>Key Provisions of the Bill</h3>
<p>The bill outlines several critical provisions designed to protect citizens while fostering innovation:</p>
<ul>
  <li><strong>Data Sovereignty:</strong> Stricter rules on where and how the personal data of Indian citizens can be stored and processed.</li>
  <li><strong>AI Governance:</strong> A framework for the ethical development and deployment of AI technologies, ensuring transparency and accountability.</li>
  <li><strong>Digital Inclusion:</strong> Initiatives to bridge the digital divide by expanding high-speed internet access to rural and underserved areas.</li>
  <li><strong>Cybersecurity:</strong> Enhanced measures to combat cyber threats and protect national digital infrastructure.</li>
</ul>

<p>Prime Minister addressed the nation shortly after the bill's passage, calling it a "watershed moment for our democracy." He emphasized that the Digital India Bill 2026 is not just a piece of legislation but a roadmap for a more inclusive and secure digital future for all 1.4 billion citizens.</p>

<p>Industry leaders have also welcomed the move. CEOs of major tech firms like Infosys and TCS noted that the regulatory clarity provided by the bill would boost investor confidence and encourage further investment in India's technology sector.</p>

<p>However, some civil society groups have raised concerns about certain sections of the bill, particularly those related to government access to encrypted data for national security purposes. These groups have called for more robust checks and balances to prevent potential misuse of these powers.</p>
`;

export const breakingHeadlines = [
  "Parliament passes landmark Digital India Bill 2026 with overwhelming majority",
  "Sensex rallies 800 points as RBI holds interest rates steady at 6%",
  "ISRO's Gaganyaan mission crew selection enters final phase",
  "India to host 2028 Asian Games — IOA confirms bid success",
  "Monsoon to arrive early this year, IMD predicts above-normal rainfall",
];

export const heroArticle = {
  id: "hero-1",
  title: "Parliament Passes Landmark Digital India Bill 2026, Aims to Reshape Nation's Tech Future",
  description: "The bill, passed with bipartisan support, introduces sweeping reforms in data privacy, AI governance, and digital infrastructure that will impact 1.4 billion citizens.",
  content: sampleContent,
  image: "/hero_parliament.png",
  badge: "Breaking",
  badgeType: "breaking",
  author: "Sanjay Kumar",
  date: "April 27, 2026",
};

export const heroSideArticles = [
  { id: "side-1", title: "Budget Session: Opposition Demands Discussion on Rising Fuel Prices", image: "/politics_news.png", badge: "LIVE", badgeType: "live", time: "12 min ago", author: "Rajesh Sharma", date: "April 27, 2026", content: sampleContent },
  { id: "side-2", title: "Sensex Surges 800 Points as RBI Holds Interest Rates at 6%", image: "/business_news.png", badge: "Business", badgeType: "business", time: "28 min ago", author: "Anita Desai", date: "April 27, 2026", content: sampleContent },
  { id: "side-3", title: "ISRO Gaganyaan Crew Selection Enters Final Phase, Launch Slated for 2027", image: "/tech_news.png", badge: "Technology", badgeType: "tech", time: "45 min ago", author: "Vikram Patel", date: "April 27, 2026", content: sampleContent },
  { id: "side-4", title: "India Confirms Bid to Host 2028 Asian Games — IOA Announces", image: "/sports_news.png", badge: "Sports", badgeType: "sports", time: "1 hr ago", author: "Sunil Gavaskar", date: "April 27, 2026", content: sampleContent },
];

export const liveUpdates = [
  { time: "3:45 PM — Just Now", headline: 'PM addresses nation on Digital India Bill; calls it "watershed moment for democracy"', description: "In a televised address, the Prime Minister outlined the key provisions of the bill and how it will protect citizens' digital rights while fostering innovation." },
  { time: "3:20 PM", headline: "Lok Sabha passes Digital India Bill with 389 votes in favour", description: "The bill received support from across the political spectrum, with only 42 members voting against the legislation." },
  { time: "2:55 PM", headline: "Opposition leader praises data privacy provisions, raises concerns over AI surveillance clause", description: "While supporting the bill overall, the opposition has demanded amendments to Section 47 which deals with AI-based monitoring systems." },
  { time: "2:30 PM", headline: "Tech industry leaders welcome bill, Infosys and TCS stocks rise 3%", description: "Major IT companies see the bill as a positive step that will bring regulatory clarity and boost investor confidence." },
];

export const videos = [
  { title: "Digital India Bill Explained: What It Means For You", image: "/hero_parliament.png", duration: "12:34", views: "2.4K", time: "1 hr ago" },
  { title: "Market Analysis: Why Sensex Surged 800 Points Today", image: "/business_news.png", duration: "8:21", views: "1.8K", time: "2 hrs ago" },
  { title: "India's Asian Games 2028 Bid: A Complete Breakdown", image: "/sports_news.png", duration: "15:07", views: "3.1K", time: "3 hrs ago" },
];

export const categorySections = [
  {
    id: "politics", title: "Politics", emoji: "🏛️",
    featured: { id: "pol-feat", title: "Cabinet Reshuffle Expected Next Week as PM Consolidates Power Ahead of State Elections", image: "/politics_news.png", badge: "Politics", badgeType: "politics", author: "Rajesh Sharma", time: "2 hrs ago", date: "April 27, 2026", content: sampleContent },
    articles: [
      { id: "pol-1", title: "Opposition Parties Form Alliance for Upcoming State Elections in 5 States", image: "/hero_parliament.png", time: "3 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Politics", badgeType: "politics" },
      { id: "pol-2", title: "Rajya Sabha Debates New Education Policy Amendments", image: "/politics_news.png", time: "4 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Politics", badgeType: "politics" },
      { id: "pol-3", title: "Supreme Court Verdict on Electoral Bonds Expected This Week", image: "/hero_parliament.png", time: "5 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Politics", badgeType: "politics" },
      { id: "pol-4", title: "ECI Announces Schedule for Delimitation Exercise in J&K", image: "/politics_news.png", time: "6 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Politics", badgeType: "politics" },
    ],
  },
  {
    id: "business", title: "Business", emoji: "📈",
    featured: { id: "biz-feat", title: "India's GDP Growth Projected at 7.2% for FY27, Says World Bank Report", image: "/business_news.png", badge: "Business", badgeType: "business", author: "Anita Desai", time: "1 hr ago", date: "April 27, 2026", content: sampleContent },
    articles: [
      { id: "biz-1", title: "Rupee Strengthens to 82.5 Against Dollar After RBI Decision", image: "/business_news.png", time: "2 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Business", badgeType: "business" },
      { id: "biz-2", title: "Reliance-Jio Announces ₹75,000 Crore Investment in AI Infrastructure", image: "/tech_news.png", time: "3 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Business", badgeType: "business" },
      { id: "biz-3", title: "UPI Transactions Cross 20 Billion Mark in March 2026", image: "/business_news.png", time: "5 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Business", badgeType: "business" },
      { id: "biz-4", title: "Tata Group Plans $5 Billion Semiconductor Fab in Gujarat", image: "/tech_news.png", time: "6 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Business", badgeType: "business" },
    ],
  },
  {
    id: "technology", title: "Technology", emoji: "💻",
    featured: { id: "tech-feat", title: "India Launches BharatGPT — A Multilingual AI Model Supporting 22 Official Languages", image: "/tech_news.png", badge: "Technology", badgeType: "tech", author: "Vikram Patel", time: "3 hrs ago", date: "April 27, 2026", content: sampleContent },
    articles: [
      { id: "tech-1", title: "5G Coverage Now Reaches 85% of Urban India, DoT Reports", image: "/tech_news.png", time: "4 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Technology", badgeType: "tech" },
      { id: "tech-2", title: "Indian Startups Raise $4.8 Billion in Q1 2026, Highest in 3 Years", image: "/business_news.png", time: "5 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Technology", badgeType: "tech" },
      { id: "tech-3", title: "DRDO Tests Hypersonic Cruise Missile Successfully at Mach 6", image: "/tech_news.png", time: "7 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Technology", badgeType: "tech" },
      { id: "tech-4", title: "Apple to Open First Manufacturing Unit in Bangalore by 2027", image: "/business_news.png", time: "8 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Technology", badgeType: "tech" },
    ],
  },
  {
    id: "sports", title: "Sports", emoji: "🏏",
    featured: { id: "sports-feat", title: "Team India Clinches Test Series 3-1 Against Australia in Historic Down Under Win", image: "/sports_news.png", badge: "Sports", badgeType: "sports", author: "Sunil Gavaskar", time: "4 hrs ago", date: "April 27, 2026", content: sampleContent },
    articles: [
      { id: "sports-1", title: "IPL 2026: Mumbai Indians Top Table After 8 Consecutive Wins", image: "/sports_news.png", time: "5 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Sports", badgeType: "sports" },
      { id: "sports-2", title: "Neeraj Chopra Sets New National Record in Javelin at Diamond League", image: "/sports_news.png", time: "6 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Sports", badgeType: "sports" },
      { id: "sports-3", title: "Indian Women's Hockey Team Qualifies for 2028 Olympics", image: "/sports_news.png", time: "7 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Sports", badgeType: "sports" },
      { id: "sports-4", title: "PV Sindhu Announces Comeback, Eyes 2028 LA Olympics Medal", image: "/sports_news.png", time: "8 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Sports", badgeType: "sports" },
    ],
  },
  {
    id: "entertainment", title: "Entertainment", emoji: "🎬",
    featured: { id: "ent-feat", title: "RRR Director Rajamouli's Next Film Announced — ₹800 Crore Budget Confirmed", image: "/entertainment_news.png", badge: "Entertainment", badgeType: "entertainment", author: "Priya Gupta", time: "2 hrs ago", date: "April 27, 2026", content: sampleContent },
    articles: [
      { id: "ent-1", title: "Bollywood Box Office: 'Mission Bharat' Crosses ₹500 Crore Mark", image: "/entertainment_news.png", time: "3 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Entertainment", badgeType: "entertainment" },
      { id: "ent-2", title: "AR Rahman Wins Grammy for Best World Music Album — Third Win", image: "/entertainment_news.png", time: "5 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Entertainment", badgeType: "entertainment" },
      { id: "ent-3", title: "Netflix India Announces 15 New Original Series for 2026-27", image: "/entertainment_news.png", time: "6 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Entertainment", badgeType: "entertainment" },
      { id: "ent-4", title: "Cannes 2026: Two Indian Films Selected for Official Competition", image: "/entertainment_news.png", time: "8 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Entertainment", badgeType: "entertainment" },
    ],
  },
  {
    id: "health", title: "Health & Crime", emoji: "🏥",
    featured: { id: "health-feat", title: "AIIMS Launches India's First AI-Driven Cancer Screening Program Across 500 Districts", image: "/tech_news.png", badge: "Health", badgeType: "health", author: "Dr. Meena Iyer", time: "3 hrs ago", date: "April 27, 2026", content: sampleContent },
    articles: [
      { id: "health-1", title: "Delhi Police Bust International Cybercrime Ring, 14 Arrested", image: "/politics_news.png", time: "4 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Health", badgeType: "health" },
      { id: "health-2", title: "New Drug-Resistant TB Strain Detected in Maharashtra, WHO Issues Alert", image: "/tech_news.png", time: "5 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Health", badgeType: "health" },
      { id: "health-3", title: "CBI Cracks Down on Multi-Crore Banking Fraud in Mumbai", image: "/hero_parliament.png", time: "6 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Health", badgeType: "health" },
      { id: "health-4", title: "Government Approves ₹12,000 Crore National Mental Health Mission", image: "/business_news.png", time: "7 hrs ago", author: "Staff Reporter", date: "April 27, 2026", content: sampleContent, badge: "Health", badgeType: "health" },
    ],
  },
];

// Helper to get all articles in a flat array for easy lookup
export const allArticles = [
  heroArticle,
  ...heroSideArticles,
  ...categorySections.flatMap(section => [section.featured, ...section.articles])
];

export const trendingItems = [
  { title: "Digital India Bill 2026 — Key Provisions Explained", category: "Politics" },
  { title: "Sensex at Record High: Best Stocks to Watch", category: "Business" },
  { title: "IPL 2026 Points Table After Match 42", category: "Sports" },
  { title: "BharatGPT vs ChatGPT: Feature Comparison", category: "Technology" },
  { title: "Rajamouli's New Film: Cast & Release Date", category: "Entertainment" },
  { title: "Monsoon 2026 Forecast: State-wise Predictions", category: "India" },
  { title: "Gaganyaan Mission: Meet the Astronaut Candidates", category: "Science" },
  { title: "Asian Games 2028: India's Medal Hopes", category: "Sports" },
];
