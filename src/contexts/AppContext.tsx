import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  reputation: number;
  joinedAt: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  author: User;
  tags: string[];
  votes: number;
  answers: Answer[];
  acceptedAnswerId?: string;
  createdAt: string;
  updatedAt: string;
  userVote?: 'up' | 'down' | null;
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  questionId: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
  userVote?: 'up' | 'down' | null;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  answerId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'answer' | 'comment' | 'mention' | 'vote';
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

interface AppState {
  currentUser: User | null;
  questions: Question[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'ADD_QUESTION'; payload: Question }
  | { type: 'UPDATE_QUESTION'; payload: Question }
  | { type: 'DELETE_QUESTION'; payload: string }
  | { type: 'ADD_ANSWER'; payload: { questionId: string; answer: Answer } }
  | { type: 'UPDATE_ANSWER'; payload: Answer }
  | { type: 'VOTE_QUESTION'; payload: { questionId: string; vote: 'up' | 'down' | null } }
  | { type: 'VOTE_ANSWER'; payload: { answerId: string; vote: 'up' | 'down' | null } }
  | { type: 'ACCEPT_ANSWER'; payload: { questionId: string; answerId: string } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  currentUser: null,
  questions: [],
  notifications: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    
    case 'ADD_QUESTION':
      return { ...state, questions: [action.payload, ...state.questions] };
    
    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id ? action.payload : q
        ),
      };
    
    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter(q => q.id !== action.payload),
      };
    
    case 'ADD_ANSWER':
      return {
        ...state,
        questions: state.questions.map(q =>
          q.id === action.payload.questionId
            ? { ...q, answers: [...q.answers, action.payload.answer] }
            : q
        ),
      };
    
    case 'UPDATE_ANSWER':
      return {
        ...state,
        questions: state.questions.map(q => ({
          ...q,
          answers: q.answers.map(a =>
            a.id === action.payload.id ? action.payload : a
          ),
        })),
      };
    
    case 'VOTE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q =>
          q.id === action.payload.questionId
            ? {
                ...q,
                votes: q.votes + (action.payload.vote === 'up' ? 1 : action.payload.vote === 'down' ? -1 : 0),
                userVote: action.payload.vote,
              }
            : q
        ),
      };
    
    case 'VOTE_ANSWER':
      return {
        ...state,
        questions: state.questions.map(q => ({
          ...q,
          answers: q.answers.map(a =>
            a.id === action.payload.answerId
              ? {
                  ...a,
                  votes: a.votes + (action.payload.vote === 'up' ? 1 : action.payload.vote === 'down' ? -1 : 0),
                  userVote: action.payload.vote,
                }
              : a
          ),
        })),
      };
    
    case 'ACCEPT_ANSWER':
      return {
        ...state,
        questions: state.questions.map(q =>
          q.id === action.payload.questionId
            ? { ...q, acceptedAnswerId: action.payload.answerId }
            : q
        ),
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('stackit_user');
    const savedQuestions = localStorage.getItem('stackit_questions');
    const savedNotifications = localStorage.getItem('stackit_notifications');

    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }

    if (savedQuestions) {
      dispatch({ type: 'SET_QUESTIONS', payload: JSON.parse(savedQuestions) });
    }

    if (savedNotifications) {
      state.notifications = JSON.parse(savedNotifications);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('stackit_user', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('stackit_user');
    }
  }, [state.currentUser]);

  useEffect(() => {
    localStorage.setItem('stackit_questions', JSON.stringify(state.questions));
  }, [state.questions]);

  useEffect(() => {
    localStorage.setItem('stackit_notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}