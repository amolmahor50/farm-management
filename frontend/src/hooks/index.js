// Auth Hooks
export { useAuth } from "./useAuth";

// Expense Hooks
export {
  useExpenses,
  useExpense,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
} from "./useExpenses";

// Task Hooks
export {
  useTasks,
  useTask,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCompleteTask,
} from "./useTasks";

// Loan Hooks
export {
  useLoans,
  useLoan,
  useCreateLoan,
  useUpdateLoan,
  useDeleteLoan,
  useApproveLoan,
} from "./useLoans";

// Yield Hooks
export {
  useYields,
  useYield,
  useCreateYield,
  useUpdateYield,
  useDeleteYield,
} from "./useYields";

// Dashboard Hooks
export {
  useDashboardSummary,
  useDashboardCharts,
  useDashboardStats,
} from "./useDashboard";

// Expert Hooks
export {
  useExperts,
  useExpert,
  useCreateExpert,
  useUpdateExpert,
  useDeleteExpert,
} from "./useExperts";

// AI Hooks
export {
  useAIHistory,
  useAIData,
  usePredictYield,
  usePredictProfit,
  useOptimizeExpenses,
  useRecommendCrop,
  useAnalyzePestRisk,
} from "./useAI";

// Insurance Hooks
export {
  useInsurance,
  useInsuranceById,
  useCreateInsurance,
  useUpdateInsurance,
  useDeleteInsurance,
  useClaimInsurance,
} from "./useInsurance";

// Forum Hooks
export {
  useForumPosts,
  useForumPost,
  useCreateForumPost,
  useUpdateForumPost,
  useDeleteForumPost,
  useReplyToPost,
} from "./useForum";

// Knowledge Hooks
export {
  useKnowledge,
  useKnowledgeItem,
  useCreateKnowledge,
  useUpdateKnowledge,
  useDeleteKnowledge,
} from "./useKnowledge";

// Market Hooks
export {
  useMarket,
  useMarketItem,
  useCreateMarketListing,
  useUpdateMarketListing,
  useDeleteMarketListing,
} from "./useMarket";

// Notification Hooks
export {
  useNotifications,
  useNotification,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "./useNotifications";

// Subscription Hooks
export { useSubscription } from "./useSubscription";

// QR Hooks
export {
  useQRData,
  useQRCode,
  useCreateQRCode,
  useScanQRCode,
  useDeleteQRCode,
} from "./useQR";
