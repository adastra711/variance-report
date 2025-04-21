import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import VarianceReport from './components/VarianceReport';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ padding: '20px' }}>
        <h1>Variance Report</h1>
        <VarianceReport />
      </div>
    </FluentProvider>
  );
}

export default App;
