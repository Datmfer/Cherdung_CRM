import { db } from "../lib/db";

const NEPAL_BLOGS = [
  {
    title: "Guide to Hydropower & Clean Energy Investments in Nepal (2026)",
    slug: "guide-to-hydropower-clean-energy-investments-nepal-2026",
    category: "Investment",
    excerpt: "Explore Nepal's 83,000 MW hydropower potential, IPP framework, cross-border energy trading with India & Bangladesh, and high-yield dividend models.",
    content: `Nepal stands at the forefront of South Asia's renewable energy revolution. With an estimated 83,000 MW of hydroelectric potential and over 43,000 MW deemed economically feasible, the Himalayan nation is rapidly transitioning into a regional clean energy powerhouse.

### Key Growth Drivers in Nepal's Energy Sector

1. **Cross-Border Energy Trade (CBET)**: Nepal's bilateral agreements with India and Bangladesh allow for direct seasonal exports, securing dollar-denominated and regional currency revenues for Independent Power Producers (IPPs).
2. **Promising Yields on Listed IPP Shares**: Over 80 hydropower companies are currently listed on the Nepal Stock Exchange (NEPSE), offering regular bonus shares and cash distributions to retail and institutional investors.
3. **Government Policy Incentives**: 100% income tax exemption for the first 10 years of commercial operation, followed by a 50% tax exemption for the subsequent 5 years.

### Smart Portfolio Allocation in Nepal Hydropower

For balanced CRM portfolios, we recommend maintaining 35% in operational run-of-river projects with steady cash flows, 20% in storage-type projects (such as Upper Tamakoshi & Budhi Gandaki), and the remaining in diversified fixed-yield bonds.`,
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Kathmandu Valley Real Estate & Commercial Hubs: 2026 Valuation Analysis",
    slug: "kathmandu-valley-real-estate-commercial-hubs-2026-analysis",
    category: "Market Analysis",
    excerpt: "Comprehensive evaluation of land appreciation rates across Kathmandu, Lalitpur, Pokhara, and emerging outer ring road developments.",
    content: `Real estate in Nepal has historically served as one of the most reliable stores of value. In 2026, urban growth across the Kathmandu Valley and Pokhara Metropolis continues to drive high commercial lease returns.

### Top Performing Nodes in Nepal

* **Lalitpur & Jhamsikhel**: High rental demand for commercial corporate offices, expat housing, and boutique hospitality hubs. Average annual appreciation: 12.8%.
* **Kathmandu Outer Ring Road & Expressways**: Fast-growing logistics and residential zones driven by improved infrastructure and fast-track connectivity.
* **Pokhara Lakeside & Annapurna Corridor**: Booming tourism and hospitality property developments benefiting from Pokhara International Airport operations.

### Regulatory Considerations & REIT Frameworks

With the Securities Board of Nepal (SEBON) drafting modern Real Estate Investment Trust (REIT) guidelines, investors will soon gain fractional exposure to high-grade commercial assets with low capital thresholds.`,
    coverImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "NEPSE Stock Market Insights: Navigating Dividend Securities & Mutual Funds",
    slug: "nepse-stock-market-insights-navigating-dividend-securities-nepal",
    category: "Portfolio Strategy",
    excerpt: "Best practices for building a resilient dividend portfolio on the Nepal Stock Exchange (NEPSE) using Meroshare and automated CRM tracking.",
    content: `The Nepal Stock Exchange (NEPSE) has experienced massive digital adoption through the Meroshare and TMS (Trade Management System) platforms. With over 6 million demat accounts registered in Nepal, retail and institutional participation is at an all-time peak.

### Core Sectors for Yield & Growth

1. **Commercial & Development Banks**: Known for consistent annual dividend distributions (cash + bonus share combinations).
2. **Mutual Funds & SIPs**: Closed-ended and open-ended mutual funds managed by merchant bankers (e.g., Nabil Invest, NIBL Ace, NIMB Capital) offering 8% to 14% annual returns.
3. **Insurance & Microfinance**: High growth potential during bullish market cycles, suitable for medium-risk investor tiers.

### Risk Management Checklist for Nepalese Investors

* Always check the Non-Performing Loan (NPL) ratio before investing in financial sector equities.
* Diversify across at least 4 distinct sectors (Hydro, Banking, Mutual Funds, Manufacturing).
* Use Cherdung CRM's portfolio tracker to calculate net dividends after Nepal capital gains tax (CGT) deductions.`,
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Fintech & Digital Remittance Growth in Nepal: Transforming Regional Wealth Management",
    slug: "fintech-digital-remittance-growth-nepal-transforming-wealth-management",
    category: "CRM & Tech",
    excerpt: "How eSewa, Khalti, Fonepay QR, and automated digital remittance gateways are accelerating financial inclusion across Nepal.",
    content: `Digital payments in Nepal have evolved at an unprecedented pace. From Fonepay QR codes in local shops to instant digital remittance deposits directly into investment accounts, Nepal's digital financial infrastructure is world-class.

### Key Milestones in Nepal's Fintech Landscape

* **Remittance Integration**: Nepal receives over $11 Billion USD annually in worker remittances. Modern CRM platforms enable direct allocation of remittance savings into interest-bearing capital funds.
* **Interoperable QR Payments**: Over 90% of daily micro-transactions in urban Nepal are settled instantly via NepalPay and Fonepay networks.
* **API Banking & Open CRM**: Bank integration APIs allow users to sync their accounts, track dividend deposits, and execute instant withdrawals safely.`,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Exploring Agribusiness & Organic Export Potential in Nepal",
    slug: "exploring-agribusiness-organic-export-potential-nepal",
    category: "Guides",
    excerpt: "Opportunities in Nepal's high-value agricultural exports including Orthodox Tea, Cardamom, Himalayan Herbs (Yarsagumba), and Coffee.",
    content: `Nepal's unique topography and micro-climates create ideal conditions for high-value organic agricultural products that command premium prices in European, North American, and East Asian markets.

### High-Value Export Commodities

* **Nepal Orthodox Tea**: Grown in the hills of Ilam, Dhankuta, and Panchthar, famous worldwide for its delicate aroma and organic quality.
* **Large Cardamom (Alainchi)**: Nepal is one of the world's largest exporters of black cardamom, supplying spice markets in India and the Gulf.
* **Himalayan Coffee**: High-altitude Arabica coffee cultivated in Gulmi, Palpa, and Nuwakot with growing global demand.

Investors looking for sustainable ESG-compliant returns can participate through agricultural cooperative partnerships and modern cold-chain infrastructure funds.`,
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
];

async function seedNepalBlogs() {
  console.log("🇳🇵 Seeding Nepal-focused blog posts into Prisma DB...");

  // Find or create admin user to set as author
  let admin = await db.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    admin = await db.user.findFirst();
  }

  if (!admin) {
    console.error("❌ No user found in database. Please run user seed first.");
    return;
  }

  console.log(`Using author: ${admin.name} (${admin.email})`);

  for (const post of NEPAL_BLOGS) {
    const existing = await db.blog.findUnique({
      where: { slug: post.slug },
    });

    if (!existing) {
      await db.blog.create({
        data: {
          title: post.title,
          slug: post.slug,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          authorId: admin.id,
          published: true,
        },
      });
      console.log(`  ✅ Published: "${post.title}"`);
    } else {
      console.log(`  ℹ️ Already exists: "${post.title}"`);
    }
  }

  console.log("🚀 All Nepal blogs successfully published!");
}

seedNepalBlogs()
  .catch((err) => console.error("❌ Error seeding Nepal blogs:", err))
  .finally(() => process.exit(0));
