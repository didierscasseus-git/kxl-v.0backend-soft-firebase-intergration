
// React types
export interface ServiceItem {
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  icon: string;
}

export interface FeatureCard {
  id: string;
  title: { en: string; fr: string };
  tag: string;
  content: { en: string; fr: string };
  icon: string;
}

export interface ApproachStep {
  stage: string;
  label: { en: string; fr: string };
  details: { en: string; fr: string };
}



