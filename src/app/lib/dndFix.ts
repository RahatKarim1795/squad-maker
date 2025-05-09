// This is a workaround for react-beautiful-dnd to work with React 19
// Based on https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194

export const applyDndFix = () => {
  // Monkey patching React 19 to fix react-beautiful-dnd
  // This is needed because react-beautiful-dnd uses an old API that's been removed in React 19
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.React = { ...(window.React || {}), createContext: require('react').createContext };
  }
}; 