import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuestions } from '@/hooks/useQuestions';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuestionFormProps {
  onClose: () => void;
  onSubmit?: () => void;
}

export default function QuestionForm({ onClose, onSubmit }: QuestionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createQuestion } = useQuestions();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to ask a question.",
        variant: "destructive",
      });
      return;
    }

    // Remove HTML tags for validation
    const plainTitle = title.replace(/<[^>]+>/g, '').trim();
    const plainDescription = description.replace(/<[^>]+>/g, '').trim();

    if (!plainTitle || !plainDescription) {
      toast({
        title: "Missing information",
        description: "Please provide both title and description.",
        variant: "destructive",
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Tags required",
        description: "Please add at least one tag to your question.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      createQuestion({
        title: plainTitle,
        description: plainDescription,
        author: currentUser,
        tags,
      });

      toast({
        title: "Question posted!",
        description: "Your question has been successfully posted.",
      });

      onSubmit?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded shadow-lg">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Ask a Question</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <ReactQuill
                id="title"
                value={title}
                onChange={setTitle}
                placeholder="Be specific and imagine you're asking a question to another person"
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'header': [1, 2, 3, false] }],
                    ['blockquote', 'code-block'],
                    ['link'],
                    ['clean']
                  ]
                }}
                className="bg-white border rounded"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {title.replace(/<[^>]+>/g, '').length}/100 characters
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description *
              </label>
              <ReactQuill
                id="description"
                value={description}
                onChange={setDescription}
                placeholder="Provide all the details someone would need to answer your question..."
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'header': [1, 2, 3, false] }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                className="bg-white border rounded min-h-[150px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag (e.g., react, javascript)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="border rounded px-2 py-1"
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post Question'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}