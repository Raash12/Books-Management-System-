
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BookProvider } from "@/context/BookContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BorrowedBooksPage from "./pages/BorrowedBooksPage";
import AdminBooksPage from "./pages/AdminBooksPage";
import BookFormPage from "./pages/BookFormPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BookProvider>
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="books" element={<BooksPage />} />
                  <Route path="books/:id" element={<BookDetailsPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="borrowed" element={<BorrowedBooksPage />} />
                  <Route path="admin/books" element={<AdminBooksPage />} />
                  <Route path="admin/books/new" element={<BookFormPage mode="add" />} />
                  <Route path="admin/books/edit/:id" element={<BookFormPage mode="edit" />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </BookProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
