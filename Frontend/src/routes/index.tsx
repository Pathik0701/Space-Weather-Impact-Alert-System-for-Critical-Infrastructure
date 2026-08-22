import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import AIAssistant from '../pages/AIAssistant';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
    </Routes>
  );
};

export default AppRoutes;
