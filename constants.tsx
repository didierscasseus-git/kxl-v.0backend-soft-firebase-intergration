
import { ServiceItem, FeatureCard, ApproachStep } from './types';

export const SERVICES: ServiceItem[] = [
  { 
    title: { en: "Brand Strategy & Identity Systems", fr: "Stratégie de Marque et Systèmes d'Identité" }, 
    description: { 
      en: "Architecting visual foundations for high-growth tech ecosystems.", 
      fr: "Architecturer les bases visuelles pour les écosystèmes technologiques à forte croissance." 
    }, 
    icon: "ph:fingerprint-thin" 
  },
  { 
    title: { en: "Web Redesign & Full-Stack Development", fr: "Redesign Web et Développement Full-Stack" }, 
    description: { 
      en: "Deterministic performance paired with liquid interactions.", 
      fr: "Performance déterministe associée à des interactions fluides." 
    }, 
    icon: "ph:code-thin" 
  },
  { 
    title: { en: "Mobile App Development", fr: "Développement d'Applications Mobiles" }, 
    description: { 
      en: "Native and cross-platform experiences built for retention.", 
      fr: "Expériences natives et multiplateformes conçues pour la rétention." 
    }, 
    icon: "ph:device-mobile-thin" 
  },
  { 
    title: { en: "API & Platform Integrations", fr: "Intégrations API et Plateforme" }, 
    description: { 
      en: "Seamless data orchestration across fragmented stacks.", 
      fr: "Orchestration transparente des données à travers des piles fragmentées." 
    }, 
    icon: "ph:plugs-connected-thin" 
  },
  { 
    title: { en: "Workflow & Business Automation", fr: "Automatisation des Flux et des Affaires" }, 
    description: { 
      en: "Eliminating friction via algorithmic operational scaling.", 
      fr: "Éliminer les frictions via une mise à l'échelle opérationnelle algorithmique." 
    }, 
    icon: "ph:gear-six-thin" 
  },
  { 
    title: { en: "SEO & Performance Optimization", fr: "SEO et Optimisation de la Performance" }, 
    description: { 
      en: "Visibility driven by core web vitals and semantic authority.", 
      fr: "Visibilité pilotée par les signaux web essentiels et l'autorité sémantique." 
    }, 
    icon: "ph:chart-line-up-thin" 
  },
  { 
    title: { en: "Automated Marketing Systems", fr: "Systèmes de Marketing Automatisés" }, 
    description: { 
      en: "Full-funnel triggers and AI-driven outreach cycles.", 
      fr: "Déclencheurs de tunnel complet et cycles de sensibilisation pilotés par l'IA." 
    }, 
    icon: "ph:megaphone-simple-thin" 
  },
  { 
    title: { en: "Digital Upscaling & Optimization Strategy", fr: "Stratégie de Mise à l'Échelle et d'Optimisation Numérique" }, 
    description: { 
      en: "The roadmap for your next-generation tech evolution.", 
      fr: "La feuille de route pour votre évolution technologique de prochaine génération." 
    }, 
    icon: "ph:trend-up-thin" 
  },
];

export const FEATURES: FeatureCard[] = [
  { 
    id: 'f1', 
    tag: 'CORE', 
    title: { en: 'System-First Design', fr: 'Conception Systémique' }, 
    content: { 
      en: 'We build foundations, not just facades. Every pixel follows a logic chain.', 
      fr: 'Nous construisons des fondations, pas seulement des façades. Chaque pixel suit une chaîne logique.' 
    }, 
    icon: 'ph:layout-thin' 
  },
  { 
    id: 'f2', 
    tag: 'TECH', 
    title: { en: 'Cloud-Native Stacks', fr: 'Piles Cloud-Natives' }, 
    content: { 
      en: 'Leveraging serverless architectures for infinite horizontal scalability.', 
      fr: 'Exploiter les architectures sans serveur pour une évolutivité horizontale infinie.' 
    }, 
    icon: 'ph:cloud-thin' 
  },
  { 
    id: 'f3', 
    tag: 'UX', 
    title: { en: 'Liquid Motion', fr: 'Mouvement Liquide' }, 
    content: { 
      en: 'Interactions that feel organic and react in real-time to user intent.', 
      fr: 'Des interactions qui semblent organiques et réagissent en temps réel à l\'intent de l\'utilisateur.' 
    }, 
    icon: 'ph:waves-thin' 
  },
  { 
    id: 'f4', 
    tag: 'DATA', 
    title: { en: 'Semantic Analytics', fr: 'Analytique Sémantique' }, 
    content: { 
      en: 'Understanding the "why" behind every click using advanced behavioral tracking.', 
      fr: 'Comprendre le "pourquoi" derrière chaque clic grâce au suivi comportemental avancé.' 
    }, 
    icon: 'ph:database-thin' 
  },
  { 
    id: 'f5', 
    tag: 'AI', 
    title: { en: 'Agentic Workflows', fr: 'Flux de Travail Agentiques' }, 
    content: { 
      en: 'Integrating LLMs directly into your operational DNA for 10x throughput.', 
      fr: 'Intégrer les LLM directement dans votre ADN opérationnel pour un débit décuplé.' 
    }, 
    icon: 'ph:cpu-thin' 
  },
];

export const APPROACH: ApproachStep[] = [
  { 
    stage: "01", 
    label: { en: "Discovery & System Mapping", fr: "Découverte et Cartographie Système" }, 
    details: { 
      en: "Uncovering the bottlenecks in your current digital lineage.", 
      fr: "Découvrir les goulots d'étranglement de votre lignée numérique actuelle." 
    } 
  },
  { 
    stage: "02", 
    label: { en: "Strategy & Architecture", fr: "Stratégie et Architecture" }, 
    details: { 
      en: "Designing the blueprint for a resilient, scalable future-state.", 
      fr: "Concevoir le plan directeur pour un état futur résilient et évolutif." 
    } 
  },
  { 
    stage: "03", 
    label: { en: "Design & Prototyping", fr: "Design et Prototypage" }, 
    details: { 
      en: "High-fidelity visualization of the optimized ecosystem.", 
      fr: "Visualisation haute fidélité de l'écosystème optimisé." 
    } 
  },
  { 
    stage: "04", 
    label: { en: "Development & Integration", fr: "Développement et Intégration" }, 
    details: { 
      en: "The deterministic build phase where concepts become production code.", 
      fr: "La phase de construction déterministe où les concepts deviennent du code de production." 
    } 
  },
  { 
    stage: "05", 
    label: { en: "Optimization & Scaling", fr: "Optimisation et Mise à l'Échelle" }, 
    details: { 
      en: "Iterative refinement for peak performance and market dominance.", 
      fr: "Raffinement itératif pour une performance de pointe et une dominance sur le marché." 
    } 
  },
];
