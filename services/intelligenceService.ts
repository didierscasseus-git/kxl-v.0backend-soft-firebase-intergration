
import { db } from "../lib/firebase";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";

export const RESEARCH_SOURCES = {
    SAAS_AND_STARTUPS: [
        'r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/microsaas', 'r/SideProject',
        'r/IndieHackers', 'r/GrowthHacking', 'r/bootstrap', 'r/solopreneur',
        'r/SaaSMarketing', 'r/venturecapital', 'r/angelinvestors', 'r/incubator',
        'r/leanstartup', 'r/startup_ideas'
    ],
    TECH_AND_INFRA: [
        'r/devops', 'r/sysadmin', 'r/webdev', 'r/aws', 'r/firebase', 'r/ReactJS',
        'r/Typescript', 'r/softwareengineering', 'r/programming', 'r/cscareerquestions',
        'r/cybersecurity', 'r/cloudcomputing', 'r/SelfHosted', 'r/Database', 'r/Serverless'
    ],
    MARKETING_AND_BRAND: [
        'r/marketing', 'r/branding', 'r/socialmedia', 'r/SEO', 'r/copywriting',
        'r/adops', 'r/PPC', 'r/PublicRelations', 'r/ContentMarketing', 'r/EmailMarketing',
        'r/ecommerce', 'r/Shopify', 'r/MarketResearch', 'r/AffiliateMarketing', 'r/DigitalMarketing'
    ],
    PRODUCT_AND_DESIGN: [
        'r/ProductManagement', 'r/UXDesign', 'r/UI_Design', 'r/UserExperience',
        'r/Design', 'r/usability', 'r/UserTesting', 'r/MobileDesign', 'r/GraphicDesign',
        'r/DesignSystem', 'r/InteractionDesign', 'r/WebDesign', 'r/ProductDesign',
        'r/UserCenteredDesign', 'r/ServiceDesign'
    ],
    BUSINESS_AND_STRATEGY: [
        'r/business', 'r/strategy', 'r/economics', 'r/finance', 'r/stocks',
        'r/investing', 'r/management', 'r/consulting', 'r/CorporateFinance',
        'r/BusinessIntelligence', 'r/OperationsManagement', 'r/SupplyChain',
        'r/Logistics', 'r/Negotiation', 'r/Leadership'
    ],
    NICHE_FIELDS: [
        'r/fintech', 'r/edtech', 'r/healthcare', 'r/proptech', 'r/legaltech',
        'r/biotech', 'r/cleantech', 'r/agtech', 'r/traveltech', 'r/martech',
        'r/crypto', 'r/web3', 'r/AI', 'r/machinelearning', 'r/DataScience',
        'r/realestate', 'r/construction', 'r/manufacturing', 'r/retail', 'r/hospitality'
    ],
    FAILURE_AND_POSTMORTEM: [
        'r/Fail', 'r/tifu', 'r/legaladvice', 'r/scams', 'r/privacy',
        'r/CustomerService', 'r/ExpectationVsReality', 'r/AntiWork',
        'r/CorporateFacepalm'
    ]
};

export interface CaseStudy {
    id?: string;
    title: string;
    source: string;
    type: 'REDDIT' | 'VIDEO' | 'BLOG' | 'FORUM' | 'OFFICIAL' | 'UNCONVENTIONAL';
    url: string;
    findings: string[];
    diagnosticTags: string[];
    facilitationScore: number;
    isPremium?: boolean;
    timestamp?: any;
}

/**
 * Retrieves case studies from the archive.
 */
export const getCaseStudiesByTag = async (tag: string) => {
    try {
        const q = query(
            collection(db, "case_studies"),
            where("diagnosticTags", "array-contains", tag),
            orderBy("facilitationScore", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CaseStudy[];
    } catch (error) {
        console.error("Error fetching case studies: ", error);
        return [];
    }
};

export const getAllCaseStudies = async () => {
    try {
        const q = query(collection(db, "case_studies"), orderBy("facilitationScore", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CaseStudy[];
    } catch (error) {
        console.error("Error fetching all case studies: ", error);
        return [];
    }
};

/**
 * Internal function to seed the initial database with researched data.
 */
export const seedCaseStudies = async () => {
    const studies: Omit<CaseStudy, 'timestamp'>[] = [
        {
            title: "The Lego Turnaround: Community-Led Rebuild",
            source: "Official Corporate History / Reddit Business",
            type: "OFFICIAL",
            url: "https://www.lego.com/en-us/aboutus/lego-group/the-lego-group-history",
            findings: ["Listened to hardcore fans", "Streamlined product lines (80% reduction)", "Focused on core IP"],
            diagnosticTags: ["BRAND_REBUILD", "COMMUNITY", "SYSTEM_SIMPLIFICATION"],
            facilitationScore: 95
        },
        {
            title: "Old Spice: Legacy Brand Revitalization",
            source: "Marketing Case Study / YouTube",
            type: "VIDEO",
            url: "https://www.youtube.com/watch?v=owGykVbfgUE",
            findings: ["Humor-led demographic shift", "Real-time social engagement", "Bold visual repositioning"],
            diagnosticTags: ["MARKETING", "DEMOGRAPHIC_SHIFT", "VIRAL_STRATEGY"],
            facilitationScore: 88
        },
        {
            title: "GitHub 24-Hour Service Degradation Post-Mortem",
            source: "GitHub Engineering Blog",
            type: "BLOG",
            url: "https://github.blog/2018-10-21-october-21-post-incident-analysis/",
            findings: ["Network partitioned database replication", "Automated failover complexity", "Transparency in communication"],
            diagnosticTags: ["INFRASTRUCTURE", "FAILURE_ANALYSIS", "TRANSPARENCY"],
            facilitationScore: 92,
            isPremium: true
        },
        {
            title: "Sub-2% Churn via 'Unscalable' Human Support",
            source: "r/Entrepreneur / Reddit Deep Dive",
            type: "UNCONVENTIONAL",
            url: "https://www.reddit.com/r/Entrepreneur/comments/f4o5v9/how_i_achieved_sub_2_churn_in_my_saas/",
            findings: ["Founder personally answered every ticket", "Automated everything EXCEPT human connection", "Turned support into a retention engine"],
            diagnosticTags: ["CHURN_MITIGATION", "HUMAN_CENTRIC", "SAAS_RECOVERY"],
            facilitationScore: 98,
            isPremium: true
        },
        {
            title: "The 'Mansion MVP' Death Spiral",
            source: "r/startups / Post-Mortem Analysis",
            type: "UNCONVENTIONAL",
            url: "https://www.reddit.com/r/startups/",
            findings: ["Over-engineering for unverified pain points", "Building 3 platforms before 1 user", "Ignoring 'hair-on-fire' urgency requirement"],
            diagnosticTags: ["OVER_ENGINEERING", "PRODUCT_VALIDATION", "FAILURE_STUDY"],
            facilitationScore: 94
        },
        {
            title: "Unsexy Niche Inefficiency Arbitrage",
            source: "r/SaaS / Business Strategy",
            type: "UNCONVENTIONAL",
            url: "https://www.reddit.com/r/SaaS/",
            findings: ["Replacing outdated manual industry processes", "Solving 'annoying little tasks' vs generic bloat", "Targeting high-compliance unserved sectors"],
            diagnosticTags: ["NICHE_STRATEGY", "SYSTEM_ARBITRAGE", "MARKET_GAP"],
            facilitationScore: 91,
            isPremium: true
        }
    ];

    for (const study of studies) {
        try {
            await addDoc(collection(db, "case_studies"), {
                ...study,
                timestamp: serverTimestamp()
            });
        } catch (e) {
            console.error("Error seeding study:", study.title, e);
        }
    }
};
