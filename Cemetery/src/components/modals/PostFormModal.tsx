import * as React from 'react';
import { PostFormTextData, Post } from '@/pages/home/post.types'; // Adjust path
import { XCircle, Save, ImageUp, Trash2 } from 'lucide-react'; // Added ImageUp, Trash2
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (textData: PostFormTextData, imageFile?: File | null) => void; // Updated signature
  initialPostData?: Post | null; // For pre-filling form, including existing imageUrl
  isSaving: boolean;
}

export const PostFormModal: React.FC<PostFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPostData,
  isSaving,
}) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [manualImageUrl, setManualImageUrl] = React.useState(''); // For the URL input
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialPostData) {
        setTitle(initialPostData.title || '');
        setContent(initialPostData.content || '');
        setManualImageUrl(initialPostData.imageUrl || ''); // Pre-fill manual URL input
        setImagePreviewUrl(initialPostData.imageUrl || null); // Show existing image
      } else {
        setTitle('');
        setContent('');
        setManualImageUrl('');
        setImagePreviewUrl(null);
      }
      setSelectedFile(null); // Always reset selected file when modal opens
      setFormError(null);
    }
  }, [initialPostData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // Example: 5MB limit
          setFormError("File is too large. Maximum size is 5MB.");
          setSelectedFile(null);
          setImagePreviewUrl(manualImageUrl || initialPostData?.imageUrl || null); // Revert preview
          e.target.value = ''; // Clear the file input
          return;
      }
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setManualImageUrl(''); // Clear manual imageUrl if a file is chosen
      setFormError(null);
    } else {
      // No file selected, revert preview to manualImageUrl or initial imageUrl if they exist
      setSelectedFile(null);
      setImagePreviewUrl(manualImageUrl || initialPostData?.imageUrl || null);
    }
  };

  const handleManualImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setManualImageUrl(newUrl);
    if (newUrl) { // If user types in URL, clear selected file and update preview
        setSelectedFile(null);
        setImagePreviewUrl(newUrl);
         // Clear the file input visually if a URL is typed
        const fileInput = document.getElementById('postImageFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    } else if (selectedFile) { // If URL is cleared but a file was selected, keep file preview
        setImagePreviewUrl(URL.createObjectURL(selectedFile));
    } else { // If URL is cleared and no file, revert to initial image or clear preview
        setImagePreviewUrl(initialPostData?.imageUrl || null);
    }
  };

  const handleRemoveImage = () => {
      setSelectedFile(null);
      setManualImageUrl('');
      setImagePreviewUrl(null);
      const fileInput = document.getElementById('postImageFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setFormError(null);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError('Title and Content are required.');
      return;
    }
    setFormError(null);
    onSubmit({ title, content, manualImageUrl }, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-60">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-lg relative transform transition-all max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} disabled={isSaving} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100" aria-label="Close modal">
          <XCircle size={24} />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">
          {initialPostData?.id ? 'Edit Post' : 'Create New Post'}
        </h2>

        {formError && ( <div className="mb-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm"><p>{formError}</p></div> )}

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1"> {/* Allow form content to scroll */}
          <div>
            <Label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</Label>
            <Input id="postTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" disabled={isSaving} required />
          </div>
          <div>
            <Label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">Content</Label>
            <textarea id="postContent" value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" disabled={isSaving} required />
          </div>
          <div>
            <Label htmlFor="postImageFile" className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</Label>
            <div className="flex items-center space-x-2">
                <Input id="postImageFile" type="file" accept="image/*" onChange={handleFileChange} className="mt-1 flex-grow" disabled={isSaving} />
                { (selectedFile || manualImageUrl || imagePreviewUrl) && // Show remove button if there's any image indication
                    <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage} disabled={isSaving} title="Remove image">
                        <Trash2 className="h-5 w-5 text-red-500"/>
                    </Button>
                }
            </div>

            {imagePreviewUrl && (
              <div className="mt-3 border rounded-md p-2 inline-block">
                <img src={imagePreviewUrl} alt="Preview" className="max-h-32 sm:max-h-40 rounded" />
              </div>
            )}
          </div>
          {/* <div>
            <Label htmlFor="postManualImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Or Image URL (Optional)</Label>
            <Input id="postManualImageUrl" type="url" value={manualImageUrl} onChange={handleManualImageUrlChange} className="w-full" placeholder="https://example.com/image.jpg" disabled={isSaving || !!selectedFile} />
            {!!selectedFile && <p className="text-xs text-gray-500 mt-1">File upload will take precedence over URL.</p>}
          </div> */}
          <div className="pt-4 flex justify-end space-x-3 border-t mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="flex items-center disabled:bg-indigo-300">
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : (initialPostData?.id ? 'Save Changes' : 'Create Post')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};