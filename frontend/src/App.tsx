import { HashRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { LocationProvider } from './commons/LocationContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <LocationProvider>
        <AppRoutes />
      </LocationProvider>
    </HashRouter>
  );
};

export default App;
