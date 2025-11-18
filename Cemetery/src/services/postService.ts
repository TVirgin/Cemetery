import { db, storage } from '../firebaseConfig'; // Ensure storage is exported
import {
  collection, getDocs, query, orderBy, Timestamp,
  addDoc, updateDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Import storage functions
import { v4 as uuidv4 } from 'uuid'; // For unique file names
import { Post, PostFormData, PostFormTextData } from '../pages/home/post.types'; // Ensure PostFormTextData is what createPost expects


const POSTS_COLLECTION = 'posts';
const POST_IMAGES_PATH = 'post_images'; // Define a base path for post images

// Upload Image to Firebase Storage
export const uploadPostImage = async (file: File, userId: string): Promise<string> => {
  if (!userId) throw new Error("User ID is required to upload image.");
  if (!file) throw new Error("File is required for upload.");

  // Create a unique file name to prevent overwrites and ensure clean URLs
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${userId}_${uuidv4()}.${fileExtension}`;
  const imageRef = ref(storage, `${POST_IMAGES_PATH}/${userId}/${uniqueFileName}`);

  try {
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File available at', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage: ", error);
    throw error;
  }
};

// Optional: Function to delete an image if a post is deleted or image is replaced
export const deletePostImage = async (imageUrl: string): Promise<void> => {
    if (!imageUrl.startsWith('https://firebasestorage.googleapis.com/')) {
        console.log("Not a Firebase Storage URL, skipping delete:", imageUrl);
        return; // Not a Firebase Storage URL, or a default image
    }
    try {
        const imageRef = ref(storage, imageUrl); // Get ref from full URL
        await deleteObject(imageRef);
        console.log("Image deleted successfully:", imageUrl);
    } catch (error: any) {
        if (error.code === 'storage/object-not-found') {
            console.warn("Image not found for deletion, might have been already deleted:", imageUrl);
        } else {
            console.error("Error deleting image from Firebase Storage:", error);
            throw error; // Re-throw other errors
        }
    }
};


// READ: Get all posts (ensure it handles Timestamps correctly if Post type expects Date/string)
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    const q = query(postsCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Post;
    });
  } catch (error) { console.error("Error getting all posts: ", error); throw error; }
};

// CREATE: Add a new post - PostFormData now includes the final imageUrl
export const createPost = async (postData: PostFormData, userId: string, authorName: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData, // title, content, imageUrl
      authorId: userId,
      authorName: authorName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) { console.error("Error creating post: ", error); throw error; }
};

// UPDATE: Update an existing post - PostFormData includes the final imageUrl
export const updatePost = async (postId: string, postData: PostFormData): Promise<void> => {
  try {
    const postDocRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postDocRef, {
      ...postData, // title, content, imageUrl
      updatedAt: serverTimestamp(),
    });
  } catch (error) { console.error("Error updating post: ", error); throw error; }
};