
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '@/context/BookContext';
import { BookFormData } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft, PlusCircle } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { cn } from '@/lib/utils';

interface BookFormPageProps {
  mode: 'add' | 'edit';
}

const BookFormPage: React.FC<BookFormPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBook, addBook, updateBook, loading } = useBooks();

  const emptyFormData: BookFormData = {
    title: '',
    author: '',
    description: '',
    genre: [],
    isbn: '',
    publicationYear: new Date().getFullYear(),
    publisher: '',
    pages: undefined,
    language: 'English',
    cover: '',
  };

  const [formData, setFormData] = useState<BookFormData>(emptyFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [genreInput, setGenreInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch book data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      const book = getBook(id);
      if (book) {
        const {
          id: _id,
          available: _available,
          borrowedBy: _borrowedBy,
          borrowedUntil: _borrowedUntil,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          ...bookFormData
        } = book;
        
        setFormData(bookFormData);
      } else {
        navigate('/admin/books');
      }
    }
  }, [mode, id, getBook, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle number inputs
    if (name === 'publicationYear' || name === 'pages') {
      const numberValue = value === '' ? undefined : parseInt(value, 10);
      setFormData({
        ...formData,
        [name]: numberValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (name: keyof BookFormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const addGenre = () => {
    if (!genreInput.trim()) return;
    
    // Check if genre already exists
    if (formData.genre.includes(genreInput.trim())) {
      setGenreInput('');
      return;
    }
    
    setFormData({
      ...formData,
      genre: [...formData.genre, genreInput.trim()],
    });
    setGenreInput('');
    
    // Clear genre error
    if (errors.genre) {
      setErrors({
        ...errors,
        genre: '',
      });
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setFormData({
      ...formData,
      genre: formData.genre.filter(genre => genre !== genreToRemove),
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.genre.length === 0) {
      newErrors.genre = 'At least one genre is required';
    }
    
    if (formData.publicationYear && (formData.publicationYear < 1000 || formData.publicationYear > new Date().getFullYear())) {
      newErrors.publicationYear = 'Invalid publication year';
    }
    
    if (formData.pages && formData.pages <= 0) {
      newErrors.pages = 'Pages must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (mode === 'add') {
        await addBook(formData);
        navigate('/admin/books');
      } else if (mode === 'edit' && id) {
        await updateBook(id, formData);
        navigate(`/books/${id}`);
      }
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} book:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGenre();
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          className="-ml-3 gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <h1 className="font-display text-2xl font-semibold">
          {mode === 'add' ? 'Add New Book' : 'Edit Book'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Basic Information */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="font-medium text-lg">Basic Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={cn(errors.title && 'border-destructive')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author <span className="text-destructive">*</span></Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={cn(errors.author && 'border-destructive')}
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className={cn(errors.description && 'border-destructive')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Genres <span className="text-destructive">*</span></Label>
                <div className="flex gap-2">
                  <Input
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyDown={handleGenreKeyDown}
                    placeholder="Add a genre..."
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={addGenre}
                    size="icon"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.genre.map(genre => (
                    <Badge 
                      key={genre} 
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1.5"
                    >
                      {genre}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeGenre(genre)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                {errors.genre && (
                  <p className="text-sm text-destructive">{errors.genre}</p>
                )}
              </div>
            </div>
            
            <Separator className="md:col-span-2" />
            
            {/* Additional Information */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="font-medium text-lg">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="publicationYear">Publication Year</Label>
                  <Input
                    id="publicationYear"
                    name="publicationYear"
                    type="number"
                    value={formData.publicationYear?.toString() || ''}
                    onChange={handleChange}
                    className={cn(errors.publicationYear && 'border-destructive')}
                  />
                  {errors.publicationYear && (
                    <p className="text-sm text-destructive">{errors.publicationYear}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    name="publisher"
                    value={formData.publisher || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    name="isbn"
                    value={formData.isbn || ''}
                    onChange={handleChange}
                    placeholder="e.g. 978-3-16-148410-0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pages">Number of Pages</Label>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    value={formData.pages?.toString() || ''}
                    onChange={handleChange}
                    className={cn(errors.pages && 'border-destructive')}
                    min={1}
                  />
                  {errors.pages && (
                    <p className="text-sm text-destructive">{errors.pages}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formData.language || 'English'}
                    onValueChange={(value) => handleSelectChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Russian">Russian</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Image URL</Label>
                  <Input
                    id="cover"
                    name="cover"
                    value={formData.cover || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/cover.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL for the book cover image
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || loading}
            >
              {isSaving
                ? mode === 'add' ? 'Adding Book...' : 'Saving Changes...'
                : mode === 'add' ? 'Add Book' : 'Save Changes'
              }
            </Button>
          </div>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default BookFormPage;
