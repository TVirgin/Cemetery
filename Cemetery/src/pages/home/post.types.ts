import { Timestamp } from 'firebase/firestore'; // Only if you still use Timestamp directly in other types here

// Existing User type (example)
export interface User {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  role?: 'admin' | 'user';
}

// Existing Post type
export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string; // This will store the final URL from Firebase Storage
  authorId: string;
  authorName?: string;
  createdAt: string;  // Assuming ISO Date string based on previous updates
  updatedAt?: string; // Assuming ISO Date string
}

// --- ADD THIS TYPE DEFINITION ---
// Data structure for creating or updating the core content of a post
export type PostFormData = {
  title: string;
  content: string;
  imageUrl?: string; // The final URL of the image after upload or if manually entered
};
// --- END OF ADDITION ---


// This type was used to represent the raw text/URL input from the PostFormModal
// It can remain local to Home.tsx or be moved here if PostFormModal also uses it via props.
// For clarity, if PostFormModal's onSubmit passes this structure, it's good to have it defined.
export type PostFormTextData = {
  title: string;
  content: string;
  manualImageUrl?: string; // For the URL input field in the form
};