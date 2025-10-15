import {
  Expense,
  Yield,
  Loan,
  Task,
  Alert,
  ForumPost,
  ForumComment,
  KnowledgeResource,
  Expert,
  Consultation,
  Insurance,
  CropRotation,
} from "@/data/types";
import {
  mockExpenses,
  mockYields,
  mockLoans,
  mockTasks,
  mockAlerts,
  mockForumPosts,
  mockKnowledgeResources,
  mockExperts,
  mockConsultations,
  mockInsurance,
  mockCropRotations,
} from "@/data/mockData";

class DataStore {
  private expenses: Expense[] = [...mockExpenses];
  private yields: Yield[] = [...mockYields];
  private loans: Loan[] = [...mockLoans];
  private tasks: Task[] = [...mockTasks];
  private alerts: Alert[] = [...mockAlerts];
  private forumPosts: ForumPost[] = [...mockForumPosts];
  private knowledgeResources: KnowledgeResource[] = [...mockKnowledgeResources];
  private experts: Expert[] = [...mockExperts];
  private consultations: Consultation[] = [...mockConsultations];
  private insurance: Insurance[] = [...mockInsurance];
  private cropRotations: CropRotation[] = [...mockCropRotations];

  getExpenses(): Expense[] {
    return [...this.expenses];
  }

  addExpense(expense: Omit<Expense, "id" | "createdAt">): Expense {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.expenses.push(newExpense);
    return newExpense;
  }

  updateExpense(id: string, updates: Partial<Expense>): Expense | null {
    const index = this.expenses.findIndex((e) => e.id === id);
    if (index === -1) return null;
    this.expenses[index] = { ...this.expenses[index], ...updates };
    return this.expenses[index];
  }

  deleteExpense(id: string): boolean {
    const index = this.expenses.findIndex((e) => e.id === id);
    if (index === -1) return false;
    this.expenses.splice(index, 1);
    return true;
  }

  getYields(): Yield[] {
    return [...this.yields];
  }

  addYield(yieldData: Omit<Yield, "id" | "createdAt">): Yield {
    const newYield: Yield = {
      ...yieldData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.yields.push(newYield);
    return newYield;
  }

  updateYield(id: string, updates: Partial<Yield>): Yield | null {
    const index = this.yields.findIndex((y) => y.id === id);
    if (index === -1) return null;
    this.yields[index] = { ...this.yields[index], ...updates };
    return this.yields[index];
  }

  deleteYield(id: string): boolean {
    const index = this.yields.findIndex((y) => y.id === id);
    if (index === -1) return false;
    this.yields.splice(index, 1);
    return true;
  }

  getLoans(): Loan[] {
    return [...this.loans];
  }

  addLoan(loan: Omit<Loan, "id" | "createdAt">): Loan {
    const newLoan: Loan = {
      ...loan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.loans.push(newLoan);
    return newLoan;
  }

  updateLoan(id: string, updates: Partial<Loan>): Loan | null {
    const index = this.loans.findIndex((l) => l.id === id);
    if (index === -1) return null;
    this.loans[index] = { ...this.loans[index], ...updates };
    return this.loans[index];
  }

  deleteLoan(id: string): boolean {
    const index = this.loans.findIndex((l) => l.id === id);
    if (index === -1) return false;
    this.loans.splice(index, 1);
    return true;
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  addTask(task: Omit<Task, "id" | "createdAt">): Task {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return this.tasks[index];
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  addAlert(alert: Omit<Alert, "id" | "createdAt">): Alert {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.alerts.push(newAlert);
    return newAlert;
  }

  updateAlert(id: string, updates: Partial<Alert>): Alert | null {
    const index = this.alerts.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.alerts[index] = { ...this.alerts[index], ...updates };
    return this.alerts[index];
  }

  deleteAlert(id: string): boolean {
    const index = this.alerts.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.alerts.splice(index, 1);
    return true;
  }

  getForumPosts(): ForumPost[] {
    return [...this.forumPosts];
  }

  addForumPost(
    post: Omit<ForumPost, "id" | "createdAt" | "comments" | "likes">
  ): ForumPost {
    const newPost: ForumPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    this.forumPosts.push(newPost);
    return newPost;
  }

  updateForumPost(id: string, updates: Partial<ForumPost>): ForumPost | null {
    const index = this.forumPosts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.forumPosts[index] = { ...this.forumPosts[index], ...updates };
    return this.forumPosts[index];
  }

  deleteForumPost(id: string): boolean {
    const index = this.forumPosts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.forumPosts.splice(index, 1);
    return true;
  }

  addComment(
    postId: string,
    comment: Omit<ForumComment, "id" | "createdAt">
  ): ForumComment | null {
    const post = this.forumPosts.find((p) => p.id === postId);
    if (!post) return null;

    const newComment: ForumComment = {
      ...comment,
      id: Date.now().toString(),
      postId,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(newComment);
    return newComment;
  }

  likePost(postId: string): boolean {
    const post = this.forumPosts.find((p) => p.id === postId);
    if (!post) return false;
    post.likes++;
    return true;
  }

  getKnowledgeResources(): KnowledgeResource[] {
    return [...this.knowledgeResources];
  }

  getExperts(): Expert[] {
    return [...this.experts];
  }

  getConsultations(): Consultation[] {
    return [...this.consultations];
  }

  addConsultation(
    consultation: Omit<Consultation, "id" | "createdAt">
  ): Consultation {
    const newConsultation: Consultation = {
      ...consultation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.consultations.push(newConsultation);
    return newConsultation;
  }

  updateConsultation(
    id: string,
    updates: Partial<Consultation>
  ): Consultation | null {
    const index = this.consultations.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.consultations[index] = { ...this.consultations[index], ...updates };
    return this.consultations[index];
  }

  deleteConsultation(id: string): boolean {
    const index = this.consultations.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.consultations.splice(index, 1);
    return true;
  }

  getInsurance(): Insurance[] {
    return [...this.insurance];
  }

  addInsurance(insurance: Omit<Insurance, "id" | "createdAt">): Insurance {
    const newInsurance: Insurance = {
      ...insurance,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.insurance.push(newInsurance);
    return newInsurance;
  }

  updateInsurance(id: string, updates: Partial<Insurance>): Insurance | null {
    const index = this.insurance.findIndex((i) => i.id === id);
    if (index === -1) return null;
    this.insurance[index] = { ...this.insurance[index], ...updates };
    return this.insurance[index];
  }

  deleteInsurance(id: string): boolean {
    const index = this.insurance.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.insurance.splice(index, 1);
    return true;
  }

  getCropRotations(): CropRotation[] {
    return [...this.cropRotations];
  }

  addCropRotation(
    rotation: Omit<CropRotation, "id" | "createdAt">
  ): CropRotation {
    const newRotation: CropRotation = {
      ...rotation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.cropRotations.push(newRotation);
    return newRotation;
  }
}

export const dataStore = new DataStore();
