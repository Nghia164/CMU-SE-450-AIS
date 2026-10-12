import React, { useState } from 'react';

const Dashboard = ({ currentUser, result, loading, fileInputRef, handleFileChange, handleUpload, resetToHome, saveToHistory, setCurrentView }) => {
  const [fp, setFp] = useState({
    ei: { count: '', det: '', ftr: '' }, eo: { count: '', det: '', ftr: '' }, eq: { count: '', det: '', ftr: '' },
    ilf: { count: '', det: '', ret: '' }, eif: { count: '', det: '', ret: '' }
  });
  const [vafString, setVafString] = useState('0'); 
  
  const [op, setOp] = useState({
    screens: { s: '', m: '', d: '' },
    reports: { s: '', m: '', d: '' },
    comp_3gl: '', reuse: '', prod: 13
  });

  const [actors, setActors] = useState([]);
  const [useCases, setUseCases] = useState([]);

  const [loc, setLoc] = useState('');
  const [numReqs, setNumReqs] = useState(''); 
  const [history, setHistory] = useState({ fp: '', loc: '', reqs: '', testcases: '', effort: '', defects: '' });
  const [histFile, setHistFile] = useState(null);

  const handleFpChange = (type, field, value) => { setFp(prev => ({ ...prev, [type]: { ...prev[type], [field]: value } })); };
  const handleOpChange = (type, field, value) => { setOp(prev => ({ ...prev, [type]: { ...prev[type], [field]: value } })); };
  
  const evaluateVAF = (expr) => {
    try {
      if (!expr) return 0;
      // eslint-disable-next-line no-new-func
      const val = new Function('"use strict";return (' + expr + ')')(); 
      return isNaN(val) ? 0 : val;
    } catch { return 0; } 
  };

  const addActor = () => setActors([...actors, { id: Date.now(), name: '', type: '3' }]);
  const removeActor = (id) => setActors(actors.filter(a => a.id !== id));
  const updateActor = (id, field, value) => setActors(actors.map(a => a.id === id ? { ...a, [field]: value } : a));

  const addUseCase = () => setUseCases([...useCases, { id: Date.now(), name: '', transactions: '' }]);
  const removeUseCase = (id) => setUseCases(useCases.filter(u => u.id !== id));
  const updateUseCase = (id, field, value) => setUseCases(useCases.map(u => u.id === id ? { ...u, [field]: value } : u));

  // Hàm format số liệu chung
  const getSafeNumber = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "Đang cập nhật...";
    if (typeof val === 'object') return val.total || "Đã lưu (Chi tiết)"; 
    return Number(val).toLocaleString('vi-VN');
  };

  // ==========================================
  // HÀM MỚI: TÍNH TOÁN LOGIC SỐ TESTER LINH ĐỘNG
  // ==========================================
  const getCalculatedTeamSize = () => {
    if (!result || !result.metrics) return "Đang cập nhật...";
    
    const effort = parseFloat(result.metrics.test_effort_person_months);
    const duration = parseFloat(result.metrics.estimated_duration_months);
    
    // Nếu có nỗ lực và thời gian > 0, tính bằng công thức: Nỗ lực / Thời gian (Làm tròn lên)
    if (!isNaN(effort) && !isNaN(duration) && duration > 0) {
      return Math.max(1, Math.ceil(effort / duration)).toLocaleString('vi-VN');
    }
    
    // Nếu không, trả về số từ backend hoặc mặc định là 1
    return result.metrics.recommended_team_size ? getSafeNumber(result.metrics.recommended_team_size) : "1";
  };

  const onStartEstimate = () => {
    let uaw = 0;
    actors.forEach(a => {
      const type = String(a.type);
      if (type === "1") uaw += 1;
      else if (type === "2") uaw += 2;
      else if (type === "3") uaw += 3;
      else uaw += 1;
    });

    let uucw = 0;
    useCases.forEach(u => {
      const trans = parseInt(u.transactions) || 0;
      if (trans <= 3) uucw += 5;
      else if (trans <= 7) uucw += 10;
      else uucw += 15;
    });

    const payload = { 
      fp, 
      vaf_sum: evaluateVAF(vafString), 
      op, 
      ucp: { actors, use_cases: useCases }, 
      ucp_total: (uaw + uucw) * evaluateVAF(vafString),
      loc: parseInt(loc) || 0, 
      requirements: parseInt(numReqs) || 0,
      history 
    };
    handleUpload(payload, histFile); 
  };

  const handleSaveHistory = async () => {
    if (!currentUser) {
      alert("Bạn cần đăng nhập để lưu dự án!");
      setCurrentView('login'); 
      return;
    }
    await saveToHistory();
    setCurrentView('history');
  };

  // ==========================================
  // CẬP NHẬT GIAO DIỆN XUẤT BÁO CÁO (REPORT)
  // ==========================================
  const generateReportTemplate = () => {
    if (!result || !result.metrics) return "";
    const m = result.metrics;

    const actorSummary = actors.length > 0 
      ? actors.map(a => `  - ${a.name || 'Tác nhân không tên'} (Loại: ${a.type === '1' ? 'Đơn giản/API' : a.type === '2' ? 'Trung bình/Giao thức' : 'Phức tạp/GUI'})`).join('\n')
      : "  - Không có dữ liệu Tác nhân";
      
    const ucSummary = useCases.length > 0
      ? useCases.map(u => `  - ${u.name || 'Use Case không tên'} (${u.transactions || 0} giao dịch)`).join('\n')
      : "  - Không có dữ liệu Use Cases";
    
    const cleanAiAnalysis = result.ai_analysis 
      ? result.ai_analysis.replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/\*/g, '-')
      : "AI đang phân tích chi tiết, vui lòng thử lại...";

    return `=======================================================
BÁO CÁO ƯỚC LƯỢNG NỖ LỰC KIỂM THỬ PHẦN MỀM (AI PREDICTION)
=======================================================
Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}
Dự án: ${result.filename || 'Nhập liệu thủ công'}

PHẦN 1: THÔNG SỐ ĐẦU VÀO VÀ ĐO LƯỜNG QUY MÔ (SIZE MEASUREMENT)
-------------------------------------------------------
1. Function Points (FP)
- External Inputs (EI)     : ${fp.ei.count || 0} (DET: ${fp.ei.det || 'Avg'}, FTR: ${fp.ei.ftr || 'Avg'})
- External Outputs (EO)    : ${fp.eo.count || 0} (DET: ${fp.eo.det || 'Avg'}, FTR: ${fp.eo.ftr || 'Avg'})
- External Inquiries (EQ)  : ${fp.eq.count || 0} (DET: ${fp.eq.det || 'Avg'}, FTR: ${fp.eq.ftr || 'Avg'})
- Internal Logic Files (ILF) : ${fp.ilf.count || 0} (DET: ${fp.ilf.det || 'Avg'}, RET: ${fp.ilf.ret || 'Avg'})
- External Interface (EIF)   : ${fp.eif.count || 0} (DET: ${fp.eif.det || 'Avg'}, RET: ${fp.eif.ret || 'Avg'})
-> Chuỗi VAF (Fj) nhập vào : ∑(Fj) = ${vafString || '0'}
=> TỔNG FP CUỐI CÙNG       : ${getSafeNumber(m.fp)}

2. Object Points (OP)
- Màn hình (Screens)       : S: ${op.screens.s || 0}, M: ${op.screens.m || 0}, D: ${op.screens.d || 0}
- Báo cáo (Reports)        : S: ${op.reports.s || 0}, M: ${op.reports.m || 0}, D: ${op.reports.d || 0}
- 3GL Component (x10)      : ${op.comp_3gl || 0}
- Tỉ lệ tái sử dụng (r)    : ${op.reuse || 0}%
- Năng suất (PROD)         : ${op.prod}
=> TỔNG OP MỚI             : ${getSafeNumber(m.op_new)}

3. Use Case Points (UCP)
Danh sách Tác nhân:
${actorSummary}
Danh sách Use Cases:
${ucSummary}
=> TỔNG UCP CUỐI CÙNG      : ${getSafeNumber(m.ucp)}

4. Các thông số dữ liệu khác
- Mốc LLOC: ${loc || 0} | Số lượng Requirements: ${numReqs || 0}


PHẦN 2: KẾT QUẢ DỰ ĐOÁN & KIẾN NGHỊ DO AI PHÂN TÍCH
-------------------------------------------------------
Dựa trên quy mô tính toán (FP, OP, UCP) cùng dữ liệu lịch sử đối chiếu, hệ thống AI đề xuất:

✔ Ước lượng Test Cases        : ${getSafeNumber(m.estimated_test_cases)} kịch bản
✔ Nỗ lực kiểm thử (Effort)    : ${getSafeNumber(m.test_effort_person_months)} tháng công (person-months)
✔ Số lượng Tester đề xuất     : ${getCalculatedTeamSize()} nhân sự chuyên trách
✔ Thời gian thực hiện         : ${getSafeNumber(m.estimated_duration_months)} tháng

-------------------------------------------------------
PHẦN 3: LÝ DO VÀ PHÂN TÍCH CHUYÊN SÂU TỪ AI (WHY?)
-------------------------------------------------------
${cleanAiAnalysis}

Lịch trình thực hiện (Testing Schedule):
-> ${m.testing_schedule || 'Lịch trình được tối ưu hóa dựa trên số lượng tester và mốc thời gian ước lượng bên trên.'}
=======================================================
`;
  };

  const exportFile = (type) => {
    const content = document.getElementById("report-textarea")?.value || "";
    const fileName = result?.filename?.split('.')[0] || "BaoCao_KiemThu";
    if (type === 'word') {
      const blob = new Blob([content], { type: "application/msword" });
      const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${fileName}.doc`; link.click();
    } else {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${fileName}.txt`; link.click();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        {!result ? (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Hệ thống  AI-assisted Test Effort Estimation Tool</h1>
              <p className="text-gray-500">Nhập các thông số chi tiết để hệ thống tính toán FP, OP, UCP.</p>
            </div>

            <div className="bg-indigo-50/50 p-6 rounded-2xl border-2 border-dashed border-indigo-200 mb-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
              <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center"><span className="text-xl mr-2">📄</span> 1. Tải tài liệu dự án</h3>
                  <p className="text-xs text-gray-500 mb-3">Hỗ trợ: .xlsx, .csv, .pdf, .docx, .txt</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"/>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-indigo-200 md:pl-6 pt-4 md:pt-0">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center"><span className="text-xl mr-2">📊</span> 2. Tải File Lịch sử (Tùy chọn)</h3>
                  <p className="text-xs text-gray-500 mb-3">Hỗ trợ: .txt, .csv, .xlsx</p>
                  <input type="file" onChange={(e) => setHistFile(e.target.files[0])} accept=".txt,.csv,.xlsx" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"/>
                  {histFile && <span className="text-xs text-green-600 mt-2 block font-medium">✔ Đã chọn: {histFile.name}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* CỘT 1: FP & OP */}
              <div className="space-y-6">
                {/* FUNCTION POINTS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-colors">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-blue-700">1. UFC (Unadjusted Function Point)</h3>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold">Mẹo: Bỏ trống DET, FTR hệ thống lấy Average</span>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 text-[11px] font-bold text-gray-500 text-center mb-2 uppercase">
                      <div className="text-left">Loại</div><div>Số lượng (N)</div><div>DET</div><div>FTR / RET</div>
                    </div>
                    {['ei', 'eo', 'eq'].map(type => (
                      <div key={type} className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-sm font-bold uppercase text-gray-700">{type}</span>
                        <input type="number" value={fp[type].count} onChange={e => handleFpChange(type, 'count', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="N"/>
                        <input type="number" value={fp[type].det} onChange={e => handleFpChange(type, 'det', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Trống=Avg"/>
                        <input type="number" value={fp[type].ftr} onChange={e => handleFpChange(type, 'ftr', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Trống=Avg"/>
                      </div>
                    ))}
                    {['ilf', 'eif'].map(type => (
                      <div key={type} className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-sm font-bold uppercase text-gray-700">{type}</span>
                        <input type="number" value={fp[type].count} onChange={e => handleFpChange(type, 'count', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="N"/>
                        <input type="number" value={fp[type].det} onChange={e => handleFpChange(type, 'det', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Trống=Avg"/>
                        <input type="number" value={fp[type].ret} onChange={e => handleFpChange(type, 'ret', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Trống=Avg"/>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-xs font-bold text-gray-500 block mb-1">Công thức: VAF = 0.65 + 0.01 × ∑(Fj)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">∑(Fj) =</span>
                      <input type="text" value={vafString} onChange={e => setVafString(e.target.value)} className="flex-1 border bg-white text-gray-900 rounded p-2 text-sm font-mono focus:ring-2 focus:ring-blue-400 outline-none" placeholder="VD: 4*2 + 2*3" />
                      <span className="text-xs text-green-600 font-bold whitespace-nowrap bg-green-50 px-2 py-1 rounded">=> {evaluateVAF(vafString)}</span>
                    </div>
                  </div>
                </div>

                {/* OBJECT POINTS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-colors">
                  <h3 className="font-bold text-teal-700 mb-4 border-b pb-2">2. Object Points (OP)</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-gray-500 text-center mb-2 uppercase">
                      <div className="text-left">Loại</div><div>Simple</div><div>Medium</div><div>Difficult</div>
                    </div>
                    {['screens', 'reports'].map(type => (
                      <div key={type} className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-sm font-bold capitalize text-gray-700">{type}</span>
                        <input type="number" value={op[type].s} onChange={e => handleOpChange(type, 's', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-teal-400 outline-none" placeholder="0"/>
                        <input type="number" value={op[type].m} onChange={e => handleOpChange(type, 'm', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-teal-400 outline-none" placeholder="0"/>
                        <input type="number" value={op[type].d} onChange={e => handleOpChange(type, 'd', e.target.value)} className="border bg-white text-gray-900 rounded p-1.5 text-center text-sm focus:ring-2 focus:ring-teal-400 outline-none" placeholder="0"/>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t">
                    <div><label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">3GL Comp (x10)</label><input type="number" value={op.comp_3gl} onChange={e=>setOp({...op, comp_3gl: e.target.value})} className="w-full border bg-white text-gray-900 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 outline-none" placeholder="0"/></div>
                    <div><label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">% Tái sử dụng (r%)</label><input type="number" value={op.reuse} onChange={e=>setOp({...op, reuse: e.target.value})} className="w-full border bg-white text-gray-900 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 outline-none" placeholder="0%"/></div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">PROD (Dev Exp)</label>
                      <select value={op.prod} onChange={e=>setOp({...op, prod: parseInt(e.target.value)})} className="w-full border bg-white text-gray-900 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 cursor-pointer font-medium outline-none">
                        <option value="4">Very Low (4)</option><option value="7">Low (7)</option><option value="13">Average (13)</option><option value="25">High (25)</option><option value="50">Very High (50)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT 2: UCP & Lịch sử */}
              <div className="space-y-6">
                {/* USE CASE POINTS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-colors">
                  <h3 className="font-bold text-purple-700 mb-4 border-b pb-2">3. Use Case Points (UCP)</h3>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">Tác nhân (UAW)</span>
                      <button onClick={addActor} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 font-bold transition-colors">+ Thêm thành viên</button>
                    </div>
                    {actors.map(actor => (
                      <div key={actor.id} className="flex gap-2 mb-2 items-center">
                        <input type="text" value={actor.name} onChange={e => updateActor(actor.id, 'name', e.target.value)} placeholder="Tên (VD: Thủ thư)" className="flex-1 border bg-white text-gray-900 rounded p-1.5 text-sm outline-none focus:ring-1 focus:ring-purple-400"/>
                        <select value={actor.type} onChange={e => updateActor(actor.id, 'type', e.target.value)} className="w-[45%] border bg-white text-gray-900 rounded p-1.5 text-xs outline-none">
                          <option value="1">Đơn giản (API)</option>
                          <option value="2">Trung bình (Giao thức/Text)</option>
                          <option value="3">Phức tạp (GUI)</option>
                        </select>
                        <button onClick={() => removeActor(actor.id)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                      </div>
                    ))}
                    {actors.length === 0 && <p className="text-xs text-gray-400 italic">Chưa có tác nhân nào.</p>}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">Use Cases (UUCW)</span>
                      <button onClick={addUseCase} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 font-bold transition-colors">+ Thêm hành động</button>
                    </div>
                    {useCases.map(uc => (
                      <div key={uc.id} className="flex gap-2 mb-2 items-center">
                        <input type="text" value={uc.name} onChange={e => updateUseCase(uc.id, 'name', e.target.value)} placeholder="Tên (VD: Mượn sách)" className="flex-1 border bg-white text-gray-900 rounded p-1.5 text-sm outline-none focus:ring-1 focus:ring-purple-400"/>
                        <input type="number" value={uc.transactions} onChange={e => updateUseCase(uc.id, 'transactions', e.target.value)} placeholder="Số giao dịch" className="w-[30%] border bg-white text-gray-900 rounded p-1.5 text-sm text-center outline-none focus:ring-1 focus:ring-purple-400"/>
                        <button onClick={() => removeUseCase(uc.id)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                      </div>
                    ))}
                    {useCases.length === 0 && <p className="text-xs text-gray-400 italic">Chưa có use case nào.</p>}
                  </div>
                </div>

                {/* LOC & HISTORICAL DATA */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-colors">
                  <h3 className="font-bold text-orange-600 mb-4 border-b pb-2">4. Yêu cầu, LOC & Historical Data</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Tổng LOC (Lines of Code)</label>
                      <input type="number" value={loc} onChange={e => setLoc(e.target.value)} className="w-full border bg-white text-gray-900 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Nhập LOC..."/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Số lượng Yêu cầu (Reqs)</label>
                      <input type="number" value={numReqs} onChange={e => setNumReqs(e.target.value)} className="w-full border bg-white text-gray-900 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Nhập số lượng..."/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t">
                    <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Lịch sử FP</label><input type="number" value={history.fp} onChange={e=>setHistory({...history, fp: e.target.value})} className="w-full border bg-white text-gray-900 rounded-lg p-1.5 text-sm outline-none"/></div>
                    <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Lịch sử LOC</label><input type="number" value={history.loc} onChange={e=>setHistory({...history, loc: e.target.value})} className="w-full border bg-white text-gray-900 rounded-lg p-1.5 text-sm outline-none"/></div>
                    <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Lịch sử Reqs</label><input type="number" value={history.reqs} onChange={e=>setHistory({...history, reqs: e.target.value})} className="w-full border bg-white text-gray-900 rounded-lg p-1.5 text-sm outline-none"/></div>
                    <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Lịch sử Test Cases</label><input type="number" value={history.testcases} onChange={e=>setHistory({...history, testcases: e.target.value})} className="w-full border bg-white text-gray-900 rounded-lg p-1.5 text-sm outline-none"/></div>
                    <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Effort cũ (days)</label><input type="number" value={history.effort} onChange={e=>setHistory({...history, effort: e.target.value})} className="w-full border bg-white text-gray-900 rounded-lg p-1.5 text-sm outline-none"/></div>
                    <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Defects cũ</label><input type="number" value={history.defects} onChange={e=>setHistory({...history, defects: e.target.value})} className="w-full border bg-white text-gray-900 rounded-lg p-1.5 text-sm outline-none"/></div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={onStartEstimate} disabled={loading} className={`w-full py-4 mb-10 rounded-2xl font-extrabold text-white text-lg transition-all shadow-lg flex justify-center items-center ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1'}`}>
              {loading ? (
                <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> AI Đang phân tích, tính toán & Sinh báo cáo...</>
              ) : "🚀 BẮT ĐẦU PHÂN TÍCH ƯỚC LƯỢNG"}
            </button>
          </div>

        ) : (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold border-l-4 border-emerald-600 pl-3 text-gray-900">Báo Cáo Ước Lượng (AI Generated)</h2>
              <button onClick={resetToHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">Tính dự án khác</button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center transition-colors"><p className="text-[10px] text-gray-500 uppercase font-bold">FP</p><p className="text-xl font-black text-blue-600">{getSafeNumber(result.metrics?.fp)}</p></div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center transition-colors"><p className="text-[10px] text-gray-500 uppercase font-bold">OP</p><p className="text-xl font-black text-teal-600">{getSafeNumber(result.metrics?.op_new)}</p></div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center transition-colors"><p className="text-[10px] text-gray-500 uppercase font-bold">UCP</p><p className="text-xl font-black text-purple-600">{getSafeNumber(result.metrics?.ucp)}</p></div>
              
              {/* Áp dụng hàm getCalculatedTeamSize() cho thẻ thống kê Tester */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center transition-colors"><p className="text-[10px] text-gray-500 uppercase font-bold">Tester Đề Xuất</p><p className="text-xl font-black text-emerald-600">{getCalculatedTeamSize()}</p></div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center transition-colors"><p className="text-[10px] text-gray-500 uppercase font-bold">Effort (Tháng)</p><p className="text-xl font-black text-rose-600">{getSafeNumber(result.metrics?.test_effort_person_months)}</p></div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center transition-colors"><p className="text-[10px] text-gray-500 uppercase font-bold">Thời gian</p><p className="text-xl font-black text-amber-600">{getSafeNumber(result.metrics?.estimated_duration_months)} tháng</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CỘT 1: FORM BÁO CÁO (WORD/TXT) CHI TIẾT */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col transition-colors">
                <div className="bg-slate-50 px-6 py-4 border-b rounded-t-2xl"><h3 className="font-bold text-gray-800">Chi tiết Báo Cáo Kỹ Thuật (Bao gồm AI giải thích)</h3></div>
                <textarea id="report-textarea" className="w-full flex-1 p-6 border-0 focus:ring-0 text-gray-700 bg-transparent font-mono text-sm resize-none min-h-[500px] leading-relaxed outline-none" defaultValue={generateReportTemplate()} />
                <div className="bg-gray-50 p-4 border-t rounded-b-2xl flex gap-2">
                    <button onClick={() => exportFile('word')} className="flex-1 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition text-sm">Xuất báo cáo Word</button>
                    <button onClick={() => exportFile('txt')} className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition text-sm">Xuất báo cáo TXT</button>
                </div>
              </div>




              {/* CỘT 2: GIAO DIỆN AI PHÂN TÍCH */}
              <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-colors">
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h3 className="font-bold text-white leading-tight">AI Analysis & Reason</h3>
                      <p className="text-[10px] text-indigo-200">Lý do vì sao hệ thống đưa ra con số trên</p>
                    </div>
                  </div>
                  <button onClick={handleSaveHistory} className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-full shadow hover:bg-indigo-50 transition">Lưu Dự Án</button>
                </div>
                
                <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">✨</div>
                    {/* Nội dung Markdown mô phỏng hiển thị GPT */}
                    <div className="text-sm text-gray-800 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: result.ai_analysis ? result.ai_analysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>') : 'Đang xử lý phân tích...' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-gray-200">
                  <button onClick={() => setCurrentView('chatbot')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition text-sm flex justify-center items-center gap-2">
                    <span>💬</span> Thảo luận thêm với ChatBot
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;