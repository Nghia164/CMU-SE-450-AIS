import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Import Components
import Login from './components/Login';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import History from './components/History';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); 
  const [currentView, setCurrentView] = useState('home'); 

  const [adminUsers, setAdminUsers] = useState([]);
  const [historyList, setHistoryList] = useState([]); 

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load Data
  useEffect(() => {
    if (currentView === 'admin' && userRole === 'admin') fetchUsers();
    if (currentView === 'history') fetchHistory();
  }, [currentView, userRole]);

  // --- API Functions ---
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/users');
      setAdminUsers(res.data.users);
    } catch (error) { console.error("Lỗi lấy user"); }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/history/${currentUser}`);
      setHistoryList(res.data.history);
    } catch (error) { console.error("Lỗi lấy lịch sử"); }
  };

  const saveToHistory = async () => {
    if (!result) return;
    try {
      await axios.post('http://localhost:8000/api/history', {
        username: currentUser,
        filename: result.filename,
        ai_analysis: result.ai_analysis,
        metrics: result.metrics
      });
      alert("✅ Đã lưu kết quả vào Lịch sử dự án!");
    } catch (error) { alert("❌ Lỗi khi lưu dự án!"); }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/users/${userId}/toggle-status`);
      fetchUsers(); 
    } catch (error) { alert("Lỗi đổi trạng thái."); }
  };

  const deleteUser = async (userId, uname) => {
    if (!window.confirm(`XÓA VĨNH VIỄN tài khoản "${uname}"?`)) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`);
      fetchUsers(); 
    } catch (error) { alert("Lỗi xóa tài khoản."); }
  };

  const handleUpload = async () => {
    if (!file) return alert("Vui lòng chọn file!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze-and-estimate', formData);
      if (response.data.error) {
        alert("⚠️ Lỗi từ AI: " + response.data.error); resetToHome();
      } else if (!response.data.metrics || response.data.metrics.ucp === 0) {
        alert("⚠️ Tài liệu không chứa Use-case hợp lệ."); resetToHome();
      } else {
        setResult(response.data);
      }
    } catch (error) { alert("❌ Lỗi tải lên."); resetToHome(); }
    setLoading(false);
  };

  // --- Helpers ---
  const handleLoginSuccess = (username, role) => {
    setCurrentUser(username);
    setUserRole(role);
    setCurrentView(role === 'admin' ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('user');
    setCurrentView('home');
    resetToHome();
  };

  const resetToHome = () => {
    setResult(null); 
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const viewHistoryDetail = (item) => {
    setResult({ filename: item.filename, ai_analysis: item.ai_analysis, metrics: item.metrics });
    setCurrentView('home');
  };

  const downloadReport = () => {
    const reportContent = document.getElementById("report-textarea").value;
    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `BaoCao_KiemThu_${result.filename.split('.')[0] || 'DuAn'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Render ---
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-12">
      <Navbar 
        currentUser={currentUser} 
        userRole={userRole} 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        resetToHome={resetToHome} 
        handleLogout={handleLogout} 
      />

      {currentView === 'history' && (
        <History historyList={historyList} viewHistoryDetail={viewHistoryDetail} />
      )}

      {currentView === 'admin' && userRole === 'admin' && (
        <AdminPanel adminUsers={adminUsers} toggleUserStatus={toggleUserStatus} deleteUser={deleteUser} />
      )}

      {currentView === 'home' && (
        <Dashboard 
          result={result} 
          loading={loading} 
          fileInputRef={fileInputRef} 
          handleFileChange={(e) => setFile(e.target.files[0])} 
          handleUpload={handleUpload} 
          resetToHome={resetToHome} 
          saveToHistory={saveToHistory} 
          downloadReport={downloadReport} 
        />
      )}
    </div>
  );
}

export default App;