import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import PixelEditor from './pages/PixelEditor';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <PixelEditor />
      </Layout>
    </ThemeProvider>
  );
}


export default App;
