
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '@/context/BookContext';
import { BookCard } from '@/components/ui/book-card';
import { Button } from '@/components/ui/button';
import { Calendar, Library } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';

const BorrowedBooksPage: React.FC = () => {
  const navigate = useNavigate();
  const { getUserBorrowedBooks, returnBook } = useBooks();
  
  const borrowedBooks = getUserBorrowedBooks();
  
  const formatDueDate = (date: Date) => {
    if (!date) return 'Unknown';
    
    const dueDate = new Date(date);
    const now = new Date();
    const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''}`;
    } else if (daysLeft === 0) {
      return 'Due today';
    } else {
      return `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
    }
  };
  
  const handleReturnBook = async (id: string) => {
    try {
      await returnBook(id);
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold">My Borrowed Books</h1>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate('/books')}
          >
            <Library className="h-4 w-4" />
            <span>Browse Catalog</span>
          </Button>
        </div>
        
        {borrowedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <motion.div 
              className="bg-muted rounded-full p-3 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </motion.div>
            <motion.h3 
              className="text-lg font-medium mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              No borrowed books
            </motion.h3>
            <motion.p 
              className="text-muted-foreground max-w-md mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              You don't have any books checked out at the moment.
              Browse our catalog to find your next great read.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button onClick={() => navigate('/books')}>Browse Books</Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {borrowedBooks.map((book, index) => (
                <motion.div 
                  key={book.id}
                  className="glass-panel p-6 flex flex-col sm:flex-row gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="sm:w-1/3">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden">
                      {book.cover ? (
                        <img 
                          src={book.cover} 
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center p-4 text-center">
                          <div className="text-lg font-medium text-primary">{book.title}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:w-2/3 flex flex-col justify-between">
                    <div>
                      <h2 className="font-medium text-xl mb-1">{book.title}</h2>
                      <p className="text-muted-foreground mb-4">{book.author}</p>
                      
                      <div className="text-sm flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {book.borrowedUntil && formatDueDate(book.borrowedUntil)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {book.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/books/${book.id}`)}
                      >
                        View details
                      </Button>
                      <Button 
                        variant="default" 
                        className="flex-1"
                        onClick={() => handleReturnBook(book.id)}
                      >
                        Return book
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default BorrowedBooksPage;
