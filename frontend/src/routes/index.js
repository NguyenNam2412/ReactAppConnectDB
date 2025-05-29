import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../components/HomePage';
import NotFound from '../components/NotFound'

const AppRouter = () => (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/' element={<NotFound />} />
    </Routes>
);

export default AppRouter;