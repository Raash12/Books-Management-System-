
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '@/context/BookContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Bookmark,
  Languages,
  BookOpen,
  Building,
  ArrowLeft,
  Edit,
  Trash2,
  Info,
  AlertTriangle
} from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import AnimatedPage from '@/components/AnimatedPage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBook, borrowBook, returnBook, deleteBook } = useBooks();
  const { user } = useAuth();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const book = getBook(id || '');
  
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-muted rounded-full p-3 mb-4">
          <Info className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Book not found</h3>
        <p className="text-muted-foreground mb-4">
          The book you're looking for doesn't exist or has been removed
        </p>
        <Button onClick={() => navigate('/books')}>Back to Catalog</Button>
      </div>
    );
  }
  
  const isAdmin = user?.role === 'admin';
  const isCurrentUserBorrower = user && book.borrowedBy === user.id;
  
  const handleBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      await borrowBook(book.id);
    } catch (error) {
      console.error('Error borrowing book:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReturn = async () => {
    setIsLoading(true);
    try {
      await returnBook(book.id);
    } catch (error) {
      console.error('Error returning book:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBook(book.id);
      navigate('/books');
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-4 -ml-3 gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book cover */}
          <div className="md:col-span-1">
            <motion.div 
              className="glass-card aspect-[3/4] overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {book.cover ? (
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center p-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-2xl font-medium text-primary">{book.title}</div>
                    <div className="text-sm text-muted-foreground">{book.author}</div>
                  </div>
                </div>
              )}
              
              {/* Availability badge */}
              <div className="absolute top-3 right-3">
                <Badge 
                  variant={book.available ? "default" : "destructive"}
                  className="py-1 px-3 text-sm font-medium"
                >
                  {book.available ? "Available" : "Borrowed"}
                </Badge>
              </div>
            </motion.div>
            
            {/* Action buttons */}
            <div className="mt-4 space-y-3">
              {book.available ? (
                <Button 
                  className="w-full"
                  onClick={handleBorrow}
                  disabled={isLoading || !user}
                >
                  {isLoading ? "Processing..." : "Borrow Book"}
                </Button>
              ) : isCurrentUserBorrower ? (
                <Button 
                  className="w-full"
                  onClick={handleReturn}
                  disabled={isLoading}
                  variant="secondary"
                >
                  {isLoading ? "Processing..." : "Return Book"}
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  disabled
                  variant="outline"
                >
                  Currently Unavailable
                </Button>
              )}
              
              {isAdmin && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => setIsDeleting(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Book details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-display text-3xl font-semibold mb-2">{book.title}</h1>
                <p className="text-xl text-muted-foreground">{book.author}</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {book.genre.map(genre => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Separator />
              
              <div className="py-4">
                <h2 className="font-medium text-lg mb-2">About this book</h2>
                <p className="text-muted-foreground">{book.description}</p>
              </div>
              
              <Separator />
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {book.publicationYear && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center",
                    "text-primary"
                  )}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Publication Year</p>
                    <p className="text-sm text-muted-foreground">{book.publicationYear}</p>
                  </div>
                </div>
              )}
              
              {book.publisher && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center",
                    "text-primary"
                  )}>
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Publisher</p>
                    <p className="text-sm text-muted-foreground">{book.publisher}</p>
                  </div>
                </div>
              )}
              
              {book.language && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center",
                    "text-primary"
                  )}>
                    <Languages className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">{book.language}</p>
                  </div>
                </div>
              )}
              
              {book.pages && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center",
                    "text-primary"
                  )}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pages</p>
                    <p className="text-sm text-muted-foreground">{book.pages}</p>
                  </div>
                </div>
              )}
              
              {book.isbn && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center",
                    "text-primary"
                  )}>
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">ISBN</p>
                    <p className="text-sm text-muted-foreground">{book.isbn}</p>
                  </div>
                </div>
              )}
              
              {!book.available && book.borrowedUntil && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center",
                    "text-destructive"
                  )}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(book.borrowedUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Delete Book</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatedPage>
  );
};

export default BookDetailsPage;
