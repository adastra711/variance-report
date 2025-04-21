import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import VarianceReport from './components/VarianceReport';
import Config from './pages/Config';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<VarianceReport />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </Router>
    </FluentProvider>
  );
}

export default App;
