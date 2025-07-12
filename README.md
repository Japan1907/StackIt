# StackIt Answers Hub

A community-driven Q&A platform built with modern web technologies.

## Project Overview

StackIt Answers Hub is a question-and-answer platform that allows users to ask questions, provide answers, and engage with the community through voting and discussions.

## Features

- **User Authentication**: Secure login and registration system
- **Question Management**: Ask, edit, and delete questions
- **Answer System**: Provide answers with voting functionality
- **Tag System**: Categorize questions with tags
- **Voting System**: Upvote and downvote questions and answers
- **Real-time Notifications**: Stay updated with community activity
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

This project is built with:

- **Frontend**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd stack-it-answers-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── AuthModal.tsx  # Authentication modal
│   ├── Header.tsx     # Main header component
│   ├── QuestionCard.tsx # Question display component
│   ├── QuestionForm.tsx # Question creation form
│   └── Sidebar.tsx    # Navigation sidebar
├── contexts/          # React contexts
│   └── AppContext.tsx # Main application state
├── hooks/             # Custom React hooks
├── pages/             # Page components
└── lib/               # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
