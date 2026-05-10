import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock DOMMatrix for pdfjs-dist in JSDOM
if (typeof global.DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}

// Mock Supabase
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })),
  })),
}));

// Mock PDF and Docx parsers
vi.mock("pdfjs-dist", () => ({
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: vi.fn(() => Promise.resolve({
        getTextContent: vi.fn(() => Promise.resolve({ items: [] })),
      })),
    }),
  })),
  GlobalWorkerOptions: { workerSrc: "" },
  version: "1.0.0",
}));

vi.mock("mammoth", () => ({
  convertToHtml: vi.fn(),
}));

// Mock environment variables
vi.stubEnv("VITE_SUPABASE_URL", "https://mock.supabase.co");
vi.stubEnv("VITE_SUPABASE_ANON_KEY", "mock-key");
vi.stubEnv("VITE_GEMINI_API_KEY", "mock-gemini-key");
