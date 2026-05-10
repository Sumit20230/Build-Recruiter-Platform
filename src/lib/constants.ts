export const APP_CONFIG = {
  NAME: "RecruiterSignal",
  VERSION: "0.1.0",
};

export const GEMINI_MODELS = {
  DEFAULT: "gemini-2.5-flash",
};

export const USER_ROLES = {
  RECRUITER: "recruiter",
  JOBSEEKER: "jobseeker",
};

export const ERROR_MESSAGES = {
  GEMINI_API_KEY_MISSING: "Gemini API key is not configured.",
  GEMINI_QUOTA_EXCEEDED: "AI quota exceeded. Please try again later.",
  GEMINI_GENERIC_ERROR: "The AI assistant is temporarily unavailable. Please try again later.",
  AUTH_UNAUTHORIZED: "You must be signed in to perform this action.",
  AUTH_GENERIC_FAILURE: "Try again.",
  AUTH_SIGN_IN_FAILED: "Sign in failed",
  AUTH_SIGN_UP_FAILED: "Signup failed",
  AUTH_RATE_LIMIT: "Supabase is rate limiting signup emails. For local testing, disable email confirmation in Supabase Auth settings, or wait and try a different email address.",
};

export const UI_STRINGS = {
  // Common
  WELCOME_BACK: "Welcome back",
  ACCOUNT_CREATED: "Account created",
  WORKSPACE_READY: "Your workspace is ready.",
  LOADING: "Loading...",
  THINKING: "Thinking...",
  FOLLOW: "Follow",
  FOLLOWING: "Following",
  FOLLOWERS: "followers",
  LINKEDIN: "LinkedIn",
  GENERATE: "Generate",
  GENERATING: "Generating...",
  ERROR: "Error",
  SUCCESS: "Success",

  // Auth
  AUTH_TITLE: "Access RecruiterSignal",
  AUTH_LOGIN_TAB: "Login",
  AUTH_SIGNUP_TAB: "Sign Up",
  AUTH_EMAIL_LABEL: "Email",
  AUTH_PASSWORD_LABEL: "Password",
  AUTH_NAME_LABEL: "Full name",
  AUTH_SIGN_IN_BUTTON: "Sign in",
  AUTH_SIGNING_IN: "Signing in...",
  AUTH_CREATE_ACCOUNT_BUTTON: "Create account",
  AUTH_CREATING_ACCOUNT: "Creating...",

  // Roles
  ROLE_RECRUITER: "Recruiter",
  ROLE_JOBSEEKER: "Jobseeker",

  // Landing
  LANDING_TAGLINE: "Public recruiter profiles jobseekers can actually trust.",
  LANDING_SUBHEADING: "A focused professional presence for recruiters, with live open roles, social proof, and AI-powered profile Q&A for candidates.",
  LANDING_JOIN_RECRUITER: "Join as Recruiter",
  LANDING_FIND_RECRUITERS: "Find Recruiters",
  LANDING_AI_PROMPT_PREVIEW: "Ask AI: “What skills should I have for Maya’s active roles?”",
  
  // Navigation
  NAV_DASHBOARD: "Dashboard",
  NAV_EDIT_PROFILE: "Edit Profile",
  NAV_DISCOVER: "Discover",
  NAV_SIGN_OUT: "Sign out",
  NAV_GET_STARTED: "Get started",
  
  // Footer
  FOOTER_TAGLINE: "RecruiterSignal helps hiring teams earn trust in public.",
  FOOTER_BUILT_WITH: "Built with React, Supabase, and Gemini.",

  // Notifications
  NOTIFICATIONS_TITLE: "Notifications",

  // Dashboard
  DASHBOARD_TITLE: "Recruiter Dashboard",
  DASHBOARD_SUBTITLE: "Manage your recruitment activity and public presence.",
  DASHBOARD_EDIT_PROFILE: "Edit Profile",
  DASHBOARD_ADD_JOB: "Add Job Posting",
  DASHBOARD_PROFILE_SECTION: "Your Public Profile",
  DASHBOARD_PROFILE_DESC: "Candidates see this page when they discover you. Keep it updated!",
  DASHBOARD_VIEW_PROFILE: "View public profile",
  DASHBOARD_STAT_VIEWS: "Views last 30 days",
  DASHBOARD_STAT_FOLLOWERS: "Followers",
  DASHBOARD_STAT_JOBS: "Active job postings",
  DASHBOARD_TAB_OVERVIEW: "Overview",
  DASHBOARD_TAB_APPLICATIONS: "Applications",
  DASHBOARD_TAB_FOLLOWERS: "Followers",
  
  // Discover
  DISCOVER_TITLE: "Discover Recruiters",
  DISCOVER_SUBTITLE: "Find hiring professionals with credible profiles and active roles.",
  DISCOVER_SEARCH_PLACEHOLDER: "Search recruiters, companies, locations, job types, or skills",
  DISCOVER_NO_RESULTS: "No recruiters found",
  DISCOVER_NO_RESULTS_DESC: "Try a broader company, location, job type, or skill search.",
  DISCOVER_FILTER_COMPANY: "Company",
  DISCOVER_FILTER_LOCATION: "Location",
  DISCOVER_FILTER_JOB_TYPE: "Job type",

  // Profile Edit
  EDIT_PROFILE_TITLE: "Edit Profile",
  EDIT_PROFILE_BIO_LABEL: "bio",
  EDIT_PROFILE_WORK_SECTION: "Work Experience",
  EDIT_PROFILE_SAVE_WORK: "Save experience",
  EDIT_PROFILE_JOB_SECTION: "Job Postings",
  EDIT_PROFILE_SAVE_JOB: "Save job",
  EDIT_PROFILE_NO_JOBS: "No job postings yet",
  EDIT_PROFILE_NO_JOBS_DESC: "Add an active role so candidates can see what you are hiring for right now.",
  EDIT_PROFILE_ACTIVE_LABEL: "Active",
  EDIT_PROFILE_EDIT: "Edit",
  EDIT_PROFILE_SAVE_PROFILE: "Save profile",
  EDIT_PROFILE_SAVING: "Saving...",
  EDIT_PROFILE_ADD_EXP: "Add experience",
  EDIT_PROFILE_EDIT_EXP: "Edit experience",
  EDIT_PROFILE_ADD_JOB: "Add job",
  EDIT_PROFILE_EDIT_JOB: "Edit job",

  // Applications
  APPLICATIONS_TITLE: "Applications",
  APPLICATIONS_NONE: "No applications yet",
  APPLICATIONS_NONE_DESC: "Post jobs to start receiving candidates.",
  APPLICATIONS_REJECT: "Reject",
  APPLICATIONS_SHORTLIST: "Shortlist",
  APPLICATIONS_RESET: "Reset to Pending",
  APPLICATIONS_TRY_AGAIN: "Try Again",
  APPLICATIONS_APPLIED_FOR: "Applied for: ",
  APPLICATIONS_APPLIED_ON: "Applied",

  // Profile & Jobs
  JOB_TITLE_PLACEHOLDER: "Title",
  JOB_COMPANY_PLACEHOLDER: "Company",
  JOB_LOCATION_PLACEHOLDER: "Location",
  JOB_TYPE_PLACEHOLDER: "Job type",
  JOB_DESC_PLACEHOLDER: "Description",
  JOBS_ACTIVE_LABEL: "active",
  CONNECTION_ERROR: "Connection Error",

  // Utils
  DATE_PRESENT: "Present",
  INITIALS_FALLBACK: "RP",

  // Profile Header
  PROFILE_FOLLOW_BUTTON: "Follow",
  PROFILE_FOLLOWING_BUTTON: "Following",
  PROFILE_FOLLOWERS_COUNT: (count: number) => `${count} followers`,

  // Public Profile
  PROFILE_TOTAL_VIEWS: "Total views",
  PROFILE_FOLLOWERS_LABEL: "Followers",
  PROFILE_ACTIVE_LISTINGS: "Active listings",
  PROFILE_ABOUT_SECTION: "About",
  PROFILE_WORK_SECTION: "Work Experience",
  PROFILE_JOBS_SECTION: "Active Job Postings",
  PROFILE_NO_BIO: "This recruiter has not added a bio yet.",
  PROFILE_NO_JOBS: "No active job postings",
  PROFILE_NO_JOBS_DESC: "This recruiter has not listed any open roles right now. Follow them to keep an eye on future activity.",
  RECRUITER_NOT_FOUND: "Recruiter not found.",

  // Job Modal
  JOB_MODAL_DESC: "Job Description",
  JOB_MODAL_APPLY: "Apply for this position",
  JOB_MODAL_MESSAGE: "Message to recruiter (optional)",
  JOB_MODAL_PLACEHOLDER: "Why are you a good fit for this role?",
  JOB_MODAL_CANCEL: "Cancel",
  JOB_MODAL_SUBMIT: "Submit Application",
  JOB_MODAL_NO_DESC: "No description provided.",
  JOB_MODAL_STATUS_REVIEW: "Under Review",
  JOB_MODAL_STATUS_REVIEWED: "Reviewed",
  JOB_MODAL_STATUS_SHORTLIST: "Shortlisted",
  JOB_MODAL_STATUS_REJECTED: "Not Selected",
  JOB_MODAL_LOCATION_FALLBACK: "Location not listed",
  JOB_MODAL_POSTED_DATE: (date: string) => `Posted ${date}`,

  // AI Context Labels
  AI_CONTEXT_WORK: "Work experience:",
  AI_CONTEXT_JOBS: "Active job postings:",
  AI_CONTEXT_NO_WORK: "No work experience listed.",
  AI_CONTEXT_NO_JOBS: "No active jobs listed.",

  // Toast Messages
  TOAST_PROFILE_SAVED: "Profile saved",
  TOAST_PROFILE_SAVE_FAILED: "Profile save failed",
  TOAST_WORK_ADDED: "Work item added",
  TOAST_WORK_UPDATED: "Work item updated",
  TOAST_WORK_FAILED: "Work item failed",
  TOAST_JOB_ADDED: "Job added",
  TOAST_JOB_UPDATED: "Job updated",
  TOAST_JOB_FAILED: "Job save failed",
  TOAST_DELETED: "Deleted",
  TOAST_DELETE_FAILED: "Delete failed",
  TOAST_FOLLOW_SUCCESS: "Following recruiter",
  TOAST_UNFOLLOW_SUCCESS: "Unfollowed recruiter",
  TOAST_FOLLOW_FAILED: "Follow update failed",
  TOAST_APPLY_SUCCESS: "Application sent!",
  TOAST_APPLY_SUCCESS_DESC: (title: string) => `Your application for ${title} has been recorded.`,
  TOAST_APPLY_FAILED: "Failed to apply",
  TOAST_STATUS_UPDATED: "Status Updated",
  TOAST_STATUS_UPDATED_DESC: (status: string) => `Candidate status changed to ${status}.`,
  TOAST_UPDATE_FAILED: "Update Failed",

  // Applications & Notifications
  APPLY_ERR_MISSING: "Missing required fields for application: Job ID or User ID.",
  APPLY_ERR_FETCH: "Failed to fetch job details",
  APPLY_ERR_ALREADY: "You have already applied for this position.",
  APPLY_ERR_FAILED: "Application failed",
  APPLY_NOTIF_TITLE: "New Job Application",
  APPLY_NOTIF_MSG: (title: string, company: string) => `A candidate has applied for ${title} at ${company}.`,
  STATUS_UPDATE_ERR_ID: "Application ID is required for status update.",
  STATUS_UPDATE_ERR_FETCH: "Failed to retrieve application details",
  STATUS_UPDATE_ERR_FAILED: "Status update failed",
  STATUS_UPDATE_NOTIF_TITLE: "Application Update",
  STATUS_UPDATE_NOTIF_MSG: (title: string, label: string) => `Your application for ${title} has been ${label}.`,
  STATUS_LABEL_PENDING: "placed back under review",
  STATUS_LABEL_REVIEWED: "reviewed",
  STATUS_LABEL_SHORTLISTED: "shortlisted!",
  STATUS_LABEL_REJECTED: "updated",

  // Auth & Errors
  AUTH_ERR_NO_SESSION: "Sign in succeeded but no user session was returned.",
  AUTH_ERR_NO_ROLE: "Your account is missing a recruiter/jobseeker role. Please sign up again or update the profiles row in Supabase.",
  APPLICATIONS_ERR_UPDATE: "Failed to update application status",
  APPLICATIONS_ERR_LOAD: "Failed to load applications",
  EDIT_PROFILE_ERR_JOBS: "Failed to load your job postings",
  COMMON_TRY_AGAIN: "Try again.",

  // Profile
  PROFILE_RECRUITER_DEFAULT: "Recruiter",
  PROFILE_HEADLINE_DEFAULT: "Hiring professional",
  
  // AI Tools
  AI_TOOLKIT_TITLE: "AI Candidate Toolkit",
  AI_TOOLKIT_DESC: "Tailored tools to help you engage with this recruiter effectively.",
  AI_CHAT_TITLE: "Ask About This Recruiter",
  AI_CHAT_SUBTITLE: "Powered by Gemini AI · Answers based on public profile data only",
  RESUME_ANALYZER_TITLE: "Resume Analyzer",
  RESUME_ANALYZER_LABEL: "Resume / CV",
  RESUME_ANALYZER_UPLOAD: "Upload PDF / Word",
  RESUME_ANALYZER_PLACEHOLDER: "Paste your professional experience here or upload a file...",
  RESUME_ANALYZER_BUTTON: "Analyze Match",
  RESUME_ANALYZER_SUCCESS: "Resume parsed successfully",
  RESUME_ANALYZER_ERROR: "Error analyzing resume. Please try again.",
  RESUME_ANALYZER_RESULT_TITLE: "Analysis Result",
  
  INTERVIEW_STRATEGY_TITLE: "Interview Strategy",
  INTERVIEW_STRATEGY_DESC: "Get a personalized \"Cheat Sheet\" for your interview with this recruiter based on their career history and active listings.",
  INTERVIEW_STRATEGY_BUTTON: "Generate Cheat Sheet",
  INTERVIEW_STRATEGY_ERROR: "Error generating strategy. Please try again.",
  
  // File Upload Errors
  ERR_UNSUPPORTED_FILE: "Unsupported file type",
  ERR_UNSUPPORTED_FILE_DESC: "Please upload a PDF or .docx file.",
  ERR_PARSING_FILE: "Error parsing file",
  ERR_PARSING_FILE_DESC: "Could not extract text from this document.",
  
  OUTREACH_GEN_TITLE: "Personalized Outreach",
  OUTREACH_GEN_LABEL: "Briefly describe your background or goal",
  OUTREACH_GEN_PLACEHOLDER: "e.g., Senior Frontend dev looking for remote React roles...",
  OUTREACH_GEN_BUTTON: "Generate Outreach Script",
  OUTREACH_GEN_ERROR: "Error generating outreach message. Please try again.",
  OUTREACH_GEN_RESULT_TITLE: "Personalized Scripts",
  
  CHAT_PLACEHOLDER: "Ask a question...",

  // Empty States
  EMPTY_WORK_TITLE: "No work experience yet",
  EMPTY_WORK_DESC: "Add past companies and roles to help jobseekers understand this recruiter's background.",
  EMPTY_FOLLOWERS_TITLE: "No followers yet",
  EMPTY_FOLLOWERS_DESC: "Build your credibility to attract candidates.",

  // Accessibility
  ARIA_CLOSE: "Close",
  ARIA_SEND: "Send message",

  // Landing Features
  FEATURE_1_TITLE: "Credible profiles",
  FEATURE_1_BODY: "Recruiters show their background, companies, and open roles in one public place.",
  FEATURE_2_TITLE: "Focused discovery",
  FEATURE_2_BODY: "Jobseekers filter by location, company, hiring mode, and skills without wading through a jobs board.",
  FEATURE_3_TITLE: "Profile-aware AI",
  FEATURE_3_BODY: "Gemini answers questions from live recruiter data, keeping engagement anchored to facts.",

  // Landing Demo
  DEMO_NAME: "Maya Rao",
  DEMO_HEADLINE: "Senior Tech Recruiter · Fintech hiring",
  DEMO_VIEWS: "1.8k views",
  DEMO_ROLES: "9 roles",

  // Additional Strings
  NOTIFICATIONS_MARK_ALL: "Mark all read",
  NOTIFICATIONS_EMPTY: "No notifications yet",
  PROFILE_INDEPENDENT: "Independent",
  
  // Skill Tag Input
  SKILL_TAG_HINT: "Press comma or Enter after each skill.",
  SKILL_TAG_ADD_ANOTHER: "Add another skill",
  SKILL_TAG_PLACEHOLDER: "Type a skill, then comma or Enter",

  // Roles & Types
  ROLE_RECRUITER_DESC: "Build a trusted hiring profile.",
  ROLE_JOBSEEKER_DESC: "Find credible recruiters.",
  JOBSEEKER: "Jobseeker",

  // Profile Editor Fields
  FIELD_FULL_NAME: "Full Name",
  FIELD_AVATAR_URL: "Avatar URL",
  FIELD_HEADLINE: "Headline",
  FIELD_COMPANY: "Company",
  FIELD_LOCATION: "Location",
  FIELD_LINKEDIN_URL: "LinkedIn URL",
};

export const AI_STARTERS = [
  "What roles are open right now?",
  "Does this recruiter hire remote roles?",
  "What skills should I have?",
  "What is their background?",
];
