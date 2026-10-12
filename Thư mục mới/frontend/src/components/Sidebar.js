import React from 'react';

const Sidebar = ({ currentUser, userRole, currentView, setCurrentView, resetToHome, handleLogout }) => {
  // Kiểm tra chặt chẽ xem có phải khách không (tránh lỗi chữ "null")
  const isLoggedIn = currentUser && currentUser !== 'null' && currentUser !== 'undefined';

  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col fixed left-0 top-0 shadow-2xl z-50 transition-all duration-300">
      
      {/* Header / Logo */}
      <div 
        className="pt-10 pb-6 flex flex-col items-center justify-center border-b border-gray-800 cursor-pointer hover:bg-gray-800/30 transition-colors shrink-0" 
        onClick={() => {resetToHome(); setCurrentView('home');}}
      >
        <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.4)] mb-4 hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-1 border border-white/20 rounded-2xl"></div>
          <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-xl font-extrabold text-white leading-tight tracking-wide text-center">
          AI-assisted
        </h1>
        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-wide text-center">
          Testing Tool
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        
        {/* 1. Giao diện chính (Ai cũng thấy) */}
        <button 
          onClick={() => {resetToHome(); setCurrentView('home');}} 
          className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${
            currentView === 'home' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium'
          }`}
        >
          <svg className={`w-5 h-5 mr-3 transition-colors ${currentView === 'home' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
          Giao diện chính
        </button>

        {/* 2. Lịch sử dự án (ĐÃ BỎ ĐIỀU KIỆN - Ai cũng thấy, nếu là khách sẽ ra trống) */}
        <button 
          onClick={() => setCurrentView('history')} 
          className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${
            currentView === 'history' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium'
          }`}
        >
          <svg className={`w-5 h-5 mr-3 transition-colors ${currentView === 'history' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Lịch sử dự án
        </button>

        {/* 3. ChatBot (Ai cũng thấy) */}
        <button 
          onClick={() => setCurrentView('chatbot')} 
          className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${
            currentView === 'chatbot' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium'
          }`}
        >
          <svg className={`w-5 h-5 mr-3 transition-colors ${currentView === 'chatbot' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          ChatBot
        </button>

        {/* CÁC CHỨC NĂNG DÀNH CHO ADMIN */}
        {userRole === 'admin' && (
          <>
            <div className="my-2 border-t border-gray-800"></div> 
            
            <button 
              onClick={() => setCurrentView('admin')} 
              className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                currentView === 'admin' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium'
              }`}
            >
              <svg className={`w-5 h-5 mr-3 transition-colors ${currentView === 'admin' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Quản lý tài khoản 
            </button>

          </>
        )}
      </div>

      {/* USER PROFILE & LOGOUT SECTION */}
      <div className="p-4 border-t border-gray-800 bg-gray-900 shrink-0 flex flex-col gap-2">
        
        {/* NẾU CHƯA ĐĂNG NHẬP: HIỆN NÚT ĐĂNG NHẬP */}
        {!isLoggedIn ? (
          <button 
            onClick={() => setCurrentView('login')} 
            className="flex items-center justify-center py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg font-semibold w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            Đăng nhập / Đăng ký
          </button>
        ) : (
          /* NẾU ĐÃ ĐĂNG NHẬP: HIỆN THÔNG TIN TÀI KHOẢN VÀ NÚT ĐĂNG XUẤT */
          <>
            <div 
              onClick={() => setCurrentView('profile')}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                currentView === 'profile' 
                  ? 'bg-gray-800 border border-gray-700 shadow-sm' 
                  : 'hover:bg-gray-800/80 border border-transparent'
              }`}
              title="Xem thông tin và Đổi mật khẩu"
            >
              <div className="flex items-center truncate">
                <div className={`w-9 h-9 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0 shadow-inner transition-colors ${currentView === 'profile' ? 'bg-indigo-600' : 'bg-gray-700 group-hover:bg-indigo-500'}`}>
                  {currentUser?.charAt(0).toUpperCase()}
                </div>
                
                <div className="truncate">
                  <p className="text-sm font-bold text-white truncate">{currentUser}</p>
                  <p className="text-xs text-gray-400 font-medium truncate capitalize">{userRole}</p>
                </div>
              </div>

              <svg className={`w-4 h-4 text-gray-500 transition-transform ${currentView === 'profile' ? 'text-white translate-x-1' : 'group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            <button 
              onClick={handleLogout} 
              className="flex items-center p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800/50 rounded-xl transition-colors group w-full" 
            >
              <svg className="w-5 h-5 mr-3 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span className="text-sm font-semibold">Đăng xuất</span>
            </button>
          </>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;