# StudyNotion Server (Backend) - Technical & Conceptual Documentation

## 1. Project Overview

StudyNotion is a full-stack EdTech platform built with the MERN stack (MongoDB, Express, React, Node.js). The server-side (backend) is responsible for user authentication, course management, payment processing, and all business logic. It exposes a RESTful API for the frontend and handles all data persistence, security, and integrations.

## 2. Technology Stack

- **Node.js**: JavaScript runtime for server-side logic
- **Express.js**: Web framework for building REST APIs
- **MongoDB**: NoSQL database for storing all application data
- **Mongoose**: ODM for MongoDB, schema and model management
- **Cloudinary**: Media storage for images and videos
- **Razorpay & Stripe**: Payment gateways for course purchases
- **Nodemailer**: Email sending for notifications and verification
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **dotenv**: Environment variable management

## 3. Architecture & Folder Structure

```
server/
  config/         # Database, cloud, payment configs
  controllers/    # Business logic for each resource
  mail/           # Email templates
  middlewares/    # Auth, role checks
  models/         # Mongoose schemas
  routes/         # API endpoints
  utils/          # Helpers (mail, upload, etc)
  index.js        # App entry point
  package.json    # Dependencies
```

## 4. Database Schema & Models

### User
- firstName, lastName, email, password, accountType (Admin/Student/Instructor)
- image, courses (enrolled/created), courseProgress, cart
- additionalDetails (Profile), token, resetPasswordExpires

### Profile
- gender, about, dateOfBirth, contactNumber

### Course
- courseName, courseDescription, instructor, whatYouWillLearn
- courseContent (Sections), ratingAndReviews, price, thumbnail, tag, category
- studentsEnrolled, instructions, status (Draft/Published), createdAt

### Category
- name, description, courses

### Section & SubSection
- Section: sectionName, subSection (array of SubSection)
- SubSection: title, timeDuration, description, videoUrl

### Cart
- user, courses

### OTP
- email, otp, createdAt (expires in 5 min)

### RatingAndReview
- user, rating, review, course

### CourseProgress
- courseID, userId, completedVideos

## 5. API Structure & Endpoints

### Auth
- POST `/api/v1/auth/signup` - Register user (with OTP)
- POST `/api/v1/auth/login` - Login
- POST `/api/v1/auth/sendotp` - Send OTP for signup
- POST `/api/v1/auth/changepassword` - Change password
- POST `/api/v1/auth/reset-password-token` - Request password reset
- POST `/api/v1/auth/reset-password` - Reset password

### User Profile
- GET `/api/v1/profile/getUserDetails` - Get user profile
- PUT `/api/v1/profile/updateProfile` - Update profile
- DELETE `/api/v1/profile/deleteProfile` - Delete user
- POST `/api/v1/profile/updateDisplayPicture` - Update profile image
- GET `/api/v1/profile/getEnrolledCourses` - List enrolled courses
- GET `/api/v1/profile/instructorDashboard` - Instructor stats

### Course
- POST `/api/v1/course/createCourse` - Instructor creates course
- POST `/api/v1/course/editCourse` - Edit course
- DELETE `/api/v1/course/deleteCourse` - Delete course
- GET `/api/v1/course/getAllCourses` - List all courses
- POST `/api/v1/course/getCourseDetails` - Get course details
- POST `/api/v1/course/getFullCourseDetails` - Get full details (with progress)
- GET `/api/v1/course/getInstructorCourses` - Instructor's courses

### Section & SubSection
- POST `/api/v1/course/addSection` - Add section
- POST `/api/v1/course/updateSection` - Update section
- POST `/api/v1/course/deleteSection` - Delete section
- POST `/api/v1/course/addSubSection` - Add sub-section
- POST `/api/v1/course/updateSubSection` - Update sub-section
- POST `/api/v1/course/deleteSubSection` - Delete sub-section

### Category
- POST `/api/v1/course/createCategory` - Admin creates category
- GET `/api/v1/course/showAllCategories` - List categories
- POST `/api/v1/course/getCategoryPageDetails` - Category details

### Cart
- POST `/api/v1/course/addToCart` - Add course to cart
- POST `/api/v1/course/removeFromCart` - Remove from cart

### Rating & Review
- POST `/api/v1/course/createRating` - Student rates course
- GET `/api/v1/course/getAverageRating` - Get average rating
- GET `/api/v1/course/getReviews` - Get all reviews

### Payment
- POST `/api/v1/payment/capturePayment` - Initiate payment (Razorpay)
- POST `/api/v1/payment/verifySignature` - Verify payment
- POST `/api/v1/payment/sendPaymentSuccessEmail` - Payment success email
- POST `/api/v1/payment/purchaseDirectly` - Enroll without payment (for free courses)

### Contact
- POST `/api/v1/contact` - Contact form

## 6. Authentication & Authorization
- JWT-based authentication (token in cookie/header)
- Middleware: `auth` (checks token), `isStudent`, `isInstructor`, `isAdmin`
- Passwords hashed with bcrypt
- OTP for signup, email verification
- Password reset via email link (tokenized)

## 7. Payment Integration
- **Razorpay**: Used for capturing payments, verifying signatures
- **Stripe**: Used for direct card payments
- On successful payment, user is enrolled in course, email sent

## 8. Email & Notification System
- Nodemailer for sending emails (OTP, password reset, enrollment, payment success)
- Email templates in `server/mail/`
- All critical actions (signup, password change, enrollment) trigger emails

## 9. Key Business Logic & Flows
- **Signup**: User registers, receives OTP, verifies, profile created
- **Login**: JWT issued, user info returned
- **Course Creation**: Instructor creates course, uploads media to Cloudinary
- **Enrollment**: Payment processed, user enrolled, progress tracked
- **Progress Tracking**: CourseProgress model tracks completed videos
- **Rating/Review**: Only enrolled students can rate/review
- **Cart**: Students can add/remove courses before purchase

## 10. Security & Best Practices
- All sensitive routes protected by JWT and role-based middleware
- Passwords never stored in plain text
- Environment variables for all secrets/keys
- Input validation on all endpoints
- Media uploads handled securely via Cloudinary
- Payment webhooks/signature verification

## 11. Extensibility & Maintainability
- Modular controller/service structure
- Mongoose models for all entities
- Easy to add new features (e.g., new payment gateways, notifications)
- Clear separation of concerns (routes, controllers, models, utils)
- Well-documented code and API

## 12. Environment Variables (Sample)
```
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret
MAIL_HOST=your_smtp_host
MAIL_USER=your_email
MAIL_PASS=your_email_password
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_key
FOLDER_NAME=your_cloudinary_folder
```

---

This document provides a full technical and conceptual overview of the StudyNotion backend. For further details, refer to the codebase and inline comments.
