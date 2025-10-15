export interface User {
  id: string;
  phone: string;
  name: string;
  farmName: string;
  farmSize: number;
  location: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  date: string;
  category: "Fertilizer" | "Labor" | "Seeds" | "Equipment" | "Others";
  amount: number;
  crop: string;
  description: string;
  createdAt: string;
}

export interface Yield {
  id: string;
  userId: string;
  date: string;
  crop: string;
  quantity: number;
  unit: "kg" | "ton" | "quintal";
  pricePerUnit: number;
  totalIncome: number;
  createdAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  lenderName: string;
  amount: number;
  interestRate: number;
  startDate: string;
  duration: number;
  emiAmount: number;
  paidEmis: number;
  totalEmis: number;
  nextEmiDate: string;
  status: "Active" | "Completed" | "Overdue";
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category:
    | "Planting"
    | "Irrigation"
    | "Fertilization"
    | "Harvesting"
    | "Pest Control"
    | "Others";
  date: string;
  time: string;
  crop: string;
  status: "Pending" | "Completed" | "Overdue";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  type: "Pest" | "Disease" | "Weather" | "Task" | "EMI" | "Custom";
  title: string;
  message: string;
  date: string;
  read: boolean;
  createdAt: string;
}

export interface MarketPrice {
  id: string;
  crop: string;
  price: number;
  unit: string;
  market: string;
  date: string;
}

export interface CropRotation {
  id: string;
  userId: string;
  currentCrop: string;
  season: string;
  suggestedCrops: string[];
  benefits: string;
  createdAt: string;
}

export interface WeatherSuggestion {
  id: string;
  date: string;
  temperature: number;
  condition: string;
  rainfall: number;
  humidity: number;
  suggestions: string[];
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  category:
    | "General"
    | "Pest Control"
    | "Irrigation"
    | "Fertilization"
    | "Marketing"
    | "Others";
  likes: number;
  comments: ForumComment[];
  createdAt: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface KnowledgeResource {
  id: string;
  title: string;
  description: string;
  type: "Video" | "PDF" | "Article" | "Tutorial";
  category: string;
  url: string;
  thumbnail: string;
  duration?: string;
  createdAt: string;
}

export interface Expert {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: "Available" | "Busy" | "Offline";
  consultationFee: number;
  language: string[];
  avatar: string;
}

export interface Consultation {
  id: string;
  userId: string;
  expertId: string;
  expertName: string;
  date: string;
  time: string;
  duration: number;
  status: "Scheduled" | "Completed" | "Cancelled";
  topic: string;
  notes: string;
  fee: number;
  createdAt: string;
}

export interface Insurance {
  id: string;
  userId: string;
  policyNumber: string;
  provider: string;
  crop: string;
  coverage: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Claimed";
  createdAt: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  type:
    | "Yield Prediction"
    | "Expense Optimization"
    | "Market Trend"
    | "Weather Alert";
  title: string;
  description: string;
  data: any;
  confidence: number;
  createdAt: string;
}
