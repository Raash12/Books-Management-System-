
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '@/context/BookContext';
import { Book } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, PlusCircle, MoreHorizontal, Trash2, Edit, AlertTriangle } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { useDebounce } from '@/hooks/use-debounce';

const AdminBooksPage: React.FC = () => {
  const navigate = useNavigate();
  const { books, loading, deleteBook } = useBooks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Filter books based on search query
  const filteredBooks = React.useMemo(() => {
    if (!debouncedSearchQuery) return books;
    
    return books.filter(book => 
      book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [books, debouncedSearchQuery]);
  
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteBook(bookToDelete.id);
      setBookToDelete(null);
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <h1 className="font-display text-2xl font-semibold">Manage Books</h1>
          
          <Button 
            className="gap-2"
            onClick={() => navigate('/admin/books/new')}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New Book</span>
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search by title, author or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Separator />
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading books...</div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map(book => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {book.genre.map(genre => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{book.isbn || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={book.available ? "default" : "destructive"}>
                        {book.available ? "Available" : "Borrowed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/books/${book.id}`)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/books/edit/${book.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setBookToDelete(book)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <Search className="h-8 w-8 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-1">No books found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {debouncedSearchQuery 
                ? "Try adjusting your search to find what you're looking for"
                : "Start by adding some books to your catalog"}
            </p>
            <Button onClick={() => navigate('/admin/books/new')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog 
        open={!!bookToDelete} 
        onOpenChange={(isOpen) => {
          if (!isOpen) setBookToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Delete Book</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBook}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatedPage>
  );
};

export default AdminBooksPage;
