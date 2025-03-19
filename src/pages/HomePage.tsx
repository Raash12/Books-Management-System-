
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/ui/book-card';
import { ArrowRight, Library, Users, Search } from 'lucide-react';
import { useBooks } from '@/context/BookContext';
import { useAuth } from '@/context/AuthContext';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';

const featureCardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { books } = useBooks();
  const { user } = useAuth();
  
  // Get 3 random books for featured section
  const featuredBooks = React.useMemo(() => {
    if (books.length <= 3) return books;
    
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [books]);

  return (
    <AnimatedPage>
      {/* Hero section */}
      <section className="pb-12 pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-xl opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            <motion.h1 
              className="relative font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Bibliophile Portal
            </motion.h1>
          </div>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            A beautiful, minimalist library management system for book lovers.
            Discover, borrow, and organize your reading experience.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button size="lg" onClick={() => navigate('/books')}>
              Browse Catalog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            {!user && (
              <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Featured books section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-2xl font-semibold">Featured Books</h2>
          <Button variant="ghost" className="gap-1" onClick={() => navigate('/books')}>
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredBooks.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-12">
        <h2 className="font-display text-2xl font-semibold mb-8 text-center">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="glass-panel p-6"
            variants={featureCardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Library className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Book Management</h3>
            <p className="text-muted-foreground">
              Easily browse, search, and filter books in our extensive catalog. View detailed information about each book.
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-panel p-6"
            variants={featureCardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">User Accounts</h3>
            <p className="text-muted-foreground">
              Create your account to borrow books, track your reading history, and manage your borrowed items.
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-panel p-6"
            variants={featureCardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Advanced Search</h3>
            <p className="text-muted-foreground">
              Find exactly what you're looking for with our powerful search and filtering capabilities.
            </p>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default HomePage;
