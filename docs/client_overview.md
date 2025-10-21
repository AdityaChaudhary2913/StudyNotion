# StudyNotion Client (Frontend) - Technical & Conceptual Documentation

## 1. Project Overview

The StudyNotion client is a modern, responsive, and feature-rich frontend for the StudyNotion EdTech platform. Built with React and Tailwind CSS, it provides a seamless user experience for students, instructors, and admins, supporting course discovery, enrollment, learning, and management.

## 2. Technology Stack

- **React**: Component-based UI library
- **Redux Toolkit**: State management
- **React Router v6**: Client-side routing
- **Axios**: API requests
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Notifications
- **Chart.js & react-chartjs-2**: Data visualization
- **Stripe**: Payment integration (client-side)
- **Other Libraries**: react-icons, swiper, video-react, etc.

## 3. Architecture & Folder Structure

```
src/
  assets/         # Images, logos, videos
  components/     # UI components (common, core, contactPage)
  data/           # Static data (links, country codes, etc.)
  hooks/          # Custom React hooks
  pages/          # Route-level pages (Home, Login, Dashboard, etc.)
  reducer/        # Redux root reducer
  services/       # API connectors, endpoints, business logic
  slices/         # Redux slices (auth, profile, cart, etc.)
  utils/          # Utility functions/constants
  App.js          # Main app component, routing
  index.js        # Entry point, Redux & Router setup
```

## 4. State Management

- **Redux Toolkit** is used for global state:
  - `authSlice`: Auth token, signup state
  - `profileSlice`: User profile, real user data
  - `cartSlice`: Shopping cart for students
  - `courseSlice`, `viewCourseSlice`: Course and view state
- State is persisted in `localStorage` for auth and user info.

## 5. Routing & Navigation

- **React Router v6** is used for all navigation.
- Public and protected routes:
  - `OpenRoute`: Only for unauthenticated users (login, signup, etc.)
  - `PrivateRoute`: Only for authenticated users (dashboard, course view, etc.)
- Dynamic routes for course details, catalog, video playback, etc.
- Navbar and footer are persistent across all pages.

## 6. Main Pages & Flows

- **Home**: Landing page, marketing, call-to-action, reviews
- **Login/Signup/Forgot/Reset Password**: Auth flows, OTP verification
- **Dashboard**: Role-based (Student/Instructor/Admin)
  - Student: Profile, settings, cart, enrolled courses, progress
  - Instructor: Add/edit courses, my courses, instructor stats
- **Catalog**: Browse courses by category
- **Course Details**: View course info, purchase/enroll
- **View Course**: Video player, progress tracking, content navigation
- **Contact/About**: Static info, contact form
- **Error**: 404 and fallback

## 7. API Integration

- **apiConnector**: Centralized Axios wrapper for all API calls
- **services/operation/**: Business logic for auth, course, profile, etc.
- **Endpoints**: Defined in `services/apis.js`, used throughout the app
- **Redux Thunks**: For async actions (login, signup, fetch data, etc.)
- **Error Handling**: Toast notifications for all API errors

## 8. UI & UX

- **Tailwind CSS**: Responsive, utility-first styling
- **Component Library**: Modular, reusable components (Navbar, Footer, Buttons, Forms, etc.)
- **Mobile Support**: Mobile nav, responsive layouts
- **Dynamic Catalog**: Categories fetched from backend, shown in Navbar and Catalog
- **Video Player**: For course content (video-react)
- **Charts**: For dashboard analytics (Chart.js)
- **Review Slider**: Student reviews/testimonials

## 9. Authentication & Authorization

- JWT token stored in Redux and localStorage
- User info decoded from token and stored in Redux
- Role-based UI rendering (Student/Instructor/Admin)
- Protected routes for dashboard, course view, etc.

## 10. Payment Integration

- **Stripe**: Client-side payment for course purchases
- **Razorpay**: Payment handled via backend
- On success, user is enrolled and notified

## 11. Extensibility & Maintainability

- Modular folder structure for easy scaling
- Separation of concerns (components, pages, services, slices)
- Easy to add new features (e.g., new roles, analytics, notifications)
- Well-documented code and clear naming conventions

## 12. Environment Variables (Sample)

```
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_STRIPE_KEY=your_stripe_key
```

---

This document provides a full technical and conceptual overview of the StudyNotion frontend. For further details, refer to the codebase and inline comments.
