import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './theme';
import PropertiesTable from './PropertiesTable';

function App() {
  const [data, setData] = useState<{ results: any[] } | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {data && data.results ? (
          <PropertiesTable rows={data.results} />
        ) : (
          <p>Loading data...</p>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
