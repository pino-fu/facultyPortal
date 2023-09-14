import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentHome from './Components/StudentHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentHome />}  />
      </Routes>
    </Router>
  );
}

export default App;
