import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Home from "@/pages/Home";
import { useAuth } from "@/hooks/useAuth";
import { useQuestions } from "@/hooks/useQuestions";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { currentUser } = useAuth();
  const { createQuestion } = useQuestions();

  // Initialize with some demo data if no questions exist and user is logged in
  useEffect(() => {
    const initializeDemoData = () => {
      if (!currentUser) return;
      
      const existingQuestions = JSON.parse(localStorage.getItem('stackit_questions') || '[]');
      if (existingQuestions.length === 0) {
        // Create demo questions
        const demoQuestions = [
          {
            title: "How to implement useState hook in React?",
            description: "I am trying to understand the useState hook in React. Can someone explain how to properly use it with examples? I've read the documentation but I'm still confused about when to use it versus other state management solutions.",
            author: currentUser,
            tags: ['react', 'hooks', 'javascript'],
          },
          {
            title: "Best practices for RESTful API design?",
            description: "What are the current best practices for designing RESTful APIs? I want to make sure I follow the right conventions for endpoints, status codes, and response formatting.",
            author: currentUser,
            tags: ['api', 'rest', 'design'],
          },
        ];

        demoQuestions.forEach(q => createQuestion(q));
      }
    };

    initializeDemoData();
  }, [currentUser, createQuestion]);

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className="flex">
        <Sidebar selectedTags={selectedTags} onTagSelect={handleTagSelect} />
        <Home searchTerm={searchTerm} selectedTags={selectedTags} />
      </div>
    </div>
  );
};

export default Index;
