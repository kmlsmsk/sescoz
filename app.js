(function() {
    // Sayfa yüklendiğinde asistanı otomatik oluştur
    document.addEventListener('DOMContentLoaded', () => {
        initAudioApp();
    });

    function toggleVisibility() {
        const bar = document.getElementById('audio-editor-ai-bar-v6');
        if (bar) {
            bar.style.display = (bar.style.display === 'none') ? 'flex' : 'none';
        }
    }

    function initAudioApp() {
        // 1. YAPILANDIRMA     
        const CFG = {         
            ID_BAR: 'audio-editor-ai-bar-v6',         
            ID_MODAL: 'audio-editor-ai-modal-v6',         
            MODEL: 'gemini-2.0-flash', // Not: Eğer "gemini-3-flash-preview" model bulunamadı hatası verirse bunu kullanın. Kodda orijinalini bıraktım.      
            SIGNATURE: 'K.Ş',        
        };      
        
        // Orijinal kodunuzdaki model ismini koruyoruz
        CFG.MODEL = 'gemini-3-flash-preview';

        // Eski elementleri temizle (Güvenlik)
        document.getElementById(CFG.ID_BAR)?.remove();     
        document.getElementById(CFG.ID_MODAL)?.remove();      

        let ttPolicy = null;     
        if (window.trustedTypes && window.trustedTypes.createPolicy) {         
            try { ttPolicy = window.trustedTypes.createPolicy('ae-ext-pro', { createHTML: s => s, createScript: s => s }); } catch (e) {}     
        }     
        const safeHTML = (html) => ttPolicy ? ttPolicy.createHTML(html) : html;      

        // 2. İKONLAR
        const ICONS = {         
            BOT_LOGO: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,         
            AUDIO_LOGO: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>`,         
            DRAG: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>`,         
            KEY: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,         
            CLOSE: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,         
            MINIMIZE: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,         
            MAXIMIZE: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,         
            COPY: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,         
            MOVE: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="19 9 22 12 19 15"></polyline><polyline points="9 19 12 22 15 19"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,         
            UPLOAD: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
            MIC: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
            STOP: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="2" ry="2"/></svg>`,
            DOWNLOAD: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
            SPINNER: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" class="ne-spin"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-linecap="round"></circle></svg>`
        };      

        // 3. CSS STİLLERİ
        const style = document.createElement('style');     
        style.innerHTML = `         
            #${CFG.ID_BAR} { position: fixed; top: 15vh; right: 20px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 24px; padding: 12px 8px; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); z-index: 999998; font-family: system-ui, sans-serif; user-select: none; }         
            .ne-drag-bar { cursor: grab; padding: 4px; border-radius: 6px; display: flex; align-items: center; opacity: 0.6; transition: 0.2s; margin-bottom: 2px; }         
            .ne-drag-bar:hover { opacity: 1; background: #f1f5f9; }         
            .ne-sep { width: 24px; height: 1px; background: #e2e8f0; margin: 2px 0; }         
            .ne-bar-btn { background: none; border: none; cursor: pointer; padding: 10px; border-radius: 12px; color: #64748b; transition: all 0.2s; display: flex; justify-content: center; outline: none; }         
            .ne-bar-btn:hover { background: #f1f5f9; transform: scale(1.05); }         
            .ne-bar-btn.active { background: #f5f3ff; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.15); border: 1px solid #ddd6fe; color: #8b5cf6; }         
            .ne-bar-btn.close:hover { background: #fef2f2; color: #ef4444; }         
            .ne-sig { font-size: 11px; font-weight: 700; color: #cbd5e1; margin-top: 8px; writing-mode: vertical-rl; letter-spacing: 1px; }          

            #${CFG.ID_MODAL} { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ffffff; width: 600px; height: 80vh; min-width: 450px; min-height: 500px; max-width: 95vw; max-height: 95vh; border-radius: 16px; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05); z-index: 999999; opacity: 0; pointer-events: none; transition: opacity 0.2s; font-family: system-ui, sans-serif; resize: both; overflow: hidden; }                   
            #${CFG.ID_MODAL}.show { opacity: 1; pointer-events: auto; }         
            #${CFG.ID_MODAL}.minimized { height: 60px !important; min-height: 60px !important; resize: none; overflow: hidden; }         
            #${CFG.ID_MODAL}.minimized .ne-body, #${CFG.ID_MODAL}.minimized .ne-footer { display: none !important; }          

            .ne-head { position: absolute; top: 0; left: 0; right: 0; height: 60px; padding: 0 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #ffffff; cursor: grab; user-select: none; z-index: 10; }         
            .ne-head:active { cursor: grabbing; }         
            .ne-title { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 16px; color: #0f172a; }         
            .ne-head-actions { display: flex; gap: 6px; }         
            .ne-action-btn { cursor: pointer; color: #64748b; padding: 6px; border-radius: 8px; transition: 0.2s; background: transparent; border: none; }         
            .ne-action-btn:hover { background: #f1f5f9; color: #0f172a; }         
            .ne-action-btn.close:hover { background: #fee2e2; color: #ef4444; }          

            .ne-footer { position: absolute; bottom: 0; left: 0; right: 0; height: 65px; padding: 0 20px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; align-items: center; gap: 12px; background: #fafafa; z-index: 10; }         
            .ne-footer::after { content: ''; position: absolute; bottom: 0; right: 0; width: 15px; height: 15px; cursor: se-resize; pointer-events: none; }          

            .ne-body { position: absolute; top: 60px; bottom: 65px; left: 0; right: 0; padding: 20px; overflow-y: auto !important; overflow-x: hidden; background: #ffffff; display: block; }                  
            .ne-body::-webkit-scrollbar { width: 8px; }         
            .ne-body::-webkit-scrollbar-track { background: #f8fafc; }         
            .ne-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }         

            .ne-label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 12px; text-align: center; }         
            .ne-audio-cards { display: flex; gap: 16px; margin-bottom: 20px; flex-direction: column; }
            
            .ne-upload-zone { border: 2px dashed #c4b5fd; border-radius: 16px; padding: 30px 20px; text-align: center; cursor: pointer; transition: 0.3s; background: #f5f3ff; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
            .ne-upload-zone:hover { border-color: #8b5cf6; background: #ede9fe; }
            .ne-upload-zone.dragover { border-color: #8b5cf6; background: #ede9fe; transform: scale(1.02); }
            .ne-upload-text { font-size: 14px; color: #6d28d9; font-weight: 500; margin-top: 10px; }
            .ne-file-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }

            .ne-record-zone { border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .ne-record-btn { width: 64px; height: 64px; border-radius: 50%; background: #ef4444; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; transition: 0.3s; box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4); }
            .ne-record-btn:hover { transform: scale(1.05); background: #dc2626; }
            .ne-record-btn.recording { animation: pulseRecord 1.5s infinite; background: #dc2626; }
            .ne-record-status { font-size: 14px; font-weight: 600; color: #64748b; }
            .ne-record-timer { font-family: monospace; font-size: 18px; color: #ef4444; font-weight: bold; margin-top: 5px; display: none; }

            .ne-audio-player { width: 100%; margin-top: 16px; display: none; border-radius: 8px; }
            .ne-remove-audio { margin-top: 10px; color: #ef4444; font-size: 13px; font-weight: bold; cursor: pointer; display: none; text-decoration: underline; }

            .ne-btn { padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: 0.2s; display: flex; align-items: center; gap: 8px; justify-content: center; }         
            .ne-btn-sec { background: #f1f5f9; color: #475569; }         
            .ne-btn-sec:hover { background: #e2e8f0; color: #0f172a; }         
            .ne-btn-pri { background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25); }         
            .ne-btn-pri:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(139, 92, 246, 0.35); }         
            .ne-btn-pri:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; transform: none; }                  
            
            .ne-fade-in { animation: fadeIn 0.4s ease forwards; }         
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }                  
            @keyframes pulseRecord { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
            
            .ne-prog-wrap { width: 100%; height: 6px; background: #f1f5f9; border-radius: 6px; overflow: hidden; margin-top: 30px; }         
            .ne-prog-bar { width: 0%; height: 100%; background: linear-gradient(90deg, #8b5cf6, #c4b5fd); transition: width 0.3s ease; border-radius: 6px; }                  
            
            .ne-res { font-size: 15px; color: #1e293b; line-height: 1.8; user-select: text; word-break: break-word; overflow-wrap: break-word; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: justify; margin-bottom: 2px; white-space: pre-wrap; }         
            @keyframes spin { 100% { transform: rotate(360deg); } }         
            .ne-spin { animation: spin 1s linear infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }     
        `;     

        const targetHead = document.head || document.documentElement;
        if (targetHead) targetHead.appendChild(style);

        // 4. ARAYÜZ OLUŞTURMA     
        const bar = document.createElement('div');     
        bar.id = CFG.ID_BAR;     
        bar.innerHTML = safeHTML(`         
            <div class="ne-drag-bar" title="Sürükle">${ICONS.DRAG}</div>         
            <div title="Ses Asistanı" style="margin-bottom: 4px; color: #8b5cf6;">${ICONS.BOT_LOGO}</div>         
            <div class="ne-sep"></div>         
            <button class="ne-bar-btn" id="ne-btn-key" title="API Anahtarı">${ICONS.KEY}</button>         
            <button class="ne-bar-btn active" id="ne-btn-open" title="Çözümleyiciyi Aç">${ICONS.AUDIO_LOGO}</button>         
            <div class="ne-sep"></div>         
            <button class="ne-bar-btn close" id="ne-btn-close" title="Kapat">${ICONS.CLOSE}</button>         
            <div class="ne-sig">${CFG.SIGNATURE}</div>     
        `);     

        const modal = document.createElement('div');     
        modal.id = CFG.ID_MODAL;     
        modal.innerHTML = safeHTML(`         
            <div class="ne-head" id="ne-modal-head">             
                <div class="ne-title" style="color:#8b5cf6;">${ICONS.BOT_LOGO} <span style="color:#0f172a;">Akıllı Ses Asistanı</span></div>             
                <div class="ne-drag-hint" title="Sürükle">${ICONS.MOVE}</div>             
                <div class="ne-head-actions">                 
                    <button class="ne-action-btn" id="ne-btn-minimize" title="Arka Plana Al">${ICONS.MINIMIZE}</button>                 
                    <button class="ne-action-btn close" id="ne-btn-modal-close" title="Kapat">${ICONS.CLOSE}</button>             
                </div>         
            </div>                  
            
            <div class="ne-body" id="ne-body-container">             
                <div id="ne-s1" class="ne-fade-in">                 
                    <label class="ne-label">İşlenecek Sesi Seçin veya Kaydedin</label>                 
                    
                    <div class="ne-audio-cards">
                        <div class="ne-upload-zone" id="ne-upload-zone">
                            <div id="ne-upload-icon">${ICONS.UPLOAD}</div>
                            <div class="ne-upload-text" id="ne-upload-text">Dosya Sürükleyin veya Tıklayın (Tüm formatlar, Maks. 20 Dakika)</div>
                            <input type="file" id="ne-file-input" class="ne-file-input" accept="audio/*, video/*">
                        </div>
                        <div style="text-align:center; color:#94a3b8; font-size:12px; font-weight:bold;">VEYA</div>
                        <div class="ne-record-zone">
                            <button class="ne-record-btn" id="ne-record-btn" title="Kayda Başla">${ICONS.MIC}</button>
                            <div class="ne-record-status" id="ne-record-status">Mikrofondan Kaydet (Maks. 20 Dk)</div>
                            <div class="ne-record-timer" id="ne-record-timer">00:00</div>
                        </div>
                    </div>

                    <div style="text-align:center;">
                        <audio id="ne-audio-player" class="ne-audio-player" controls></audio>
                        <div id="ne-remove-audio" class="ne-remove-audio">Seçili Sesi İptal Et</div>
                    </div>
                </div>                          
                
                <div id="ne-s2" style="display:none; text-align:center; padding-top:40px;">                 
                    <div style="font-size:48px; animation:spin 2s infinite linear; color:#8b5cf6; display:inline-block;">⚙️</div>                 
                    <h2 style="color:#0f172a; margin:24px 0 8px 0; font-size:18px;">Ses Deşifre Ediliyor...</h2>                 
                    <p style="color:#64748b; font-size:13px; margin:0; animation:pulse 2s infinite;">Profesyonel deşifre uzmanı sesi kelimesi kelimesine metne döküyor. (Süreye bağlı olarak 1-2 dk sürebilir)</p>                 
                    <div class="ne-prog-wrap"><div class="ne-prog-bar" id="ne-prog"></div></div>             
                </div>                          
                
                <div id="ne-s3" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <h3 style="margin:0; font-size:16px; color:#0f172a;">Deşifre Metni</h3>
                    </div>
                    <div id="ne-result-text" class="ne-res"></div>
                </div>         
            </div>          
            
            <div class="ne-footer">             
                <button class="ne-btn ne-btn-sec" id="ne-cancel">İptal</button>             
                <button class="ne-btn ne-btn-sec" id="ne-download" style="display:none; color:#0284c7; background:#e0f2fe; border:1px solid #bae6fd;">${ICONS.DOWNLOAD} İndir (.TXT)</button>
                <button class="ne-btn ne-btn-sec" id="ne-copy" style="display:none; color:#10b981; background:#ecfdf5; border:1px solid #a7f3d0;">${ICONS.COPY} Kopyala</button>             
                <button class="ne-btn ne-btn-pri" id="ne-solve" disabled>Deşifre Et</button>         
            </div>     
        `);     

        const targetBody = document.body || document.documentElement;
        if (targetBody) { targetBody.appendChild(bar); targetBody.appendChild(modal); } 
        else return; 

        // 5. DOM REFERANSLARI    
        const els = {         
            fileInput: document.getElementById('ne-file-input'), uploadZone: document.getElementById('ne-upload-zone'), 
            uploadText: document.getElementById('ne-upload-text'), uploadIcon: document.getElementById('ne-upload-icon'),
            recordBtn: document.getElementById('ne-record-btn'), recordStatus: document.getElementById('ne-record-status'), recordTimer: document.getElementById('ne-record-timer'),
            audioPlayer: document.getElementById('ne-audio-player'), removeAudio: document.getElementById('ne-remove-audio'),
            s1: document.getElementById('ne-s1'), s2: document.getElementById('ne-s2'), s3: document.getElementById('ne-s3'),         
            prog: document.getElementById('ne-prog'), solve: document.getElementById('ne-solve'),          
            cancel: document.getElementById('ne-cancel'), copy: document.getElementById('ne-copy'), download: document.getElementById('ne-download'),
            modalHead: document.getElementById('ne-modal-head'), minBtn: document.getElementById('ne-btn-minimize'), bodyContainer: document.getElementById('ne-body-container'),
            resultText: document.getElementById('ne-result-text')
        };     
        
        let currentAudioBase64 = null;      
        let currentMimeType = 'audio/wav'; 
        let mediaRecorder = null;
        let audioChunks = [];
        let isRecording = false;
        let recordInterval = null;
        let recordSeconds = 0;

        // 6. SÜRÜKLE BIRAK
        function makeDraggable(element, handle) {         
            let isDragging = false, offset = {x:0, y:0};                  
            handle.addEventListener('mousedown', (e) => {             
                if (e.target.closest('button') || e.target.closest('.ne-action-btn')) return;             
                isDragging = true;                          
                if(element.id === CFG.ID_MODAL) element.classList.add('dragging');                 
                const rect = element.getBoundingClientRect();             
                offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };         
            });          
            window.addEventListener('mousemove', (e) => {             
                if (!isDragging) return;             
                e.preventDefault();                          
                let newX = e.clientX - offset.x;             
                let newY = e.clientY - offset.y;              
                newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));             
                newY = Math.max(0, Math.min(newY, window.innerHeight - element.offsetHeight));              
                element.style.left = newX + 'px';             
                element.style.top = newY + 'px';             
                element.style.transform = 'none';             
                if(element.id === CFG.ID_BAR) element.style.right = 'auto';          
            });          
            window.addEventListener('mouseup', () => { isDragging = false; });     
        }      

        makeDraggable(bar, bar.querySelector('.ne-drag-bar'));     
        makeDraggable(modal, els.modalHead);      

        // 7. PENCERE VE AYARLAR
        const openModal = () => {          
            modal.classList.add('show'); modal.classList.remove('minimized');         
            els.minBtn.innerHTML = ICONS.MINIMIZE;         
            if(!modal.classList.contains('dragging')){             
                modal.style.left = '50%'; modal.style.top = '50%';             
                modal.style.transform = 'translate(-50%, -50%)';         
            }     
        };     

        const closeModal = () => {         
            modal.classList.remove('show');         
            if(isRecording) stopRecording();
            setTimeout(() => {             
                els.s1.style.display='block'; els.s1.classList.add('ne-fade-in');             
                els.s2.style.display='none'; els.s2.className = '';             
                els.s3.style.display='none'; els.s3.className = '';             
                els.solve.style.display='flex'; 
                els.copy.style.display='none'; els.download.style.display='none'; els.cancel.innerHTML='İptal';             
                els.prog.style.width='0%'; els.bodyContainer.scrollTop = 0;         
                resetAudioState();
            }, 300);     
        };      

        els.minBtn.onclick = () => {         
            modal.classList.toggle('minimized');         
            els.minBtn.innerHTML = modal.classList.contains('minimized') ? ICONS.MAXIMIZE : ICONS.MINIMIZE;
            els.minBtn.title = modal.classList.contains('minimized') ? "Büyüt" : "Arka Plana Al";
        };      

        document.getElementById('ne-btn-modal-close').onclick = closeModal;     
        els.cancel.onclick = closeModal;     
        document.getElementById('ne-btn-open').onclick = openModal;     
        document.getElementById('ne-btn-close').onclick = () => { bar.style.display = 'none'; };      

        // Chrome Storage yerine Web LocalStorage Kullanıldı
        document.getElementById('ne-btn-key').onclick = () => {         
            const savedKey = localStorage.getItem('geminiAudioKey') || '';             
            const k = prompt('Gemini API Anahtarınızı Girin:', savedKey);             
            if(k !== null && k.trim() !== "") {                  
                localStorage.setItem('geminiAudioKey', k.trim());
                alert('✅ Anahtar tarayıcınıza kaydedildi.');
            }         
        };      

        // 8. OLAĞANÜSTÜ DİNAMİK SES DÖNÜŞTÜRÜCÜ (20 Dakika Garantili 19MB Limitli)
        
        function audioBufferToWav(buffer) {
            let numOfChan = 1; 
            let length = buffer.length * 2 + 44; 
            let out = new ArrayBuffer(length);
            let view = new DataView(out);
            let pos = 0;

            function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
            function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }

            setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157); setUint32(0x20746d66); 
            setUint32(16); setUint16(1); setUint16(numOfChan); setUint32(buffer.sampleRate);
            setUint32(buffer.sampleRate * 2 * numOfChan); setUint16(numOfChan * 2); setUint16(16); 
            setUint32(0x61746164); setUint32(length - pos - 4); 

            let channelData = buffer.getChannelData(0);
            let offset = 0;
            
            while(pos < length) {
                let sample = Math.max(-1, Math.min(1, channelData[offset])); 
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; 
                view.setInt16(pos, sample, true); 
                pos += 2; offset++;
            }
            return new Blob([out], {type: "audio/wav"});
        }

        const processAudioFile = async (file) => {
            if(!file) return;

            els.uploadIcon.innerHTML = ICONS.SPINNER;
            els.uploadText.innerHTML = `<span style="color:#8b5cf6;">"${file.name}" dönüştürülüyor ve hazırlanıyor... ⏳</span>`;
            els.fileInput.disabled = true; els.solve.disabled = true;

            try {
                const arrayBuffer = await file.arrayBuffer();
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const decodedData = await audioCtx.decodeAudioData(arrayBuffer);

                if (decodedData.duration > 21 * 60) {
                    throw new Error("Sistem maksimum 20 dakikalık dosyaları destekler. Lütfen dosyanızı kırpın (Hata Kodu: SURE_ASIMI).");
                }

                let targetSampleRate = Math.floor(19500000 / (decodedData.duration * 2));
                targetSampleRate = Math.min(16000, Math.max(8000, targetSampleRate));

                const offlineCtx = new OfflineAudioContext(1, decodedData.duration * targetSampleRate, targetSampleRate);
                const source = offlineCtx.createBufferSource();
                source.buffer = decodedData;
                source.connect(offlineCtx.destination);
                source.start(0);

                const resampledData = await offlineCtx.startRendering();
                const wavBlob = audioBufferToWav(resampledData);

                if(wavBlob.size > 21 * 1024 * 1024) {
                    throw new Error("Dosya boyutu yüksek sıkıştırmaya rağmen API sınırını (20 MB) aşıyor. Lütfen süreyi kısaltın.");
                }

                const reader = new FileReader();
                reader.readAsDataURL(wavBlob);
                reader.onload = () => {
                    currentAudioBase64 = reader.result.split(',')[1];
                    currentMimeType = 'audio/wav';
                    
                    let mins = Math.floor(decodedData.duration / 60);
                    let secs = Math.floor(decodedData.duration % 60);
                    
                    els.uploadIcon.innerHTML = ICONS.UPLOAD;
                    els.uploadText.innerText = `Hazır: ${file.name} (${mins}dk ${secs}sn)`;
                    els.audioPlayer.src = URL.createObjectURL(wavBlob);
                    els.audioPlayer.style.display = 'block';
                    els.removeAudio.style.display = 'inline-block';
                    els.solve.disabled = false;
                    els.fileInput.disabled = false;
                };

            } catch(err) {
                console.error(err);
                els.uploadIcon.innerHTML = ICONS.UPLOAD;
                els.uploadText.innerText = "Dosya Sürükleyin veya Tıklayın (Tüm formatlar, Maks. 20 Dakika)";
                els.fileInput.disabled = false;
                alert('Hata: ' + err.message);
            }
        };

        const resetAudioState = () => {
            currentAudioBase64 = null; currentMimeType = 'audio/wav';
            els.uploadIcon.innerHTML = ICONS.UPLOAD;
            els.uploadText.innerText = "Dosya Sürükleyin veya Tıklayın (Tüm formatlar, Maks. 20 Dakika)";
            els.fileInput.value = ""; els.fileInput.disabled = false;
            els.audioPlayer.src = ""; els.audioPlayer.style.display = 'none';
            els.removeAudio.style.display = 'none';
            els.solve.disabled = true;
            els.recordTimer.style.display = 'none';
            els.recordStatus.innerText = "Mikrofondan Kaydet (Maks. 20 Dk)";
        };

        const formatTime = (sec) => {
            const m = Math.floor(sec / 60).toString().padStart(2, '0');
            const s = (sec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        els.fileInput.addEventListener('change', (e) => { if(!isRecording) processAudioFile(e.target.files[0]); });

        els.uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); els.uploadZone.classList.add('dragover'); });
        els.uploadZone.addEventListener('dragleave', () => els.uploadZone.classList.remove('dragover'));
        els.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault(); els.uploadZone.classList.remove('dragover');
            if(!isRecording && e.dataTransfer.files.length) processAudioFile(e.dataTransfer.files[0]);
        });

        els.removeAudio.onclick = resetAudioState;

        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = e => { if(e.data.size > 0) audioChunks.push(e.data); };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); 
                    const file = new File([audioBlob], "Mikrofon_Kaydi.webm", { type: 'audio/webm' });
                    processAudioFile(file); 
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                isRecording = true;
                els.recordBtn.innerHTML = ICONS.STOP;
                els.recordBtn.classList.add('recording');
                els.recordStatus.innerText = "Kaydediliyor... Bitirmek için tıklayın.";
                
                recordSeconds = 0; els.recordTimer.innerText = "00:00"; els.recordTimer.style.display = 'block';
                recordInterval = setInterval(() => { 
                    recordSeconds++; 
                    els.recordTimer.innerText = formatTime(recordSeconds); 
                    if(recordSeconds >= 1200) { stopRecording(); }
                }, 1000);

                els.uploadZone.style.opacity = '0.5'; els.uploadZone.style.pointerEvents = 'none';
                els.removeAudio.style.display = 'none'; els.audioPlayer.style.display = 'none'; els.solve.disabled = true;

            } catch (err) { alert('Mikrofon erişimi reddedildi. Tarayıcı izinlerini kontrol edin.'); }
        };

        const stopRecording = () => {
            if(!isRecording || !mediaRecorder) return;
            mediaRecorder.stop();
            isRecording = false; clearInterval(recordInterval);
            els.recordBtn.innerHTML = ICONS.MIC; els.recordBtn.classList.remove('recording');
            els.recordStatus.innerText = "Kayıt Tamamlandı";
            els.uploadZone.style.opacity = '1'; els.uploadZone.style.pointerEvents = 'auto';
        };

        els.recordBtn.onclick = () => { isRecording ? stopRecording() : startRecording(); };

        // 9. API VE SONUÇ 
        els.copy.onclick = () => {         
            navigator.clipboard.writeText(els.resultText.innerText).then(() => {             
                els.copy.innerHTML = '✅ Kopyalandı!';             
                setTimeout(() => els.copy.innerHTML = `${ICONS.COPY} Kopyala`, 2000);         
            });     
        };      

        els.download.onclick = () => {
            const blob = new Blob([els.resultText.innerText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `Cozumleme_Sonucu_${new Date().getTime()}.txt`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        };

        els.solve.onclick = async () => {         
            if(!currentAudioBase64) return;
            
            // Web LocalStorage'den API Anahtarını Çekiyoruz
            const apiKey = localStorage.getItem('geminiAudioKey');             
            if(!apiKey) { alert('⚠️ Lütfen önce Anahtar ikonuna (🔑) tıklayarak Gemini API Key giriniz.'); return; }                          
            
            els.s1.style.display='none'; els.s2.style.display='block'; els.s2.className = 'ne-fade-in';             
            els.solve.style.display = 'none';            
            
            let p=0; const t = setInterval(() => { if(p<90){ p+=Math.random()*5; els.prog.style.width=p+'%'; } }, 500);              
            
            try {                 
                const promptText = `
Sen bir Türkçe Ses Çözümleme Uzmanısın ve aynı zamanda metin iyileştirme Agent'ısın.
Görevin, sana verilen ses dosyasını dikkatlice dinleyerek Türkçe metne çevirmek.
Çeviri sırasında aşağıdaki adımları izle:
1. Sesi doğru bir şekilde Türkçe metne dök. Konuşmacı değişikliklerini veya önemli duraklamaları yeni paragraflar başlatarak belirtmeye çalış.
2. Metindeki olası dil bilgisi, yazım ve anlam hatalarını tespit et.
3. Tespit ettiğin bu hataları düzelt.
4. Metni daha akıcı, anlaşılır ve doğal hale getirmek için iyileştirmeler yap.
5. Sonuç olarak SADECE ve SADECE nihai, düzeltilmiş ve iyileştirilmiş Türkçe metni ver. Başka hiçbir açıklama ekleme.`;                  
                
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CFG.MODEL}:generateContent?key=${apiKey}`, {                     
                    method: 'POST', headers: {'Content-Type': 'application/json'},                     
                    body: JSON.stringify({ contents: [{ parts: [ { text: promptText }, { inline_data: { mime_type: currentMimeType, data: currentAudioBase64 } } ] }], generationConfig: { temperature: 0.1 } })                 
                });                  
                
                clearInterval(t); els.prog.style.width='100%';                  
                
                if(!response.ok) {                     
                    const err = await response.json(); throw new Error(err.error?.message || response.statusText);                 
                }                                  
                
                const json = await response.json();                 
                const rawResult = json.candidates?.[0]?.content?.parts?.[0]?.text;                  
                
                if(!rawResult) throw new Error("Seste konuşma algılanamadı.");

                setTimeout(() => {                     
                    els.s2.style.display='none'; els.s3.style.display='block'; els.s3.classList.add('ne-fade-in');                     
                    els.resultText.innerText = rawResult; 
                    els.copy.style.display='flex'; els.download.style.display='flex'; els.cancel.innerHTML='Kapat';                     
                    els.bodyContainer.scrollTop = 0;                 
                }, 500);              
                
            } catch(e) {                 
                clearInterval(t);
                
                let errorMsg = e.message;
                // "Model not found" hatası için geliştirici uyarısı
                if (errorMsg.includes("models/gemini-3-flash-preview is not found")) {
                    errorMsg += `<br><br><b>Not:</b> "gemini-3-flash-preview" modeli yayından kalkmış olabilir. Kodun başındaki <code>CFG.MODEL</code> değerini <code>gemini-2.0-flash</code> olarak değiştiriniz.`;
                }
                
                els.s2.innerHTML = `<div style="color:#ef4444; font-weight:600; padding:20px; text-align:center; font-size:15px; line-height:1.5;">Hata Oluştu:<br><br>${errorMsg}</div>`;                 
                els.solve.style.display='flex'; els.solve.disabled = false;             
            }         
        };      
    }
})();
