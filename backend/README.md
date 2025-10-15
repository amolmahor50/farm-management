# Farm Management App - Backend API

A comprehensive farm management backend built with Node.js, Express.js, and MongoDB.

## Features

### Core Modules

- **Authentication**: Mobile OTP-based login, JWT authentication
- **Dashboard**: Quick add features, summary charts, analytics
- **Expense Management**: Track and categorize farm expenses
- **Yield Management**: Record crop yields and harvests
- **Loan Management**: Track loans, EMI schedules, and reminders
- **Task Planner**: Schedule and manage farm activities
- **Notifications**: Real-time alerts and reminders

### Advanced Features

- **Market Integration**: Crop prices and supplier information
- **Farmer Forum**: Community Q&A platform
- **Knowledge Hub**: Educational content and tutorials
- **Expert Consultation**: Connect with agricultural experts
- **Insurance Tracking**: Manage crop insurance policies
- **QR Code Management**: Track farm inputs and equipment
- **AI Insights**: Yield prediction, profit forecasting, expense optimization

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay integration
- **Email**: Nodemailer
- **File Generation**: PDFKit, json2csv

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```
MONGODB_URI=mongodb://localhost:27017/farm_app
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
OTP_EXPIRE=10

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
<!-- - `POST /verify-registration` - Verify OTP during registration -->
- `POST /send-otp` - Send login OTP
- `POST /verify-otp` - Verify login OTP
- `GET /me` - Get current user
- `GET /check/:phone` - Check if user exists

### User (`/api/user`)

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /account` - Deactivate account
- `POST /device-token` - Register device token
- `DELETE /device-token` - Remove device token

### Dashboard (`/api/dashboard`)

- `GET /summary` - Get dashboard summary
- `POST /quick-add/expense` - Quick add expense
- `POST /quick-add/yield` - Quick add yield
- `POST /quick-add/loan` - Quick add loan
- `GET /charts` - Get chart data

### Expenses (`/api/expenses`)

- `GET /` - Get all expenses (with filters)
- `POST /` - Create expense
- `GET /stats` - Get expense statistics
- `GET /:id` - Get single expense
- `PUT /:id` - Update expense
- `DELETE /:id` - Delete expense

### Yields (`/api/yields`)

- `GET /` - Get all yields
- `POST /` - Create yield record
- `GET /summary` - Get crop-wise summary
- `GET /:id` - Get single yield
- `PUT /:id` - Update yield
- `DELETE /:id` - Delete yield

### Loans (`/api/loans`)

- `GET /` - Get all loans
- `POST /` - Create loan
- `GET /upcoming-emis` - Get upcoming EMI payments
- `GET /:id` - Get single loan
- `PUT /:id` - Update loan
- `DELETE /:id` - Delete loan
- `POST /:id/emi-payment` - Record EMI payment

### Tasks (`/api/tasks`)

- `GET /` - Get all tasks
- `POST /` - Create task
- `GET /upcoming` - Get upcoming tasks
- `GET /:id` - Get single task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task
- `PATCH /:id/complete` - Mark task as complete

### Notifications (`/api/notifications`)

- `GET /` - Get all notifications
- `POST /` - Create notification
- `PATCH /mark-all-read` - Mark all as read
- `PATCH /:id/read` - Mark single as read
- `DELETE /:id` - Delete notification

### Reports (`/api/reports`)

- `GET /generate` - Generate report (CSV/JSON)
- `GET /export-pdf` - Export PDF report
- `GET /analytics` - Get analytics data

### Payments (`/api/payments`)

- `POST /subscription/create` - Create subscription order
- `POST /subscription/verify` - Verify payment
- `GET /subscription` - Get subscription details
- `POST /subscription/cancel` - Cancel subscription

### Market (`/api/market`)

- `GET /prices` - Get crop prices
- `POST /prices` - Add crop price
- `GET /prices/trends/:cropName` - Get price trends
- `GET /suppliers` - Get suppliers

### Forum (`/api/forum`)

- `GET /` - Get all posts
- `GET /:id` - Get single post
- `POST /` - Create post
- `PUT /:id` - Update post
- `DELETE /:id` - Delete post
- `POST /:id/comment` - Add comment
- `POST /:id/like` - Like/unlike post

### Knowledge (`/api/knowledge`)

- `GET /` - Get all content
- `GET /:id` - Get single content
- `POST /` - Create content (admin/expert only)
- `POST /:id/like` - Like content
- `POST /:id/bookmark` - Bookmark content

### Experts (`/api/experts`)

- `GET /` - Get all experts
- `GET /:id` - Get expert details
- `POST /profile` - Create expert profile
- `POST /book-consultation` - Book consultation
- `POST /:id/rate` - Rate expert

### Insurance (`/api/insurance`)

- `GET /` - Get all insurances
- `POST /` - Create insurance
- `GET /:id` - Get single insurance
- `PUT /:id` - Update insurance
- `POST /:id/claim` - File insurance claim

### QR Code (`/api/qr`)

- `GET /` - Get all QR data
- `POST /` - Create QR data
- `POST /scan` - Scan QR code
- `GET /:id` - Get QR data details
- `POST /:id/usage` - Record usage

### AI (`/api/ai`)

- `POST /predict-yield` - Predict crop yield
- `POST /predict-profit` - Forecast profit
- `POST /optimize-expenses` - Get expense optimization suggestions
- `POST /recommend-crop` - Get crop recommendations
- `POST /analyze-pest-risk` - Analyze pest risk
- `GET /history` - Get AI analysis history

## Database Models

### User

- Authentication and profile information
- Farm details and location
- Subscription and preferences

### Expense

- Category-wise expense tracking
- Payment methods and vendors
- Receipt management

### Yield

- Crop details and quantities
- Planting and harvest dates
- Revenue and profit tracking

### Loan

- Loan details and lenders
- EMI schedule and payments
- Document management

### Task

- Task scheduling and assignments
- Priority and status tracking
- Recurring tasks support

### Notification

- Multi-channel notifications
- Read status tracking
- Scheduled notifications

### Market

- Crop price data
- Supplier information
- Price trends

### ForumPost

- Community discussions
- Comments and replies
- Like and view tracking

### KnowledgeContent

- Educational materials
- Videos, articles, PDFs
- Ratings and bookmarks

### Expert

- Expert profiles
- Consultation scheduling
- Ratings and reviews

### Insurance

- Policy management
- Claims tracking
- Premium payments

### QRData

- Product tracking
- Usage history
- Inventory management

### AIData

- Analysis history
- Predictions and recommendations
- Feedback tracking

## Authentication

All protected routes require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Pagination

List endpoints support pagination:

```
GET /api/expenses?page=1&limit=10
```

## Filtering

Most list endpoints support filtering:

```
GET /api/expenses?category=seeds&startDate=2024-01-01&endDate=2024-12-31
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## License

MIT
