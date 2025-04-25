<<<<<<< HEAD
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import VarianceReport from './components/VarianceReport';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import VarianceReport from './components/VarianceReport';
import Config from './pages/Config';
>>>>>>> 81130407de8e86cbad77f3d2441f4b060384ed6a

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
<<<<<<< HEAD
      <div style={{ padding: '20px' }}>
        <h1>Variance Report</h1>
        <VarianceReport />
      </div>
=======
      <Router>
        <Routes>
          <Route path="/" element={<VarianceReport />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </Router>
>>>>>>> 81130407de8e86cbad77f3d2441f4b060384ed6a
    </FluentProvider>
  );
}

export default App;
