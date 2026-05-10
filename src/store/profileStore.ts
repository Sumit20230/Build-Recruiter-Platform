import { create } from "zustand";
import type { JobPosting, Profile, PublicRecruiterProfile, WorkExperience } from "@/types";

interface ProfileState {
  myProfile: Profile | null;
  publicProfile: PublicRecruiterProfile | null;
  workExperience: WorkExperience[];
  jobPostings: JobPosting[];
  setMyProfile: (profile: Profile | null) => void;
  setPublicProfile: (profile: PublicRecruiterProfile | null) => void;
  setWorkExperience: (items: WorkExperience[]) => void;
  setJobPostings: (items: JobPosting[]) => void;
  resetProfileState: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  myProfile: null,
  publicProfile: null,
  workExperience: [],
  jobPostings: [],
  setMyProfile: (myProfile) => set({ myProfile }),
  setPublicProfile: (publicProfile) => set({ publicProfile }),
  setWorkExperience: (workExperience) => set({ workExperience }),
  setJobPostings: (jobPostings) => set({ jobPostings }),
  resetProfileState: () =>
    set({
      myProfile: null,
      publicProfile: null,
      workExperience: [],
      jobPostings: [],
    }),
}));
