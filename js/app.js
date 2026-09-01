/**
 * PKU MUI JAKARTA — RESEARCH OS | Panduan Tesis Angkatan 19
 * Cute Academic Productivity App - Interactive Engine, Confetti & Micro-interactions
 */

(function () {
  'use strict';

  // --- GOOGLE DRIVE LINKS CONFIGURATION ---
  const driveLinks = {
    startHere: "https://drive.google.com/drive/folders/10zOPPr7C6CVFRFO1phvmvvst295w3Dc2?usp=sharing",
    qualitative: "https://drive.google.com/drive/folders/1pgvAKG9cGT4dd621OPPf-p6Tll0FZ1r-?usp=sharing",
    quantitative: "https://drive.google.com/drive/folders/1UTYyAJK5wXEwRw0wa8V91H7MrLp118-O?usp=sharing",
    mixedMethods: "https://drive.google.com/drive/folders/1V9zdEhlwLJiUaBBJfLtW-6lmwGBFxm1B?usp=drive_link",
    core: "https://drive.google.com/drive/folders/1NRA2fu0Bga4_CAnP8q2TxUcFPm4XQe5z?usp=drive_link",
    fullVersion: "https://drive.google.com/drive/folders/1F3XNo4nGbf6JisUMZYk0hXaLTDuaX9zg?usp=drive_link",
    examples: "https://drive.google.com/drive/folders/1ItcFWHhJAPT7o6pEI0o-REUu-pWXYt4e?usp=drive_link"
  };

  const methodDisplayNames = {
    qualitative: "Kualitatif",
    quantitative: "Kuantitatif",
    mixedMethods: "Mixed Methods"
  };

  const STORAGE_KEY = 'pku_research_os_ang19_state';

  // --- APPLICATION STATE ---
  let state = {
    currentStep: 1,
    name: '',
    topic: '',
    stage: '',
    method: 'qualitative',
    methodSure: '',
    isCompleted: false
  };

  // --- DOM ELEMENTS ---
  const modalOverlay = document.getElementById('setup-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBtnPrev = document.getElementById('modal-btn-prev');
  const modalBtnNext = document.getElementById('modal-btn-next');
  const modalFooterNav = document.getElementById('modal-footer-nav');
  const stepProgressFill = document.getElementById('step-progress-fill');
  const stepCountLabel = document.getElementById('step-count-label');
  const stepDotsDisplay = document.getElementById('step-dots-display');
  const modalStepsContainer = document.getElementById('modal-steps-container');
  const modalLoadingState = document.getElementById('modal-loading-state');
  const loadingDynamicText = document.getElementById('loading-dynamic-text');

  // Step Elements
  const stepElements = document.querySelectorAll('.setup-step');
  const inputName = document.getElementById('input-user-name');
  const inputTopic = document.getElementById('input-user-topic');
  const btnQuickNoTitle = document.getElementById('btn-quick-no-title');
  const stageRadios = document.querySelectorAll('input[name="research_stage"]');
  const sureRadios = document.querySelectorAll('input[name="method_sure"]');
  const modalChosenMethodDisplay = document.getElementById('modal-chosen-method-display');
  const unsureWarningBox = document.getElementById('unsure-warning-box');
  const btnOpenDriveFinal = document.getElementById('btn-open-drive-final');
  const btnEditAnswers = document.getElementById('btn-edit-answers');

  // Confirmation screen display elements
  const confUserName = document.getElementById('conf-user-name');
  const confMethodName = document.getElementById('conf-method-name');
  const confMethodHighlight = document.getElementById('conf-method-highlight');
  const confStageName = document.getElementById('conf-stage-name');
  const confTopicName = document.getElementById('conf-topic-name');

  // Returning user bar
  const returningUserBar = document.getElementById('returning-user-bar');
  const returningWelcomeText = document.getElementById('returning-welcome-text');
  const btnResumeSetup = document.getElementById('btn-resume-setup');
  const btnResetData = document.getElementById('btn-reset-data');

  // Toast
  const toastEl = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout = null;

  // --- INITIALIZATION ---
  function init() {
    loadSavedState();
    bindEvents();
    initAccordions();
    initFaq();
    initMobileNav();
    initWaModal();
    initPasswordGate();
  }

  // --- PASSWORD GATE (Academic Library) ---
  function initPasswordGate() {
    const CORRECT_PASSWORD = 'pkumui19';
    const overlay = document.getElementById('password-gate-overlay');
    const card = document.getElementById('pw-gate-card');
    const closeBtn = document.getElementById('pw-gate-close');
    const input = document.getElementById('pw-gate-input');
    const submitBtn = document.getElementById('pw-submit-btn');
    const errorMsg = document.getElementById('pw-error-msg');
    const inputGroup = document.getElementById('pw-input-group');
    const toggleVisBtn = document.getElementById('pw-toggle-vis');
    const visIcon = document.getElementById('pw-vis-icon');
    const targetSemLabel = document.getElementById('pw-target-sem');

    if (!overlay) return;

    let pendingUrl = '';

    // Open modal when library buttons are clicked
    document.querySelectorAll('.btn-library-access').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingUrl = btn.getAttribute('data-drive-url') || '';
        const semName = btn.getAttribute('data-sem') || 'Materi';
        if (targetSemLabel) targetSemLabel.textContent = semName;

        // Reset form state
        if (input) input.value = '';
        if (errorMsg) errorMsg.classList.add('hidden');
        if (inputGroup) inputGroup.classList.remove('error-state');
        card.classList.remove('shake');

        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => { if (input) input.focus(); }, 300);
      });
    });

    // Close modal
    function closePasswordGate() {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      pendingUrl = '';
      if (input) input.value = '';
      if (errorMsg) errorMsg.classList.add('hidden');
      if (inputGroup) inputGroup.classList.remove('error-state');
    }

    if (closeBtn) closeBtn.addEventListener('click', closePasswordGate);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePasswordGate();
    });

    // Show/hide password toggle
    if (toggleVisBtn && input && visIcon) {
      toggleVisBtn.addEventListener('click', () => {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        visIcon.textContent = isHidden ? '🙈' : '👁️';
      });
    }

    // Validate password
    function checkPassword() {
      const entered = input ? input.value.trim() : '';
      if (entered === CORRECT_PASSWORD) {
        // SUCCESS 🎉 — buka window DULU sebelum apapun (hindari popup blocker)
        if (pendingUrl) {
          window.open(pendingUrl, '_blank', 'noopener,noreferrer');
        }
        closePasswordGate();
        showToast('Akses diberikan! Selamat belajar ✨📚');
      } else {
        // WRONG ❌
        if (errorMsg) errorMsg.classList.remove('hidden');
        if (inputGroup) inputGroup.classList.add('error-state');

        // Shake animation
        card.classList.remove('shake');
        void card.offsetWidth; // reflow trigger
        card.classList.add('shake');
        card.addEventListener('animationend', () => card.classList.remove('shake'), { once: true });

        if (input) {
          input.value = '';
          input.focus();
        }
      }
    }

    if (submitBtn) submitBtn.addEventListener('click', checkPassword);

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          // Enter = cek password langsung
          checkPassword();
        } else {
          // Hapus error saat user mulai ketik ulang
          if (errorMsg) errorMsg.classList.add('hidden');
          if (inputGroup) inputGroup.classList.remove('error-state');
        }
      });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        closePasswordGate();
      }
    });
  }


  // --- LOCAL STORAGE HANDLING ---
  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.name) {
          state = { ...state, ...saved };
          showReturningUserBanner();
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available or error parsing:', e);
    }
  }

  function saveStateToLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save to LocalStorage:', e);
    }
  }

  function showReturningUserBanner() {
    if (!returningUserBar) return;
    const methodName = methodDisplayNames[state.method] || state.method;
    returningWelcomeText.innerHTML = `Selamat datang kembali, <strong>${escapeHtml(state.name)}</strong>! Setup: <span class="badge-tag">${methodName}</span> (${escapeHtml(state.stage || 'Aktif')})`;
    returningUserBar.classList.remove('hidden');
  }

  function resetUserData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    state = {
      currentStep: 1,
      name: '',
      topic: '',
      stage: '',
      method: 'qualitative',
      methodSure: '',
      isCompleted: false
    };
    if (returningUserBar) returningUserBar.classList.add('hidden');
    if (inputName) inputName.value = '';
    if (inputTopic) inputTopic.value = '';
    stageRadios.forEach(r => r.checked = false);
    sureRadios.forEach(r => r.checked = false);
    if (unsureWarningBox) unsureWarningBox.classList.add('hidden');
    showToast('Data setup berhasil direset ✨');
  }

  // --- STEP CONTROLLER ---
  const stepDots = {
    1: '🍃 ● ○ ○ ○',
    2: '🍃 ● ● ○ ○',
    3: '🍃 ● ● ● ○',
    4: '🍃 ● ● ● ●',
    5: '🎉 Beres!'
  };

  function openSetupModal(chosenMethod) {
    if (chosenMethod) {
      state.method = chosenMethod;
    }
    
    if (state.name && inputName) inputName.value = state.name;
    if (state.topic && inputTopic) inputTopic.value = state.topic;
    if (state.stage) {
      const radio = document.querySelector(`input[name="research_stage"][value="${state.stage}"]`);
      if (radio) radio.checked = true;
    }
    if (state.methodSure) {
      const radioSure = document.querySelector(`input[name="method_sure"][value="${state.methodSure}"]`);
      if (radioSure) radioSure.checked = true;
    }

    if (modalLoadingState) modalLoadingState.classList.add('hidden');
    if (modalStepsContainer) modalStepsContainer.classList.remove('hidden');

    if (state.isCompleted) {
      goToStep(5);
    } else {
      goToStep(state.currentStep || 1);
    }

    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeSetupModal() {
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function goToStep(stepNum) {
    state.currentStep = stepNum;
    hideAllErrors();

    stepElements.forEach(el => {
      if (parseInt(el.getAttribute('data-step'), 10) === stepNum) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    if (stepNum <= 4) {
      const percent = (stepNum / 4) * 100;
      stepProgressFill.style.width = `${percent}%`;
      stepCountLabel.textContent = `${stepNum} / 4`;
      stepDotsDisplay.textContent = stepDots[stepNum] || '🍃';
      modalFooterNav.style.display = 'flex';
    } else {
      stepProgressFill.style.width = `100%`;
      stepCountLabel.textContent = `Selesai ✨`;
      stepDotsDisplay.textContent = stepDots[5];
      modalFooterNav.style.display = 'none';
      populateConfirmationScreen();
      launchConfetti();
    }

    if (stepNum === 4) {
      const methodName = methodDisplayNames[state.method] || 'Kualitatif';
      modalChosenMethodDisplay.textContent = methodName.toUpperCase();
      checkSureAlert();
    }

    if (stepNum === 1) {
      modalBtnPrev.classList.add('disabled');
      modalBtnPrev.disabled = true;
    } else {
      modalBtnPrev.classList.remove('disabled');
      modalBtnPrev.disabled = false;
    }

    if (stepNum === 4) {
      modalBtnNext.innerHTML = '<span>Lanjut yuk →</span>';
    } else {
      modalBtnNext.innerHTML = '<span>Lanjut yuk →</span>';
    }
  }

  // --- PLAYFUL LOADING TRANSITION TO SUCCESS ---
  function triggerLoadingTransition() {
    if (!modalLoadingState || !modalStepsContainer) {
      goToStep(5);
      return;
    }

    modalStepsContainer.classList.add('hidden');
    modalFooterNav.style.display = 'none';
    modalLoadingState.classList.remove('hidden');

    const loadingTexts = [
      "Bentar, lagi nyari foldernya 🔎",
      "Sebentar, Riset Buddy lagi bongkar folder 📚",
      "Hampir siap...",
      "Beres! ✨"
    ];

    let index = 0;
    loadingDynamicText.textContent = loadingTexts[0];

    const interval = setInterval(() => {
      index++;
      if (index < loadingTexts.length) {
        loadingDynamicText.textContent = loadingTexts[index];
      } else {
        clearInterval(interval);
        setTimeout(() => {
          modalLoadingState.classList.add('hidden');
          modalStepsContainer.classList.remove('hidden');
          goToStep(5);
        }, 400);
      }
    }, 450);
  }

  function validateStep(step) {
    hideAllErrors();
    if (step === 1) {
      const nameVal = inputName.value.trim();
      if (!nameVal) {
        showError('err-step-1');
        inputName.focus();
        return false;
      }
      state.name = nameVal;
      saveStateToLocal();
      return true;
    }

    if (step === 2) {
      const topicVal = inputTopic.value.trim();
      if (!topicVal) {
        showError('err-step-2');
        inputTopic.focus();
        return false;
      }
      state.topic = topicVal;
      saveStateToLocal();
      return true;
    }

    if (step === 3) {
      const checkedStage = document.querySelector('input[name="research_stage"]:checked');
      if (!checkedStage) {
        showError('err-step-3');
        return false;
      }
      state.stage = checkedStage.value;
      saveStateToLocal();
      return true;
    }

    if (step === 4) {
      const checkedSure = document.querySelector('input[name="method_sure"]:checked');
      if (!checkedSure) {
        showError('err-step-4');
        return false;
      }
      state.methodSure = checkedSure.value;
      state.isCompleted = true;
      saveStateToLocal();
      showReturningUserBanner();
      return true;
    }

    return true;
  }

  function populateConfirmationScreen() {
    const methodName = methodDisplayNames[state.method] || 'Kualitatif';
    confUserName.textContent = state.name || 'Mahasiswa';
    confMethodName.textContent = methodName;
    if (confMethodHighlight) confMethodHighlight.textContent = methodName;
    confStageName.textContent = state.stage || 'Sedang Menyusun';
    confTopicName.textContent = state.topic || 'Belum menentukan judul';

    confMethodName.className = 's-val badge-cute-pill';
    if (state.method === 'quantitative') {
      confMethodName.style.background = 'var(--sky-200)';
    } else if (state.method === 'mixedMethods') {
      confMethodName.style.background = 'var(--lavender-200)';
    } else {
      confMethodName.style.background = 'var(--mint-400)';
    }
  }

  function checkSureAlert() {
    const checked = document.querySelector('input[name="method_sure"]:checked');
    if (checked && checked.value === 'unsure') {
      unsureWarningBox.classList.remove('hidden');
    } else {
      unsureWarningBox.classList.add('hidden');
    }
  }

  function showError(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.remove('hidden');
  }

  function hideAllErrors() {
    document.querySelectorAll('.field-error-cute').forEach(el => el.classList.add('hidden'));
  }

  function openChosenDrive() {
    const targetLink = driveLinks[state.method] || driveLinks.startHere;
    window.open(targetLink, '_blank', 'noopener,noreferrer');
    showToast('Membuka Google Drive Research OS... 🚀');
  }

  function showToast(message) {
    if (!toastEl) return;
    toastMessage.textContent = message;
    toastEl.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3200);
  }

  // --- COPY PROMPT HELPER WITH CUTE ANIMATION ---
  async function copyToClipboard(text, triggerBtn) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      showToast('✅ Prompt berhasil disalin!');

      if (triggerBtn) {
        const origHtml = triggerBtn.innerHTML;
        triggerBtn.innerHTML = '<span>✅ Udah dicopy!</span>';
        triggerBtn.style.background = 'var(--mint-400)';
        setTimeout(() => {
          triggerBtn.innerHTML = origHtml;
          triggerBtn.style.background = '';
        }, 2200);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      showToast('Gagal menyalin prompt. Silakan salin manual 😵');
    }
  }

  // --- CUTE CONFETTI CANNON ---
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#4ADE80', '#FEF08A', '#38BDF8', '#C084FC', '#FB923C', '#F472B6'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        r: Math.random() * 6 + 4,
        d: Math.random() * 90,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() * -10) - 4
      });
    }

    let animationFrame;
    let framesCount = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      framesCount++;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2 + p.vy;
        p.x += Math.sin(p.d) * 2 + p.vx;
        p.vy += 0.25; // gravity
        p.vx *= 0.98; // drag

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      if (framesCount < 140) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  // --- ACCORDIONS & FAQ ---
  function initAccordions() {
    const accHeaders = document.querySelectorAll('.accordion-header');
    accHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');
        if (isOpen) {
          item.classList.remove('open');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.querySelectorAll('.btn-direct-link').forEach(link => {
      const linkKey = link.getAttribute('data-link-key');
      if (linkKey && driveLinks[linkKey]) {
        link.setAttribute('href', driveLinks[linkKey]);
      }
    });
  }

  function initFaq() {
    const faqButtons = document.querySelectorAll('.faq-question-cute');
    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item-cute').forEach(i => {
          if (i !== item) {
            i.classList.remove('open');
            i.querySelector('.faq-question-cute').setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function initMobileNav() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const btnMobileStart = document.getElementById('btn-mobile-start');

    if (toggle && drawer) {
      toggle.addEventListener('click', () => {
        drawer.classList.toggle('open');
      });

      mobileLinks.forEach(l => {
        l.addEventListener('click', () => {
          drawer.classList.remove('open');
        });
      });

      if (btnMobileStart) {
        btnMobileStart.addEventListener('click', () => {
          drawer.classList.remove('open');
          openSetupModal('qualitative');
        });
      }
    }
  }

  // --- EVENT BINDINGS ---
  function bindEvents() {
    document.querySelectorAll('.btn-select-method').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chosenMethod = btn.getAttribute('data-method');
        openSetupModal(chosenMethod);
      });
    });

    const heroBtnStart = document.getElementById('hero-btn-start');
    if (heroBtnStart) {
      heroBtnStart.addEventListener('click', () => openSetupModal('qualitative'));
    }

    const btnNavStart = document.getElementById('btn-nav-start');
    if (btnNavStart) {
      btnNavStart.addEventListener('click', () => openSetupModal('qualitative'));
    }

    const btnFinalStart = document.getElementById('btn-final-start');
    if (btnFinalStart) {
      btnFinalStart.addEventListener('click', () => openSetupModal('qualitative'));
    }

    if (modalBtnNext) {
      modalBtnNext.addEventListener('click', () => {
        if (validateStep(state.currentStep)) {
          if (state.currentStep < 4) {
            goToStep(state.currentStep + 1);
          } else if (state.currentStep === 4) {
            triggerLoadingTransition();
          }
        }
      });
    }

    if (modalBtnPrev) {
      modalBtnPrev.addEventListener('click', () => {
        if (state.currentStep > 1) {
          goToStep(state.currentStep - 1);
        }
      });
    }

    if (btnEditAnswers) {
      btnEditAnswers.addEventListener('click', () => {
        goToStep(1);
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeSetupModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeSetupModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
        closeSetupModal();
      }
    });

    if (btnQuickNoTitle && inputTopic) {
      btnQuickNoTitle.addEventListener('click', () => {
        inputTopic.value = 'Belum menentukan judul.';
        inputTopic.focus();
      });
    }

    sureRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        checkSureAlert();
      });
    });

    if (btnOpenDriveFinal) {
      btnOpenDriveFinal.addEventListener('click', openChosenDrive);
    }

    if (btnResumeSetup) {
      btnResumeSetup.addEventListener('click', () => openSetupModal(state.method));
    }
    if (btnResetData) {
      btnResetData.addEventListener('click', resetUserData);
    }

    const btnReadMethodGuide = document.getElementById('btn-read-method-guide-direct');
    if (btnReadMethodGuide) {
      btnReadMethodGuide.addEventListener('click', () => {
        window.open(driveLinks.startHere, '_blank', 'noopener,noreferrer');
      });
    }

    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-copy]');
      if (copyBtn) {
        e.preventDefault();
        const textToCopy = copyBtn.getAttribute('data-copy');
        if (textToCopy) {
          copyToClipboard(textToCopy, copyBtn);
        }
      }
    });
  }

  // --- WA GROUP GUIDANCE MODAL LOGIC (2-STEP VISIT & MINIMIZE) ---
  const WA_MODAL_STORAGE_KEY = 'pku_wa_popup_status';
  let waPopupStep = 1;

  function initWaModal() {
    const waOverlay = document.getElementById('wa-group-modal-overlay');
    const waCard = waOverlay ? waOverlay.querySelector('.wa-modal-card') : null;
    const waStep1 = document.getElementById('wa-popup-step-1');
    const waStep2 = document.getElementById('wa-popup-step-2');

    const btnClose = document.getElementById('wa-modal-btn-close');
    const btnMinimize = document.getElementById('wa-modal-btn-minimize');
    const btnJoin1 = document.getElementById('wa-btn-join-1');
    const btnJoin2 = document.getElementById('wa-btn-join-2');
    const btnSkip1 = document.getElementById('wa-btn-skip-1');
    const btnSkip2 = document.getElementById('wa-btn-skip-2');

    if (!waOverlay || !waStep1 || !waStep2) return;

    // Check if user already completed or dismissed Popup #2 in this session
    const status = sessionStorage.getItem(WA_MODAL_STORAGE_KEY);
    if (status === 'completed' || status === 'dismissed') {
      waOverlay.classList.add('hidden');
      return;
    }

    // Auto-show Popup #1 when user enters the web link
    waPopupStep = 1;
    showStep(1);
    waOverlay.classList.remove('hidden');

    function showStep(step) {
      waPopupStep = step;
      if (step === 1) {
        waStep1.classList.remove('hidden');
        waStep2.classList.add('hidden');
      } else {
        waStep1.classList.add('hidden');
        waStep2.classList.remove('hidden');
        if (waCard) {
          waCard.classList.remove('shake-anim');
          void waCard.offsetWidth; // trigger reflow for animation restart
          waCard.classList.add('shake-anim');
        }
      }
    }

    function handleDismissAttempt() {
      if (waPopupStep === 1) {
        // First skip/minimize/close attempt -> Show Popup #2 before entering web!
        showStep(2);
      } else {
        // Second skip/minimize/close attempt -> Close modal & allow user into web
        sessionStorage.setItem(WA_MODAL_STORAGE_KEY, 'dismissed');
        waOverlay.classList.add('hidden');
      }
    }

    function handleJoinGroup() {
      sessionStorage.setItem(WA_MODAL_STORAGE_KEY, 'completed');
      waOverlay.classList.add('hidden');
    }

    if (btnJoin1) btnJoin1.addEventListener('click', handleJoinGroup);
    if (btnJoin2) btnJoin2.addEventListener('click', handleJoinGroup);

    if (btnSkip1) btnSkip1.addEventListener('click', handleDismissAttempt);
    if (btnSkip2) btnSkip2.addEventListener('click', handleDismissAttempt);

    if (btnClose) btnClose.addEventListener('click', handleDismissAttempt);
    if (btnMinimize) btnMinimize.addEventListener('click', handleDismissAttempt);

    // Overlay background click
    waOverlay.addEventListener('click', (e) => {
      if (e.target === waOverlay) {
        handleDismissAttempt();
      }
    });

    // Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !waOverlay.classList.contains('hidden')) {
        handleDismissAttempt();
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
