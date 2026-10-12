import React, { useState } from 'react';

const AdminPanel = ({ adminUsers, historyList, toggleUserStatus, deleteUser, restoreUser, hardDeleteUser }) => {
  // Tabs: 'list' (Người dùng), 'trash' (Thùng rác), 'logs' (Nhật ký)
  const [activeTab, setActiveTab] = useState('list');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // 1. Lọc Nhật ký hệ thống từ historyList
  const systemLogs = (historyList || []).filter(item => 
    item.filename === "Nhật ký Hệ thống (Admin Log)" || (item.metrics && item.metrics.type === "admin_log")
  );

  // 2. Tính toán thống kê
  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter(u => u.status === 'active').length;
  const inactiveUsers = adminUsers.filter(u => u.status === 'inactive').length;
  const deletedUsers = adminUsers.filter(u => u.status === 'deleted').length;

  // 3. Logic Lọc danh sách người dùng
  const currentList = adminUsers.filter(u => 
    activeTab === 'trash' ? u.status === 'deleted' : u.status !== 'deleted'
  );

  const filteredUsers = currentList.filter((user) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = user.username.toLowerCase().includes(term);
    const matchRole = filterRole === 'all' || user.role === filterRole;
    let matchStatus = true;
    if (activeTab === 'list') {
      matchStatus = filterStatus === 'all' || (filterStatus === user.status);
    }
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 animate-fade-in-up pb-12">
      <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-3 text-gray-800 mb-6">Quản trị Hệ thống</h2>

      {/* THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">👤</div>
          <div><p className="text-xs text-gray-500 font-bold uppercase">Users</p><p className="text-xl font-bold">{totalUsers}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✅</div>
          <div><p className="text-xs text-gray-500 font-bold uppercase">Active</p><p className="text-xl font-bold">{activeUsers}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xl">🗑️</div>
          <div><p className="text-xs text-gray-500 font-bold uppercase">Trash</p><p className="text-xl font-bold">{deletedUsers}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">📝</div>
          <div><p className="text-xs text-gray-500 font-bold uppercase">Logs</p><p className="text-xl font-bold">{systemLogs.length}</p></div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-gray-200 mb-6 gap-4">
        <button onClick={() => setActiveTab('list')} className={`pb-4 px-4 font-bold text-sm transition-all relative ${activeTab === 'list' ? 'text-blue-600' : 'text-gray-400'}`}>
          Danh sách tài khoản {activeTab === 'list' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></span>}
        </button>
        <button onClick={() => setActiveTab('trash')} className={`pb-4 px-4 font-bold text-sm transition-all relative ${activeTab === 'trash' ? 'text-rose-600' : 'text-gray-400'}`}>
          Thùng rác ({deletedUsers}) {activeTab === 'trash' && <span className="absolute bottom-0 left-0 w-full h-1 bg-rose-600 rounded-full"></span>}
        </button>
        <button onClick={() => setActiveTab('logs')} className={`pb-4 px-4 font-bold text-sm transition-all relative ${activeTab === 'logs' ? 'text-indigo-600' : 'text-gray-400'}`}>
          Nhật ký hệ thống {activeTab === 'logs' && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full"></span>}
        </button>
      </div>

      {/* NỘI DUNG TỪNG TAB */}
      {activeTab === 'logs' ? (
        /* GIAO DIỆN TAB NHẬT KÝ */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-indigo-50 border-b border-indigo-100">
            <h3 className="text-indigo-800 font-bold text-sm">Lịch sử thao tác của Admin</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nội dung thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {systemLogs.length > 0 ? systemLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-mono">
                    {log.created_at ? new Date(log.created_at).toLocaleString('vi-VN') : '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-indigo-600 text-sm">@{log.username}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {log.ai_analysis}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="py-10 text-center text-gray-400 italic">Chưa có nhật ký hoạt động nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* GIAO DIỆN TAB DANH SÁCH & THÙNG RÁC (Giữ nguyên logic cũ của bạn) */
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <input type="text" placeholder="Tìm tài khoản..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-4 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-2">
               <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="p-2 border border-gray-200 rounded-xl text-sm outline-none">
                  <option value="all">Tất cả vai trò</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
               </select>
               {activeTab === 'list' && (
                 <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border border-gray-200 rounded-xl text-sm outline-none">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Bị khóa</option>
                 </select>
               )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Người dùng</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Vai trò</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.status === 'deleted' ? 'bg-gray-300' : 'bg-blue-500'}`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${user.status === 'deleted' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : user.status === 'deleted' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>
                        {user.status === 'active' ? 'Hoạt động' : user.status === 'deleted' ? 'Đã xóa' : 'Bị khóa'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <div className="flex justify-end gap-2">
                          {activeTab === 'list' ? (
                            <>
                              <button onClick={() => toggleUserStatus(user.id)} className="text-xs font-bold text-amber-600 hover:underline">{user.status === 'active' ? 'Khóa' : 'Mở'}</button>
                              <button onClick={() => deleteUser(user.id, user.username)} className="text-xs font-bold text-rose-600 hover:underline">Xóa</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => restoreUser(user.id)} className="text-xs font-bold text-emerald-600 hover:underline">Phục hồi</button>
                              <button onClick={() => hardDeleteUser(user.id, user.username)} className="text-xs font-bold text-gray-600 hover:underline">Xóa vĩnh viễn</button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;