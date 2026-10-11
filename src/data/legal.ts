import { site } from "@/lib/utils";

/*
 * Privacy policy and terms of service. Written for a fictional company in plain English; they
 * must be reviewed by a lawyer in each country Arise operates in before launch (see README).
 */

export interface LegalSection {
  id: string;
  title: string;
  body: (string | string[])[];
}

export interface LegalDoc {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

const company = "Arise Homes, Lda.";
const address = "Rua da Escola Politécnica 42, 1250-102 Lisboa, Portugal";
const privacyEmail = "privacy@arise-homes.example";

export const privacy: LegalDoc = {
  title: "Privacy policy",
  intro: "What we collect when you use this website, why we need it, who sees it, and how to have it changed or deleted.",
  updated: "2026-10-11",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      body: [
        `This website is run by ${company}, ${address} ("Arise", "we"). We are the controller of the personal data described here.`,
        `For anything about your data, write to ${privacyEmail}. We answer within one month.`,
      ],
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      body: [
        "We only collect what you type into our forms, plus the minimum our servers record to keep the site running:",
        [
          "Viewing requests: your name, email, phone number if you give it, the home, your preferred day, whether you want an in-person or video viewing, and any message.",
          "Owner valuations: your name, email, phone if given, the city, type and size of your home, and your message.",
          "Contact messages: your name, email, whether you're a tenant or an owner, and your message.",
          "New-homes emails: your email address.",
          "Server logs: your IP address, browser type, the page requested and the time. These are kept for 30 days to detect abuse and fix errors.",
        ],
        "We don't ask for payment details, identity documents or financial information on this website. Tenancy applications are handled separately, and you'll receive their own privacy notice.",
      ],
    },
    {
      id: "why",
      title: "Why we use it",
      body: [
        [
          "To answer your request and arrange a viewing or valuation. This is necessary to take steps you've asked for before a possible contract.",
          "To send the new-homes email, only if you subscribed. This is based on your consent, which you can withdraw with the link in every email.",
          "To keep the website secure and working. This is our legitimate interest in running a reliable service.",
          "To keep records required by law, for example anti-money-laundering checks once a tenancy goes ahead.",
        ],
        "We don't sell your data, and we don't use it for profiling or automated decisions.",
      ],
    },
    {
      id: "sharing",
      title: "Who we share it with",
      body: [
        [
          "The Arise manager in the city of the home, who arranges your viewing.",
          "The owner of the home, but only your name and viewing time, and only once a viewing is confirmed.",
          "Service providers who process data for us under contract: website hosting, email delivery and our customer-relationship system.",
          "Authorities, when the law requires it.",
        ],
        "Our teams in Cape Town and Dubai are outside the European Economic Area. Transfers to them are covered by the European Commission's standard contractual clauses.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: [
        [
          "Viewing requests, valuations and messages: 24 months after our last contact, unless they lead to a tenancy or management agreement.",
          "New-homes emails: until you unsubscribe.",
          "Server logs: 30 days.",
        ],
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: [
        "You can ask us to show you the data we hold about you, correct it, delete it, limit how we use it, or send it to you in a portable format. You can object to uses based on our legitimate interests, and withdraw consent at any time.",
        `Write to ${privacyEmail}. If you're unhappy with our answer, you can complain to the Comissão Nacional de Proteção de Dados in Portugal, or to the data protection authority where you live.`,
      ],
    },
    {
      id: "cookies",
      title: "Cookies and storage",
      body: [
        "This website doesn't use advertising or analytics cookies, and it doesn't track you across other sites. That's why there's no cookie banner.",
        "Your browser may cache images, fonts and the 3D models of our homes to make pages load faster. These files contain no personal data.",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: ["Our services are for adults. We don't knowingly collect data from anyone under 18."],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: ["If we change how we use your data, we'll update this page and the date above. For significant changes, we'll also email subscribers."],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of service",
  intro: "The rules for using this website. Renting or letting a home is covered by a separate written agreement, never by these terms alone.",
  updated: "2026-10-11",
  sections: [
    {
      id: "about",
      title: "About these terms",
      body: [
        `This website is run by ${company}, ${address}. By using it, you agree to these terms. If you don't agree, please don't use the site.`,
      ],
    },
    {
      id: "listings",
      title: "Listings",
      body: [
        "We check every home before listing it, but details can change. Availability, rent, furnishing and amenities are confirmed in writing before you sign anything.",
        "Photographs show the home or homes of a similar standard. The 3D models are built from floor plans to help you understand the layout; they are illustrations, not measured surveys.",
        "A listing is an invitation to enquire, not an offer to rent.",
      ],
    },
    {
      id: "viewings",
      title: "Viewings and applications",
      body: [
        "Requesting a viewing doesn't reserve a home. A viewing is confirmed only when a manager emails you.",
        "If you'd like to rent a home, you'll apply separately. Your tenancy is governed by the lease you sign with the owner, which takes precedence over anything on this website.",
      ],
    },
    {
      id: "fees",
      title: "Fees",
      body: [
        "Tenants don't pay Arise an agency fee. You pay the first month's rent and a deposit, as set out in your lease.",
        "Owners pay the fees in their management or letting agreement. Fees shown on this website are a summary and may vary by city.",
      ],
    },
    {
      id: "use",
      title: "Using the website",
      body: [
        "Please give accurate information in our forms and use them only for genuine enquiries. Don't try to disrupt the website, access it by automated means beyond normal search-engine indexing, or copy listings for another service.",
      ],
    },
    {
      id: "content",
      title: "Content and credits",
      body: [
        "The Arise name, logo, text and 3D models are ours. Photographs are used under the Unsplash licence, and 3D skies, textures and models come from Poly Haven under CC0. You may share links to our pages, but please don't reproduce our content without permission.",
      ],
    },
    {
      id: "links",
      title: "Links to other websites",
      body: ["We aren't responsible for the content or privacy practices of websites we link to."],
    },
    {
      id: "liability",
      title: "Liability",
      body: [
        "We work to keep this website accurate and available, but we can't guarantee it will always be either. To the extent the law allows, we aren't liable for losses caused by relying on information here without confirming it with us.",
        "Nothing in these terms limits liability that can't be limited by law, or your rights as a consumer.",
      ],
    },
    {
      id: "law",
      title: "Governing law",
      body: [
        "These terms are governed by Portuguese law. If you're a consumer, you can also bring a claim in the courts of the country where you live.",
      ],
    },
    {
      id: "changes",
      title: "Changes and contact",
      body: [`We may update these terms; the date above shows the latest version. Questions: ${site.email}.`],
    },
  ],
};
