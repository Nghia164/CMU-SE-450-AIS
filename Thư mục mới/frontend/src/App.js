import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Import Components
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AdminPanel from './components/AdminPanel';
import History from './components/History';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import ChatBot from './components/ChatBot';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const getSafeStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    if (!stored || stored === 'null' || stored === 'undefined') return defaultValue;
    return stored;
  };

  const [currentUser, setCurrentUser] = useState(() => getSafeStorage('currentUser', null));
  const [userRole, setUserRole] = useState(() => getSafeStorage('userRole', 'guest')); 
  const [currentView, setCurrentView] = useState(() => getSafeStorage('currentView', 'home')); 

  const [adminUsers, setAdminUsers] = useState([]);
  const [historyList, setHistoryList] = useState([]); 

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentView) {
      localStorage.setItem('currentView', currentView);
    }
  }, [currentView]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/users`);
      setAdminUsers(res.data.users || []);
    } catch (error) { 
      console.error("Lỗi lấy danh sách user:", error); 
    }
  };

  const fetchHistory = async () => {
    if (!currentUser || currentUser === 'null') return;
    try {
      const res = await axios.get(`${API_BASE_URL}/history/${currentUser}`);
      
      // 🚀 BƯỚC LỌC DỮ LIỆU (CHỐNG SẬP MÀN HÌNH TRẮNG):
      // Xóa bỏ các Object bị kẹt trong Database cũ để History.js không bị crash
      const safeHistory = (res.data.history || []).map(item => {
        let safeMetrics = { ...item.metrics };
        for (let key in safeMetrics) {
          if (typeof safeMetrics[key] === 'object' && safeMetrics[key] !== null) {
            safeMetrics[key] = safeMetrics[key].total || "Dữ liệu cũ (Ẩn)"; 
          }
        }
        return { ...item, metrics: safeMetrics };
      });

      setHistoryList(safeHistory);
    } catch (error) { 
      console.error("Lỗi lấy lịch sử:", error); 
    }
  };

  useEffect(() => {
    if (currentView === 'admin' && userRole === 'admin') fetchUsers();
    if (currentView === 'history') fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, userRole, currentUser]);

  const saveToHistory = async () => {
    if (!result) return;
    try {
      await axios.post(`${API_BASE_URL}/history`, {
        username: currentUser,
        filename: result.filename,
        ai_analysis: result.ai_analysis,
        metrics: result.metrics
      });
      alert("✅ Đã lưu kết quả vào Lịch sử dự án!");
      fetchHistory(); 
    } catch (error) { 
      alert("❌ Lỗi khi lưu dự án! Vui lòng kiểm tra Backend."); 
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${userId}/toggle-status`);
      fetchUsers(); 
    } catch (error) { alert("Lỗi đổi trạng thái. Hãy kiểm tra server."); }
  };

  const deleteUser = async (userId, uname) => {
    if (!window.confirm(`Đưa tài khoản "${uname}" vào thùng rác?`)) return;
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${userId}/soft-delete`);
      fetchUsers(); 
    } catch (error) { alert("Lỗi khi đưa vào thùng rác."); }
  };

  const restoreUser = async (userId) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${userId}/restore`);
      fetchUsers();
      alert("✅ Đã phục hồi tài khoản!");
    } catch (error) { alert("Lỗi khi phục hồi."); }
  };

  const hardDeleteUser = async (userId, uname) => {
    if (!window.confirm(`CẢNH BÁO: XÓA VĨNH VIỄN tài khoản "${uname}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
      fetchUsers();
      alert(`Đã xóa vĩnh viễn tài khoản ${uname}.`);
    } catch (error) { alert("Lỗi khi xóa vĩnh viễn."); }
  };

  const handleUpload = async (manualData, histFile) => {
    const hasManualData = manualData && (manualData.fp || manualData.loc || manualData.ucp || manualData.reqs);
    if (!file && !hasManualData) return alert("Vui lòng tải File HOẶC nhập số liệu bằng tay!");
    
    setLoading(true);
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (histFile) formData.append('hist_file', histFile);
    if (manualData) formData.append('manual_data', JSON.stringify(manualData));

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-and-estimate`, formData);
      if (response.data.error) {
        alert("⚠️ Lỗi từ hệ thống: " + response.data.error); 
        resetToHome();
      } else {
        setResult(response.data);
      }
    } catch (error) { 
      alert("❌ Lỗi kết nối Backend. Hãy đảm bảo Server đang chạy."); 
      resetToHome(); 
    }
    setLoading(false);
  };

  const handleLoginSuccess = (username, role) => {
    const initialView = role === 'admin' ? 'admin' : 'home';
    setCurrentUser(username);
    setUserRole(role);
    setCurrentView(initialView);
    localStorage.setItem('currentUser', username);
    localStorage.setItem('userRole', role);
    localStorage.setItem('currentView', initialView);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('guest');
    setCurrentView('home');
    resetToHome();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentView');
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

  // --- HÀM MỚI: GHI LOG LỊCH SỬ HOẠT ĐỘNG ADMIN ---
  const logAdminAction = async (actionDesc) => {
    try {
      await axios.post(`${API_BASE_URL}/history`, {
        username: currentUser, // Tên admin đang thao tác
        filename: "Nhật ký Hệ thống (Admin Log)",
        ai_analysis: `Chi tiết: ${actionDesc}`,
        metrics: { note: "admin_action" } // Data rỗng để không bị lỗi biểu đồ
      });
      fetchHistory(); // Cập nhật lại list lịch sử ngay lập tức
    } catch (error) {
      console.error("Lỗi khi ghi log admin:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-gray-800">
      {currentView !== 'login' && (
        <Sidebar 
          currentUser={currentUser} userRole={userRole} 
          currentView={currentView} setCurrentView={setCurrentView} 
          resetToHome={resetToHome} handleLogout={handleLogout} 
        />
      )}

      <main className={`flex-1 ${currentView !== 'login' ? 'ml-64 p-8' : ''} w-full transition-all duration-300`}>
        {currentView === 'login' && <Login onLoginSuccess={handleLoginSuccess} onClose={() => setCurrentView('home')} />}

        {currentView === 'home' && (
          <Dashboard 
            currentUser={currentUser} result={result} loading={loading} 
            fileInputRef={fileInputRef} handleFileChange={(e) => setFile(e.target.files[0])} 
            handleUpload={handleUpload} resetToHome={resetToHome} 
            saveToHistory={saveToHistory} setCurrentView={setCurrentView}
          />
        )}
        
        {currentView === 'history' && <History historyList={historyList} viewHistoryDetail={viewHistoryDetail} />}
        {currentView === 'profile' && <UserProfile currentUser={currentUser} userRole={userRole} />}
        {currentView === 'chatbot' && <ChatBot />}
        
        {currentView === 'admin' && userRole === 'admin' && (
          <AdminPanel 
            adminUsers={adminUsers} toggleUserStatus={toggleUserStatus} 
            deleteUser={deleteUser} restoreUser={restoreUser} hardDeleteUser={hardDeleteUser}
          />
        )}
      </main>
    </div>
  );
}

export default App;