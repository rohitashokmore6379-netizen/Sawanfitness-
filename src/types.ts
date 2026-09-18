export interface GymSettings {
  gymName: string;
  ownerName: string;
  email: string;
  contactNumber: string;
  address: string;
  landmark: string;
  road: string;
  city: string;
  taluka: string;
  district: string;
  state: string;
  pinCode: string;
  gymDescription: string;
  gymTagline: string;
  gymTimings: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  updatedAt?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | 'Beginner to Advanced';
  icon: string;
  highlights: string[];
  image: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  features: string[];
  recommendedFor: string;
}

export interface TransformationItem {
  id: string;
  clientName: string;
  duration: string;
  achievement: string;
  stats: {
    weightLost?: string;
    muscleGain?: string;
    bodyFat?: string;
  };
  testimonial: string;
  beforeImage: string;
  afterImage: string;
}

export interface SupplementProduct {
  id: string;
  name: string;
  category: 'Protein' | 'Performance' | 'Recovery' | 'Wellness';
  benefit: string;
  dosage: string;
  certified: boolean;
}
