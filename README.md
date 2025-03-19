# Book Management System

## Overview

The Book Management System is a web application designed to help users manage their book collections efficiently. It allows users to register, log in, and interact with a catalog of books. Admin users have additional privileges to maintain the book catalog.


## Features

### User Management
- **User Registration and Login**: Create your account to access personalized features
- **User Profiles**: Track borrowed books and reading history
- **Role-based Access**: Different capabilities for regular users and administrators

### Book Catalog
- **Browse Books**: View a comprehensive catalog of available books
- **Book Details**: Access detailed information about each book
- **Search & Filter**: Find books by title, author, genre, or ISBN
- **Featured Books**: Discover highlighted books on the homepage

### Admin Features
- **Book Management**: Add, edit, and remove books from the catalog
- **User Management**: Manage user accounts and permissions
- **Borrowing System**: Track book availability and manage loans

### Technical Features
- **Responsive Design**: Beautiful UI that works on all devices
- **Animated Transitions**: Smooth page transitions with Framer Motion
- **Modern UI Components**: Built with shadcn/ui and Tailwind CSS

## Demo Accounts

You can use these accounts to test the application:

- **Admin Account**:
  - Email: admin@example.com
  - Password: password123

- **Regular User**:
  - Email: user@example.com
  - Password: password123

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Animations**: Framer Motion
- **State Management**: React Context API

## Project Structure

- **`/src/components`**: Reusable UI components
- **`/src/context`**: Context providers for global state
- **`/src/hooks`**: Custom React hooks
- **`/src/pages`**: Application pages
- **`/src/types`**: TypeScript type definitions

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd bibliophile-portal
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to http://localhost:5173


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Router](https://reactrouter.com/) - Routing library
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set
