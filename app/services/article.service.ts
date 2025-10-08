import type { Article } from "@/types/article.types";

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Memorandum Of Agreement Signing in Sual, Pangasinan",
    summary: "FTCC expands its healthcare services through a strategic partnership with Sual, Pangasinan, marking a significant step in bringing quality healthcare to the region.",
    image: "./assets/imgs/moa.sual/MOA-SUAL-1.jpg?w=800",
    images: [
      "../assets/imgs/moa.sual/MOA-SUAL-1.jpg?w=800",
      "../assets/imgs/moa.sual/MOA-SUAL-2.jpg?w=800",
      "../assets/imgs/moa.sual/MOA-SUAL-3.jpg?w=800",
      "../assets/imgs/moa.sual/MOA-SUAL-4.jpg?w=800",
      "../assets/imgs/moa.sual/MOA-SUAL-5.jpg?w=800",
      "../assets/imgs/moa.sual/MOA-SUAL-6.jpg?w=800",
      "../assets/imgs/moa.sual/MOA-SUAL-7.jpg?w=800",
      "../assets/imgs/moa.sual/MOA-SUAL-8.jpg?w=800",
      "../assets/imgs/moa.sual/MOA-SUAL-9.jpg?w=800"
    ],
    date: "2024-06-01",
    author: {
      name: "FTCC Writer",
      avatar: ""
    },
    content: "Full article content here...",
    tags: ["health", "lifestyle", "wellness", "tips"],
    category: "Wellness"
  },
  {
    id: "2",
    title: "Presentation of Konsulta Program in Zambales",
    summary: "FTCC introduces its comprehensive Konsulta Program to Zambales, showcasing innovative healthcare solutions and preventive care services for the local community.",
    image: "./assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-3.jpg?w=800",
    images: [
      "../assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-3.jpg?w=800",
      "../assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-4.jpg?w=800",
      "../assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-5.jpg?w=800"
    ],
    date: "2025-03-18",
    author: {
      name: "FTCC Writer",
      avatar: ""
    },
    content: "Full article content here...",
    tags: ["preventive care", "checkup", "screening", "health"],
    category: "Primary Care"
  },
  {
    id: "3",
    title: "Presentation of Konsulta Program in Pitogo",
    summary: "FTCC extends its Konsulta Program to Pitogo, demonstrating its commitment to providing accessible healthcare services and promoting community wellness initiatives.",
    image: "./assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-1.jpg?w=800",
    images: [
      "../assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-1.jpg?w=800",
      "../assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-2.jpg?w=800",
      "../assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-3.jpg?w=800",
      "../assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-4.jpg?w=800"
    ],
    date: "2024-05-20",
    author: {
      name: "FTCC Writer",
      avatar: ""
    },
    content: "Full article content here...",
    tags: ["stress", "mental health", "wellness", "tips"],
    category: "Mental Health"
  },
  {
    id: "4",
    title: "Orientation of Konsulta Program in Nueva Ecija",
    summary: "FTCC launches its Konsulta Program orientation in Nueva Ecija, educating healthcare providers and community members about the benefits and implementation of the program.",
    image: "./assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-1.jpg?w=800",
    images: [
      "../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-1.jpg?w=800",
      "../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-2.jpg?w=800",
      "../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-3.jpg?w=800",
      "../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-4.jpg?w=800"
    ],
    date: "2024-05-20",
    author: {
      name: "FTCC Writer",
      avatar: ""
    },
    content: "Full article content here...",
    tags: ["stress", "mental health", "wellness", "tips"],
    category: "Mental Health"
  },
  {
    id: "5",
    title: "CareSpan Training Program",
    summary: "FTCC conducts comprehensive training with CareSpan to enhance healthcare service delivery and digital health capabilities.",
    image: "./assets/imgs/carespan.training/CareSpan Training-3.jpg?w=800",
    images: [
      "../assets/imgs/carespan.training/CareSpan Training-3.jpg?w=800",
      "../assets/imgs/carespan.training/CareSpan Training-4.jpg?w=800",
      "../assets/imgs/carespan.training/CareSpan Training-5.jpg?w=800"
    ],
    date: "2024-03-25",
    author: {
      name: "FTCC Writer",
      avatar: ""
    },
    content: "Full article content here...",
    tags: ["training", "healthcare", "digital health", "professional development"],
    category: "Training"
  },
  {
    id: "6",
    title: "Meeting with Mayor Web Letargo of Gumaca and Councilors",
    summary: "FTCC engages in strategic discussions with Mayor Web Letargo and the councilors of Gumaca to explore healthcare collaboration opportunities and enhance medical services in the region.",
    image: "./assets/imgs/mayor.web/Mayor Web Letargo of Gumaca and Councilors 1.jpg?w=800",
    images: [
      "../assets/imgs/mayor.web/Mayor Web Letargo of Gumaca and Councilors 1.jpg?w=800",
      "../assets/imgs/mayor.web/Mayor Web Letargo of Gumaca and Councilors 2.jpg?w=800"
    ],
    date: "2024-03-20",
    author: {
      name: "FTCC Writer",
      avatar: ""
    },
    content: "Full article content here...",
    tags: ["partnership", "local government", "healthcare access", "community development"],
    category: "Partnerships"
  },
  {
    id: "7",
    title: "Meeting with Mayor Artenio Mamburao of Macalelon, Quezon",
    summary: "FTCC meets with Mayor Artenio Mamburao to discuss healthcare initiatives and potential collaboration to improve medical services in Macalelon, Quezon Province.",
    image: "./assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 1.jpg?w=800",
    images: [
      "../assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 1.jpg?w=800",
      "../assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 2.jpg?w=800",
      "../assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 3.jpg?w=800",
      "../assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 4.jpg?w=800"
    ],
    date: "2024-03-15",
    author: {
      name: "FTCC Writer",
      avatar: ""
    },
    content: "Full article content here...",
    tags: ["partnership", "local government", "healthcare access", "community development"],
    category: "Partnerships"
  }
];

export const articleService = {
  getAll: async (): Promise<Article[]> => Promise.resolve(mockArticles),
  getById: async (id: string): Promise<Article | undefined> => Promise.resolve(mockArticles.find(a => a.id === id)),
};