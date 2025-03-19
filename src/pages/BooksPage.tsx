
import React, { useState, useEffect, useMemo } from 'react';
import { useBooks } from '@/context/BookContext';
import { BookCard } from '@/components/ui/book-card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Search, X, Filter } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { Book } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { motion, AnimatePresence } from 'framer-motion';

const BooksPage: React.FC = () => {
  const { books, loading } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('title');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Extract all unique genres from books
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    books.forEach(book => {
      book.genre.forEach(genre => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }, [books]);

  // Filter and sort books based on current filters
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        // Search query filter
        const matchesSearch = !debouncedSearchQuery || 
          book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          book.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        
        // Genre filter
        const matchesGenre = selectedGenres.length === 0 || 
          selectedGenres.some(genre => book.genre.includes(genre));
        
        // Availability filter
        const matchesAvailability = !availableOnly || book.available;
        
        return matchesSearch && matchesGenre && matchesAvailability;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'author':
            return a.author.localeCompare(b.author);
          case 'newest':
            return new Date(b.publicationYear || 0).getTime() - new Date(a.publicationYear || 0).getTime();
          case 'oldest':
            return new Date(a.publicationYear || 0).getTime() - new Date(b.publicationYear || 0).getTime();
          default:
            return 0;
        }
      });
  }, [books, debouncedSearchQuery, selectedGenres, availableOnly, sortBy]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setAvailableOnly(false);
    setSortBy('title');
  };

  // Toggle a genre in the selected genres
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  // Remove a genre from the selected genres
  const removeGenre = (genre: string) => {
    setSelectedGenres(prev => prev.filter(g => g !== genre));
  };

  // Animation variants for the filter section
  const filterVariants = {
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    open: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h1 className="font-display text-3xl font-semibold">Book Catalog</h1>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <Badge variant="secondary" className="ml-1">
              {(selectedGenres.length > 0 ? 1 : 0) + (availableOnly ? 1 : 0)}
            </Badge>
          </Button>
        </div>
        
        {/* Search bar always visible */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 pr-10"
            placeholder="Search by title, author or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Filter and sort options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={filterVariants}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                      <SelectItem value="author">Author (A-Z)</SelectItem>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Genres</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span>Select genres</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-[300px] overflow-auto">
                      {allGenres.map(genre => (
                        <DropdownMenuCheckboxItem
                          key={genre}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={() => toggleGenre(genre)}
                        >
                          {genre}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
                  <Button
                    variant={availableOnly ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setAvailableOnly(!availableOnly)}
                  >
                    {availableOnly ? "Available books only" : "All books"}
                  </Button>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="w-full"
                  >
                    Reset filters
                  </Button>
                </div>
              </div>
              
              {/* Selected filters display */}
              {selectedGenres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedGenres.map(genre => (
                    <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                      {genre}
                      <Button
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
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Book grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div 
                key={index} 
                className="rounded-xl aspect-[3/4] bg-muted animate-pulse-slow"
              />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            <AnimatePresence>
              {filteredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted rounded-full p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No books found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <Button onClick={handleResetFilters}>Reset all filters</Button>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default BooksPage;
