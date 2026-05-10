export type Role = "recruiter" | "jobseeker";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  linkedin_url: string | null;
  created_at: string;
}

export interface WorkExperience {
  id: string;
  recruiter_id: string;
  company: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

export interface JobPosting {
  id: string;
  recruiter_id: string;
  title: string;
  company: string;
  location: string | null;
  job_type: string | null;
  description: string | null;
  skills: string[] | null;
  is_active: boolean;
  created_at: string;
}

export interface RecruiterCardData extends Profile {
  follower_count: number;
  active_jobs_count: number;
}

export interface PublicRecruiterProfile {
  profile: Profile;
  work: WorkExperience[];
  jobs: JobPosting[];
  followerCount: number;
  viewCount: number;
  isFollowing: boolean;
}

export enum AppStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
}

export type ApplicationStatus = "pending" | "reviewed" | "shortlisted" | "rejected";

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  message: string | null;
  created_at: string;
  // Join data
  job_postings?: JobPosting;
  profiles?: Profile;
}

export interface AuthSignUpPayload {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}
