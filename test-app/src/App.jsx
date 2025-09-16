// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import ConfirmCode from './pages/ConfirmCode';
import './App.css'; // Важно: импорт CSS

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/kod-podtverzhdenia" element={<ConfirmCode />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;