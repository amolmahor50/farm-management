# Farm Management App - Project Structure

## Overview
This is a comprehensive farm management backend built with Node.js, Express.js, and MongoDB. The project follows a modular MVC architecture with 56 JavaScript files organized across different directories.

## Directory Structure

```
farm-app-backend/
├── server.js                 # Main server entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── README.md                 # Project documentation
├── PROJECT_STRUCTURE.md      # This file
│
├── config/
│   └── db.js                 # MongoDB connection configuration
│
├── models/                   # Mongoose schemas (14 models)
│   ├── User.js               # User authentication and profile
│   ├── Expense.js            # Farm expense tracking
│   ├── Yield.js              # Crop yield records
│   ├── Loan.js               # Loan and EMI management
│   ├── Task.js               # Farm task scheduling
│   ├── Notification.js       # Notification system
│   ├── Subscription.js       # Payment subscriptions
│   ├── Market.js             # Crop prices and suppliers
│   ├── ForumPost.js          # Community forum
│   ├── KnowledgeContent.js   # Educational content
│   ├── Expert.js             # Agricultural experts
│   ├── Insurance.js          # Crop insurance
│   ├── QRData.js             # QR code tracking
│   └── AIData.js             # AI predictions and insights
│
├── controllers/              # Business logic (17 controllers)
│   ├── authController.js     # Authentication (OTP, JWT)
│   ├── userController.js     # User profile management
│   ├── dashboardController.js # Dashboard summary and charts
│   ├── expenseController.js   # Expense CRUD operations
│   ├── yieldController.js     # Yield CRUD operations
│   ├── loanController.js      # Loan and EMI management
│   ├── taskController.js      # Task scheduling
│   ├── notificationController.js # Notification handling
│   ├── reportController.js    # Report generation (CSV/PDF)
│   ├── paymentController.js   # Subscription payments
│   ├── marketController.js    # Market prices and suppliers
│   ├── forumController.js     # Forum posts and comments
│   ├── knowledgeController.js # Knowledge hub content
│   ├── expertController.js    # Expert consultations
│   ├── insuranceController.js # Insurance and claims
│   ├── qrController.js        # QR code management
│   └── aiController.js        # AI predictions and analytics
│
├── routes/                   # API endpoints (17 route files)
│   ├── auth.js               # /api/auth
│   ├── user.js               # /api/user
│   ├── dashboard.js          # /api/dashboard
│   ├── expense.js            # /api/expenses
│   ├── yield.js              # /api/yields
│   ├── loan.js               # /api/loans
│   ├── task.js               # /api/tasks
│   ├── notification.js       # /api/notifications
│   ├── report.js             # /api/reports
│   ├── payment.js            # /api/payments
│   ├── market.js             # /api/market
│   ├── forum.js              # /api/forum
│   ├── knowledge.js          # /api/knowledge
│   ├── expert.js             # /api/experts
│   ├── insurance.js          # /api/insurance
│   ├── qr.js                 # /api/qr
│   └── ai.js                 # /api/ai
│
├── middleware/               # Express middleware
│   ├── auth.js               # JWT authentication and authorization
│   └── errorHandler.js       # Global error handling
│
└── utils/                    # Helper utilities
    ├── otpSender.js          # OTP generation and SMS
    ├── paymentGateway.js     # Razorpay integration
    ├── emailSender.js        # Email notifications
    └── aiUtils.js            # AI prediction algorithms
```

## Module Breakdown

### Authentication Module
- **Files**: authController.js, auth.js (routes), auth.js (middleware), User.js
- **Features**: Mobile OTP login, JWT tokens, user registration

### Core Management Modules
1. **Expense Module**: Track categorized expenses with receipts
2. **Yield Module**: Record crop yields, revenue, and profit
3. **Loan Module**: Manage loans, EMI schedules, and reminders
4. **Task Module**: Schedule and track farm activities

### Dashboard & Analytics
- **Dashboard**: Quick add, summaries, and charts
- **Reports**: Generate CSV/PDF reports with analytics

### Community & Learning
1. **Forum**: Q&A platform with posts, comments, and likes
2. **Knowledge Hub**: Educational content (articles, videos, PDFs)
3. **Expert Consultation**: Book and rate expert consultations

### Advanced Features
1. **Market Integration**: Crop prices and supplier information
2. **Insurance**: Policy management and claims tracking
3. **QR Code System**: Track farm inputs and equipment
4. **AI Insights**: Yield prediction, profit forecasting, expense optimization

### Supporting Systems
- **Notifications**: Multi-channel alerts and reminders
- **Payments**: Subscription management with Razorpay
- **User Management**: Profiles, preferences, and device tokens

## API Structure

All APIs follow REST conventions:
- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT/PATCH` - Update resources
- `DELETE` - Remove resources

### Base URL Pattern
```
/api/{module}/{resource}
```

### Authentication
Protected routes require JWT token:
```
Authorization: Bearer <token>
```

## Database Schema

### Collections (14 total)
1. users
2. expenses
3. yields
4. loans
5. tasks
6. notifications
7. subscriptions
8. markets
9. forumposts
10. knowledgecontents
11. experts
12. insurances
13. qrdatas
14. aidatas

## Technology Stack

### Core
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB

### Authentication & Security
- **jsonwebtoken**: JWT tokens
- **bcryptjs**: Password hashing

### Additional Libraries
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **nodemailer**: Email sending
- **pdfkit**: PDF generation
- **json2csv**: CSV export
- **qrcode**: QR code generation
- **axios**: HTTP requests
- **node-cron**: Task scheduling

## Environment Variables

Required environment variables in `.env`:
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: JWT signing key
- `JWT_EXPIRE`: Token expiration time
- `OTP_EXPIRE`: OTP validity in minutes
- `SMTP_*`: Email configuration
- `RAZORPAY_*`: Payment gateway keys
- `WEATHER_API_KEY`: Weather data (optional)
- `MARKET_API_KEY`: Market data (optional)

## Development

### Start Server
```bash
npm start          # Production
npm run dev        # Development with nodemon
```

### File Count
- Total JavaScript files: 56
- Models: 14
- Controllers: 17
- Routes: 17
- Middleware: 2
- Utils: 4
- Config: 1
- Server: 1

## Features Summary

✅ **17 API Modules** with full CRUD operations
✅ **14 Database Models** with relationships and indexes
✅ **JWT Authentication** with role-based access
✅ **OTP-based Login** for mobile users
✅ **Payment Integration** with Razorpay
✅ **File Export** (CSV/PDF reports)
✅ **Real-time Notifications** system
✅ **AI-powered Insights** for farming decisions
✅ **Community Features** (forum, expert consultation)
✅ **Market Integration** for crop prices
✅ **Comprehensive Error Handling**
✅ **Pagination & Filtering** on list endpoints
✅ **QR Code Management** for inventory
✅ **Insurance Tracking** with claims

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Input validation
- Error handling middleware
- Secure environment variables

## Scalability

- Modular architecture
- Separated concerns (MVC pattern)
- Database indexing for performance
- Pagination support
- Aggregation pipelines for analytics
- Async/await for non-blocking operations

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Next Steps for Deployment

1. Set up production MongoDB database
2. Configure production environment variables
3. Set up SMS gateway for OTP
4. Configure email service (SMTP)
5. Set up Razorpay account
6. Deploy to cloud platform (AWS, Heroku, etc.)
7. Set up SSL certificate
8. Configure domain and DNS
9. Set up monitoring and logging
10. Implement rate limiting
11. Add API documentation (Swagger)
12. Set up automated backups

## Support & Documentation

- README.md: General project overview
- PROJECT_STRUCTURE.md: This detailed structure guide
- Inline code comments for complex logic
- Consistent naming conventions throughout
