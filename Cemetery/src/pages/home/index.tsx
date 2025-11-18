// src/pages/Home/index.tsx
import Layout from "@/components/layout";
import * as React from "react";
import { PlusCircle, Image as ImageIcon } from "lucide-react";
import { Post, PostFormTextData, User, PostFormData } from "./post.types"; // Renamed imported PostFormData
import { PostCard } from "@/components/posts/PostCard";
import { PostFormModal } from "@/components/modals/PostFormModal";
import { ReauthenticationModal } from "@/components/modals/ReauthenticationModal";
import { useUserAuth } from "@/context/userAuthContext";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import { getAllPosts, createPost, updatePost, uploadPostImage, deletePostImage } from "@/services/postService"; // Import uploadPostImage

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const { user } = useUserAuth();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(true);
  const [postsFetchError, setPostsFetchError] = React.useState<string | null>(null);

  const [isPostFormModalOpen, setIsPostFormModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);

  const [isReauthModalOpen, setIsReauthModalOpen] = React.useState(false);
  const [reauthError, setReauthError] = React.useState<string | null>(null);
  const [isActionProcessing, setIsActionProcessing] = React.useState(false); // Renamed from isReauthProcessing

  const [pendingAction, setPendingAction] = React.useState<{
    type: 'create' | 'edit';
    textData: PostFormTextData;    // Data from form's text fields (title, content, manualImageUrl)
    imageFileToUpload?: File | null; // Optional file to upload
    originalPostId?: string;        // For edits
    existingImageUrl?: string;      // For edits, to know if an old image needs deletion
  } | null>(null);

  const fetchPosts = React.useCallback(async () => {
    setIsLoadingPosts(true);
    setPostsFetchError(null);
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error: any) {
      console.error("Failed to fetch posts:", error);
      setPostsFetchError(error.message || "Could not load posts.");
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openCreatePostModal = () => {
    setEditingPost(null);
    setIsPostFormModalOpen(true);
  };

  const openEditPostModal = (post: Post) => {
    setEditingPost(post);
    setIsPostFormModalOpen(true);
  };

  const closePostFormModal = () => {
    setIsPostFormModalOpen(false);
    setEditingPost(null);
  };

  const handlePostFormSubmit = (
    textData: PostFormTextData, // { title, content, manualImageUrl }
    imageFile?: File | null
  ) => {
    setPendingAction({
      type: editingPost ? 'edit' : 'create',
      textData,
      imageFileToUpload: imageFile,
      originalPostId: editingPost?.id,
      existingImageUrl: editingPost?.imageUrl,
    });
    setIsReauthModalOpen(true);
    setReauthError(null);
    closePostFormModal();
  };

  const executePostAction = async () => {
    if (!pendingAction || !user) {
        setPostsFetchError("Action cannot be completed: missing data or user not authenticated.");
        setPendingAction(null);
        return;
    }

    setIsActionProcessing(true); // Start processing the entire action (upload + save)
    const { type, textData, imageFileToUpload, originalPostId, existingImageUrl } = pendingAction;
    const authorName = user.displayName || user.email || "Anonymous";
    let finalImageUrl = textData.manualImageUrl || undefined; // Use manually entered URL if provided
    let oldImageToDelete: string | undefined = undefined;

    try {
      if (imageFileToUpload) { // New image uploaded
        if (type === 'edit' && existingImageUrl) { // If editing and there was an old image
            oldImageToDelete = existingImageUrl;
        }
        console.log("Uploading image...");
        finalImageUrl = await uploadPostImage(imageFileToUpload, user.uid);
        console.log("Image uploaded, URL:", finalImageUrl);
      } else if (type === 'edit' && textData.manualImageUrl === '' && existingImageUrl) {
        // User explicitly cleared the manualImageUrl and didn't upload a new file, meaning remove image
        oldImageToDelete = existingImageUrl;
        finalImageUrl = undefined; // Or null, depending on how you want to represent no image
      } else if (type === 'edit' && !textData.manualImageUrl && !imageFileToUpload) {
        // User didn't change image fields, keep existing one
        finalImageUrl = existingImageUrl;
      }
      // If type is 'create' and no imageFile and no manualImageUrl, finalImageUrl remains undefined

      const firestoreData: PostFormData = { // Type for data sent to Firestore service
        title: textData.title,
        content: textData.content,
        imageUrl: finalImageUrl,
      };

      if (type === 'create') {
        await createPost(firestoreData, user.uid, authorName);
      } else if (type === 'edit' && originalPostId) {
        await updatePost(originalPostId, firestoreData);
      }

      // If an old image was replaced or removed, delete it from storage
      if (oldImageToDelete && oldImageToDelete !== finalImageUrl) {
          console.log("Deleting old image:", oldImageToDelete);
          await deletePostImage(oldImageToDelete).catch(err => console.warn("Failed to delete old image, might not exist:", err));
      }

      fetchPosts(); // Re-fetch posts to show the latest data
    } catch (error: any) {
      console.error(`Failed to ${type} post or upload image:`, error);
      setPostsFetchError(`Failed to ${type} post. ${error.message || ''}`);
        // If image upload succeeded but Firestore failed, consider deleting the uploaded image (rollback)
        if (imageFileToUpload && finalImageUrl && type === 'create') { // Only for create, edit might have just failed to update text
            console.warn("Create post failed after image upload. Deleting orphaned image:", finalImageUrl);
            await deletePostImage(finalImageUrl).catch(err => console.error("Failed to delete orphaned image:", err));
        }
    } finally {
      setPendingAction(null);
      setIsActionProcessing(false);
    }
  };

  const handleReauthConfirm = async (email: string, password: string) => {
    if (!user) {
      setReauthError("User not available. Please sign in again.");
      return;
    }
    setIsActionProcessing(true); // Use isActionProcessing for the whole flow
    setReauthError(null);
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      console.log("Re-authentication successful for post action.");
      setIsReauthModalOpen(false);
      await executePostAction(); // Now this will handle image upload and then Firestore
    } catch (error: any) {
      console.error("Re-authentication failed:", error);
      setReauthError(error.message || "Failed to re-authenticate. Check credentials.");
      setIsActionProcessing(false); // Stop processing if re-auth fails
      setPendingAction(null); // Clear pending action as re-auth failed
    }
    // 'finally' for setIsActionProcessing is in executePostAction
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* ... Header and Create Post Button ... */}
         <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Posts</h1>
          {user && (
            <button
              onClick={openCreatePostModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center text-sm sm:text-base"
            >
              <PlusCircle size={20} className="mr-2" /> Create Post
            </button>
          )}
        </div>


        {/* ... Loading, Error, No Posts, PostCard mapping (same as before) ... */}
        {isLoadingPosts ? (
          <div className="text-center py-12"> <p className="text-xl text-gray-500">Loading posts...</p> </div>
        ) : postsFetchError ? (
          <div className="text-center py-12 p-4 bg-red-50 text-red-700 rounded-lg">
            <p className="text-xl font-semibold">Could not load posts</p>
            <p className="mt-1">{postsFetchError}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={60} className="mx-auto mb-6 text-gray-400" />
            <p className="text-xl text-gray-500">No posts yet.</p>
            {user && <p className="text-gray-500 mt-2">Be the first to share something!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {posts.map(post => (
              <PostCard key={post.id} post={post} currentUser={user} onEdit={openEditPostModal} />
            ))}
          </div>
        )}
      </div>

      <PostFormModal
        isOpen={isPostFormModalOpen}
        onClose={closePostFormModal}
        onSubmit={handlePostFormSubmit}
        initialPostData={editingPost} // Pass the whole Post object or map to {title, content, imageUrl}
        isSaving={isActionProcessing} // Use the overall action processing state
      />

      <ReauthenticationModal
        isOpen={isReauthModalOpen}
        onClose={() => { setIsReauthModalOpen(false); setPendingAction(null); setIsActionProcessing(false); }}
        onConfirm={handleReauthConfirm}
        actionName={pendingAction?.type === 'create' ? 'create this post' : 'save these changes'}
        isProcessing={isActionProcessing} // Use the overall action processing state
        error={reauthError}
        defaultEmail={user?.email || ''}
      />
    </Layout>
  );
};

export default Home;