// Single source of truth for all site content. Edit here and the whole site updates.

export const profile = {
  name: "Arnav Harshit",
  handle: "arnav",
  roles: [
    "Product Engineer @ UnifyApps",
    "Distributed Systems Builder",
    "AI / ML Engineer",
    "Codeforces Expert (1718)",
  ],
  tagline:
    "I build systems that stay up and models that hold up: from Raft consensus and SQL engines to agents that debug other AI agents.",
  location: "IIT Kanpur, India",
  email: "arnavharshit0405@gmail.com",
  emailAlt: "arnavh23@iitk.ac.in",
  resume: "/Arnav_Harshit_Resume.pdf",
  socials: {
    github: "https://github.com/ArnavHarshit",
    linkedin: "https://www.linkedin.com/in/arnav-harshit-681bb4289/",
    codeforces: "https://codeforces.com/profile/DangerWizz",
    instagram: "https://www.instagram.com/i_m_arnavharshit/",
  },
  about: [
    "I'm a fourth-year B.Tech student at IIT Kanpur who fell for computer science the way most people fall for a good puzzle, and never stopped solving.",
    "These days I work where systems meet AI. At UnifyApps I built the Agent Optimizer, a conversational agent that diagnoses 25+ production AI agents, and earned a pre-placement offer. On my own time I write databases and consensus protocols from scratch, because the best way to understand something is to rebuild it.",
  ],
  stats: [
    { value: 1718, suffix: "", label: "Codeforces peak (Expert)" },
    { value: 105, suffix: "K+", label: "GET req/s on my Raft KV store" },
    { value: 3, suffix: "", label: "Engineering internships" },
    { value: 25, suffix: "+", label: "Production AI agents diagnosed" },
  ],
};

export const education = [
  { degree: "B.Tech, Chemical Engineering", place: "IIT Kanpur", year: "2023 – Present", score: "CPI 7.94/10" },
  { degree: "CBSE Class XII", place: "BSN Academy, Kota", year: "2023", score: "90.60%" },
  { degree: "CBSE Class X", place: "BSN Academy, Kota", year: "2021", score: "94.80%" },
];

export type Job = {
  company: string;
  role: string;
  period: string;
  badge?: string;
  points: string[];
  tags: string[];
};

export const experience: Job[] = [
  {
    company: "UnifyApps",
    role: "Product Engineer Intern",
    period: "May '26 – Jul '26",
    badge: "PPO Received",
    points: [
      "Built the Agent Optimizer, a conversational AI agent that diagnoses 25+ production AI agents via trace analysis across cost, latency and instruction quality.",
      "Orchestrated 6 composable automations through a parallel fan-out wrapper, cutting batch analysis from linear to near-constant time.",
      "Isolated high-token outliers varying 30× per task using SQL-driven case selection over the analytics warehouse.",
      "Condensed 45 anti-pattern rules into a diagnostic taxonomy that traces root causes of LLM errors in system prompts.",
      "Built an automated prompt-optimization framework emitting evidence-backed rewrites that raised token efficiency.",
    ],
    tags: ["LLM Agents", "SQL", "Prompt Engineering", "Orchestration"],
  },
  {
    company: "OpusLeaf Technologies",
    role: "Software Engineering Intern",
    period: "Jun '25 – Jul '25",
    points: [
      "Designed a backend service that aggregates and standardizes vulnerability data from multiple security tools.",
      "Wrote Python integrations (e.g. SonarQube) handling authentication and pagination.",
      "Laid the groundwork for API/UI integration, improving reliability, scalability and extensibility.",
    ],
    tags: ["Python", "Backend", "REST APIs", "Security"],
  },
  {
    company: "Invictron Systems",
    role: "Software Development Engineer",
    period: "May '25 – Jul '25",
    points: [
      "Designed a serverless peer-to-peer messaging app for offline chat and location sharing.",
      "Built a WhatsApp-style native Android app with Bluetooth/Wi-Fi chat, device discovery and offline maps.",
      "Achieved stable messaging across 10+ devices with offline location tracking and relay messaging.",
    ],
    tags: ["Android", "P2P Networking", "Bluetooth", "Offline-first"],
  },
];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  period: string;
  summary: string;
  metric: { value: string; label: string };
  tags: string[];
  github: string;
  problem: string;
  approach: string[];
  results: string[];
  accent: "cyan" | "violet" | "lime" | "pink";
};

export const projects: Project[] = [
  {
    slug: "raft-kv-store",
    title: "Raft-Based Distributed KV Store",
    kind: "Self Project",
    period: "Jul '26 – Oct '26",
    summary: "A fault-tolerant, Redis-compatible key-value store built on the Raft consensus protocol in C++.",
    metric: { value: "105K+", label: "GET req/s" },
    tags: ["C++", "Raft", "Boost.Asio", "Distributed Systems"],
    github: "https://github.com/ArnavHarshit/Raft-Based-Distributed-Key-Value-Store",
    problem:
      "Keeping data consistent when machines crash is one of the hardest problems in computing. I wanted to understand consensus by implementing it end to end, not just reading the paper.",
    approach: [
      "Implemented Raft from scratch: leader election, log replication, heartbeats and quorum commits.",
      "Asynchronous networking with Boost.Asio and a Redis-compatible client interface, so any Redis client can talk to it.",
      "Persistent log / write-ahead log with recovery, so nodes rejoin cleanly after failures and restarts.",
    ],
    results: [
      "73K+ SET and 105K+ GET requests/sec under concurrent Redis workloads.",
      "Consistency validated across node failures and restarts with multi-node testing.",
    ],
    accent: "cyan",
  },
  {
    slug: "minidb",
    title: "MiniDB: SQL Database Engine",
    kind: "Self Project",
    period: "Dec '25 – Feb '26",
    summary: "A relational database engine with a SQL parser, B+ tree indexes and a Volcano-style executor.",
    metric: { value: "B+", label: "tree indexing" },
    tags: ["C++", "Databases", "B+ Tree", "CMake"],
    github: "https://github.com/ArnavHarshit/MiniDB",
    problem:
      "Databases feel like magic until you build one. MiniDB is my attempt to build every layer, from parsing SQL text down to bytes on disk.",
    approach: [
      "Query parsing and AST generation with schema management and execution.",
      "Disk storage with slotted pages, a buffer manager, serialization and B+ tree indexing.",
      "Volcano-style iterator pipeline for scans, filtering and projection.",
    ],
    results: ["Modular CMake build with unit tests for each layer.", "End-to-end SQL execution over on-disk storage."],
    accent: "violet",
  },
  {
    slug: "fedar-plus",
    title: "FEDAR+: Federated Appliance Recognition",
    kind: "Self Project",
    period: "Sep '25 – Nov '25",
    summary: "Privacy-preserving federated learning that recognizes home appliances from their power-usage signatures.",
    metric: { value: "95%", label: "accuracy" },
    tags: ["PyTorch", "Federated Learning", "Time Series"],
    github: "https://github.com/ArnavHarshit/FedAR",
    problem:
      "Smart-meter data reveals a lot about a household. Federated learning lets models learn appliance signatures without raw data ever leaving the home, but real data is noisy and non-IID.",
    approach: [
      "PyTorch federated pipeline on 1D power footprints from UK-DALE and Tracebase.",
      "KL-divergence-based correction of model weights and label distributions to fight label noise.",
      "Dirichlet partitioning across 20 non-IID clients with label-flip evaluation.",
    ],
    results: ["95% accuracy overall.", "Above 88% accuracy even at 30% label noise.", "15–27% gain over an LSTM baseline."],
    accent: "lime",
  },
  {
    slug: "shiftguard-10",
    title: "ShiftGuard-10: Robust Image Classification",
    kind: "EE708 Course Project",
    period: "Jan '26 – Apr '26",
    summary: "An image classifier engineered to stay accurate when the test distribution shifts away from training.",
    metric: { value: "88.3%", label: "Macro F1" },
    tags: ["PyTorch", "Computer Vision", "WideResNet"],
    github: "https://github.com/ArnavHarshit/ShiftGuard-10-Robust-Image-Classification",
    problem:
      "Models that ace the benchmark often collapse in the real world. The goal: a 10-class classifier robust to distribution shift and severe class imbalance.",
    approach: [
      "WideResNet-28-6 trained in PyTorch.",
      "RandAugment, Cutout and Mixup/CutMix plus imbalance-aware training.",
      "Ensemble of two diverse models with 15-pass test-time augmentation.",
    ],
    results: ["88.3% Macro F1 vs. a 67.3% baseline, a 21-point jump."],
    accent: "pink",
  },
  {
    slug: "small-world-gcn",
    title: "Small-World Properties for GCNs",
    kind: "Undergraduate Research · Prof. Rajesh M. Hegde",
    period: "Dec '24 – Apr '25",
    summary: "Rewiring graphs with small-world links to make Graph Convolutional Networks more accurate, with no architecture change.",
    metric: { value: "+10%", label: "accuracy" },
    tags: ["GCN", "Graph ML", "Research"],
    github: "https://github.com/ArnavHarshit/Small-World-Properties-in-Graphs-for-Enhanced-GCN-Performance",
    problem:
      "GCNs are only as good as the graph they're given. Can we improve the graph itself so information flows better?",
    approach: [
      "Added small-world links via top-k feature similarity and entropy-centrality filters.",
      "Tuned α, k and threshold through Small-World Optimization for data-driven rewiring.",
    ],
    results: ["Up to 10% higher accuracy across datasets without touching the GCN architecture."],
    accent: "cyan",
  },
];

export const skills = [
  { group: "Languages", icon: "</>", items: ["C++", "C", "Python", "Java", "JavaScript", "SQL", "MATLAB"] },
  { group: "Systems & Backend", icon: "⚙", items: ["Node.js", "Express", "Spring Boot", "REST APIs", "Microservices", "Multithreading", "Parallel Computing", "Boost.Asio"] },
  { group: "Data & Cloud", icon: "☁", items: ["PostgreSQL", "MongoDB", "Docker", "AWS", "Linux", "Git"] },
  { group: "ML & AI", icon: "✦", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "OpenCV", "NumPy", "Pandas", "LLM Agents"] },
  { group: "Frontend", icon: "◧", items: ["React", "Next.js", "Tailwind CSS"] },
  { group: "CS Core", icon: "∑", items: ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks", "Graph Algorithms"] },
];

/** Headline competition runs, shown as large "finalist" cards with a stage tracker. */
export const finals = [
  {
    org: "Accenture",
    event: "Strategy Connect · Season 4",
    title: "National Finalist",
    detail:
      "Cracked the business simulation round and earned a place in the final stage, going head-to-head with the country's sharpest student strategy teams for the top honours.",
    stages: ["Registration", "Simulation Round", "Grand Finale"],
    accent: "violet" as const,
  },
  {
    org: "Cisco",
    event: "Code with Cisco 2026",
    title: "National Finalist",
    detail:
      "Made the final cut among thousands of teams and was flown in on a sponsored trip to compete at the grand finale.",
    stages: ["Qualifier", "Shortlist", "Grand Finale"],
    accent: "cyan" as const,
  },
];

export const achievements = [
  { title: "Codeforces Expert", detail: "Peak rating 1718 as DangerWizz. Global ranks 188 and 115 among 28,000+ participants.", icon: "⚡", href: "https://codeforces.com/profile/DangerWizz" },
  { title: "Amazon ML Summer School 2026", detail: "Selected among the top 3,000 of 1.34 lakh+ applicants across India.", icon: "🧠" },
  { title: "NTSE Stage II", detail: "Among 5,000 candidates nationwide, 2021.", icon: "🎓" },
  { title: "Int'l Mathematics Olympiad", detail: "International Rank 36 and Zonal Rank 5 (SOF IMO, 2020).", icon: "∑" },
  { title: "Raktarpan Secretary", detail: "Led 8 blood donation camps collecting 720+ units, impacting ~2,400 lives.", icon: "❤" },
  { title: "GDG Trainee", detail: "Started 6+ peer-led projects across ML, Web and Cloud at Google Developer Group.", icon: "◆" },
] as { title: string; detail: string; icon: string; href?: string }[];

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Wins" },
  { id: "contact", label: "Contact" },
];

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
