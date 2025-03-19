
import React, { useState, useEffect, useMemo } from 'react';
import { useBooks } from '@/context/BookContext';
import { BookCard } from '@/components/ui/book-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, X } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { useDebounce } from '@/hooks/use-debounce';
import { Book } from '@/types';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

const SearchPage: React.FC = () => {
  const { books, loading } = useBooks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Get all unique genres
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    books.forEach(book => {
      book.genre.forEach(genre => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }, [books]);
  
  // Filter books based on search query and genre
  const filteredBooks = useMemo(() => {
    let results = books;
    
    // Apply search filter if query exists
    if (debouncedSearchQuery) {
      results = results.filter(book => 
        book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.genre.some(genre => 
          genre.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      );
    }
    
    // Apply genre filter if a specific genre is selected
    if (selectedGenre !== 'all') {
      results = results.filter(book => 
        book.genre.includes(selectedGenre)
      );
    }
    
    return results;
  }, [books, debouncedSearchQuery, selectedGenre]);
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
  };
  
  // Auto focus the search input on mount
  useEffect(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h1 
            className="font-display text-3xl font-semibold mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Search Books
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Find books by title, author, genre, or description
          </motion.p>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-input"
              className="pl-10 pr-10 h-12 text-lg bg-background"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </motion.div>
        </div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="w-full sm:w-auto">
            <Select 
              value={selectedGenre} 
              onValueChange={setSelectedGenre}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Genres</SelectLabel>
                  <SelectItem value="all">All Genres</SelectItem>
                  {allGenres.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            {(debouncedSearchQuery || selectedGenre !== 'all') && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetFilters}
              >
                Reset filters
              </Button>
            )}
            
            <Badge variant="outline" className="px-3 py-1">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  {filteredBooks.length} 
                  {filteredBooks.length === 1 ? ' book' : ' books'} found
                </>
              )}
            </Badge>
          </div>
        </motion.div>
        
        {!loading && filteredBooks.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-16 text-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-muted rounded-full p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No books found</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              We couldn't find any books matching your search criteria. 
              Try adjusting your filters or search term.
            </p>
            <Button onClick={handleResetFilters}>Clear search</Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              // Skeleton loaders
              Array.from({ length: 10 }).map((_, index) => (
                <div 
                  key={index} 
                  className="rounded-xl aspect-[3/4] bg-muted animate-pulse-slow"
                />
              ))
            ) : (
              filteredBooks.map((book, index) => (
                <motion.div key={book.id} variants={itemVariants}>
                  <BookCard book={book} index={index} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default SearchPage;
