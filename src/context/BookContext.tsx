
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, BookFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Sample book data
const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000',
    isbn: '978-0465050659',
    description: 'A powerful primer on how—and why—some products satisfy customers while others only frustrate them.',
    genre: ['Design', 'Psychology'],
    publicationYear: 2013,
    publisher: 'Basic Books',
    pages: 368,
    language: 'English',
    available: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1000',
    isbn: '978-0374533557',
    description: 'A landmark work that offers a new understanding of how we think and make choices.',
    genre: ['Psychology', 'Economics'],
    publicationYear: 2011,
    publisher: 'Farrar, Straus and Giroux',
    pages: 499,
    language: 'English',
    available: true,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20'),
  },
  {
    id: '3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
    isbn: '978-0132350884',
    description: 'A handbook of agile software craftsmanship that helps you create more robust, manageable code.',
    genre: ['Programming', 'Computer Science'],
    publicationYear: 2008,
    publisher: 'Prentice Hall',
    pages: 464,
    language: 'English',
    available: false,
    borrowedBy: '2',
    borrowedUntil: new Date('2023-12-25'),
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10'),
  },
  {
    id: '4',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    cover: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1000',
    isbn: '978-0062316097',
    description: 'A provocative exploration of the development of human societies.',
    genre: ['History', 'Anthropology'],
    publicationYear: 2015,
    publisher: 'Harper',
    pages: 443,
    language: 'English',
    available: true,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?auto=format&fit=crop&q=80&w=1000',
    isbn: '978-0735211292',
    description: 'A guide to building good habits and breaking bad ones using proven strategies.',
    genre: ['Self-Help', 'Psychology'],
    publicationYear: 2018,
    publisher: 'Avery',
    pages: 320,
    language: 'English',
    available: true,
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01'),
  },
  {
    id: '6',
    title: 'Dune',
    author: 'Frank Herbert',
    cover: 'https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?auto=format&fit=crop&q=80&w=1000',
    isbn: '978-0441172719',
    description: 'A science fiction masterpiece set in a distant future amidst a feudal interstellar society.',
    genre: ['Science Fiction', 'Fantasy'],
    publicationYear: 1965,
    publisher: 'Ace Books',
    pages: 412,
    language: 'English',
    available: true,
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15'),
  },
];

interface BookContextType {
  books: Book[];
  loading: boolean;
  getBook: (id: string) => Book | undefined;
  addBook: (bookData: BookFormData) => Promise<Book>;
  updateBook: (id: string, bookData: Partial<BookFormData>) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  borrowBook: (id: string) => Promise<void>;
  returnBook: (id: string) => Promise<void>;
  getUserBorrowedBooks: () => Book[];
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load initial books
  useEffect(() => {
    const loadBooks = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Check if we have stored books in localStorage
        const storedBooks = localStorage.getItem('books');
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        } else {
          // Use mock data if no stored books exist
          setBooks(MOCK_BOOKS);
          localStorage.setItem('books', JSON.stringify(MOCK_BOOKS));
        }
      } catch (error) {
        console.error('Failed to load books', error);
        toast({
          title: 'Error',
          description: 'Failed to load books',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [toast]);

  // Save books to localStorage whenever they change
  useEffect(() => {
    if (books.length > 0 && !loading) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, [books, loading]);

  // Get a single book by ID
  const getBook = (id: string) => {
    return books.find(book => book.id === id);
  };

  // Add a new book
  const addBook = async (bookData: BookFormData): Promise<Book> => {
    setLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newBook: Book = {
        ...bookData,
        id: `${books.length + 1}`,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setBooks(prevBooks => [...prevBooks, newBook]);
      
      toast({
        title: 'Book added',
        description: `"${newBook.title}" has been added to the catalog`,
      });
      
      return newBook;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add book',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing book
  const updateBook = async (id: string, bookData: Partial<BookFormData>): Promise<Book> => {
    setLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedBooks = books.map(book => {
        if (book.id === id) {
          return {
            ...book,
            ...bookData,
            updatedAt: new Date(),
          };
        }
        return book;
      });
      
      setBooks(updatedBooks);
      
      const updatedBook = updatedBooks.find(book => book.id === id);
      if (!updatedBook) {
        throw new Error('Book not found');
      }
      
      toast({
        title: 'Book updated',
        description: `"${updatedBook.title}" has been updated`,
      });
      
      return updatedBook;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update book',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a book
  const deleteBook = async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const bookToDelete = books.find(book => book.id === id);
      if (!bookToDelete) {
        throw new Error('Book not found');
      }
      
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      
      toast({
        title: 'Book deleted',
        description: `"${bookToDelete.title}" has been removed from the catalog`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Borrow a book
  const borrowBook = async (id: string): Promise<void> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to borrow books',
        variant: 'destructive',
      });
      throw new Error('Authentication required');
    }
    
    setLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const bookToBorrow = books.find(book => book.id === id);
      if (!bookToBorrow) {
        throw new Error('Book not found');
      }
      
      if (!bookToBorrow.available) {
        throw new Error('Book is not available for borrowing');
      }
      
      // Set due date to 14 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      const updatedBooks = books.map(book => {
        if (book.id === id) {
          return {
            ...book,
            available: false,
            borrowedBy: user.id,
            borrowedUntil: dueDate,
            updatedAt: new Date(),
          };
        }
        return book;
      });
      
      setBooks(updatedBooks);
      
      toast({
        title: 'Book borrowed',
        description: `You have borrowed "${bookToBorrow.title}" until ${dueDate.toLocaleDateString()}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to borrow book',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Return a book
  const returnBook = async (id: string): Promise<void> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to return books',
        variant: 'destructive',
      });
      throw new Error('Authentication required');
    }
    
    setLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const bookToReturn = books.find(book => book.id === id);
      if (!bookToReturn) {
        throw new Error('Book not found');
      }
      
      if (bookToReturn.available) {
        throw new Error('This book is not currently borrowed');
      }
      
      if (bookToReturn.borrowedBy !== user.id && user.role !== 'admin') {
        throw new Error('You can only return books that you have borrowed');
      }
      
      const updatedBooks = books.map(book => {
        if (book.id === id) {
          return {
            ...book,
            available: true,
            borrowedBy: undefined,
            borrowedUntil: undefined,
            updatedAt: new Date(),
          };
        }
        return book;
      });
      
      setBooks(updatedBooks);
      
      toast({
        title: 'Book returned',
        description: `You have returned "${bookToReturn.title}"`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to return book',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all books borrowed by the current user
  const getUserBorrowedBooks = () => {
    if (!user) return [];
    return books.filter(book => book.borrowedBy === user.id);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        getBook,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
        getUserBorrowedBooks,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export default BookContext;
