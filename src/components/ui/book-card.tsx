
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Book } from '@/types';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: Book;
  className?: string;
  index?: number;
}

const MotionLink = motion(Link);

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  className,
  index = 0
}) => {
  return (
    <MotionLink
      to={`/books/${book.id}`}
      className={cn(
        "glass-card block relative aspect-[3/4] overflow-hidden group",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {book.cover ? (
        <img 
          src={book.cover} 
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
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
      
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
        {book.genre.slice(0, 2).map((genre) => (
          <Badge 
            key={genre}
            variant="secondary"
            className="backdrop-blur-md bg-background/70 font-medium"
          >
            {genre}
          </Badge>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="backdrop-blur-md bg-background/70 rounded-lg p-3 transform transition-transform duration-300 ease-out-expo translate-y-[calc(100%-0.75rem)] group-hover:translate-y-0">
          <h3 className="font-medium text-foreground line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
          <p className="mt-2 text-sm line-clamp-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300">{book.description}</p>
          <div className="mt-2 text-xs flex justify-between items-center invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-foreground">{book.publicationYear}</span>
            <Badge variant={book.available ? "default" : "destructive"}>
              {book.available ? "Available" : "Borrowed"}
            </Badge>
          </div>
        </div>
      </div>
    </MotionLink>
  );
};

export default BookCard;
