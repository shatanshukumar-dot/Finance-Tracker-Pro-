// Application Data with enhanced structure - UPDATED
const appData = {
  user: {
    name: "Shatanshu",
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0
  },
  accounts: [
    { id: "acc1", name: "Paytm Wallet", type: "wallet", balance: 0, currency: "INR" },
    { id: "acc2", name: "Cash", type: "cash", balance: 0, currency: "INR" }
  ],
  transactions: [],
  categories: [
    { id: "cat0", name: "Other", type: "expense", color: "#e0e0e0", budget: 0, spent: 0, icon: "📝" },
    { id: "cat1", name: "Food & Dining", type: "expense", color: "#ffecd2", budget: 0, spent: 0, icon: "🍽️" },
    { id: "cat2", name: "Transportation", type: "expense", color: "#a1c4fd", budget: 0, spent: 0, icon: "🚌" },
    { id: "cat3", name: "Education", type: "expense", color: "#4facfe", budget: 0, spent: 0, icon: "📚" },
    { id: "cat4", name: "Housing", type: "expense", color: "#11998e", budget: 0, spent: 0, icon: "🏠" },
    { id: "cat5", name: "Entertainment", type: "expense", color: "#a8edea", budget: 0, spent: 0, icon: "🎬" },
    { id: "cat6", name: "Healthcare", type: "expense", color: "#f093fb", budget: 0, spent: 0, icon: "⚕️" },
    { id: "cat7", name: "Friends", type: "expense", color: "#667eea", budget: 0, spent: 0, icon: "👥" },
    { id: "cat8", name: "Consulting", type: "income", color: "#11998e", target: 0, earned: 0, icon: "💼" },
    { id: "cat9", name: "Family Support", type: "income", color: "#4facfe", target: 0, earned: 0, icon: "👨‍👩‍👧‍👦" },
    { id: "cat10", name: "Freelance", type: "income", color: "#667eea", target: 0, earned: 0, icon: "💻" }
  ],
  goals: [],
  documents: [], // Bills storage
  notifications: [
    { id: "notif1", message: "Simplified PIN flow is now active!", type: "security", read: false, timestamp: "2024-09-30T11:39:00Z" },
    { id: "notif2", message: "Bills scanning feature has been restored", type: "feature", read: false, timestamp: "2024-09-30T11:39:00Z" },
    { id: "notif3", message: "Scan bills and add as transactions seamlessly!", type: "success", read: false, timestamp: "2024-09-30T11:39:00Z" }
  ],
  insights: [],
  greetings: [
    "Hi Shatanshu!",
    "Hey Shatanshu!",
    "What's up Shatanshu!",
    "Hello Shatanshu!",
    "Good day Shatanshu!",
    "Namaste Shatanshu!",
    "Hey there Shatanshu!"
  ],
  settings: {
    theme: 'light',
    authMethod: 'pin',
    biometricEnabled: false,
    autoLockTimeout: 0,
    requireReAuth: true
  }
};

// Application State
let currentView = 'dashboard';
let currentTheme = 'light';
let charts = {};
let currentEditingGoal = null;
let currentEditingBudget = null;
let currentEditingTransaction = null;
let deleteCallback = null;
let isAuthenticated = false;
let currentPin = "";
let currentCameraStream = null;
let currentBillBlob = null;
let currentBillId = null;

// Initialize App - SIMPLIFIED PIN AUTHENTICATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    
    try {
        // Load data first
        loadData();
        
        // Initialize theme
        initTheme();
        
        // Check authentication requirements
        checkAuthenticationRequired();
        
        console.log('App initialization complete');
    } catch (error) {
        console.error('App initialization error:', error);
        showAuthenticationScreen();
    }
});

// SIMPLIFIED PIN AUTHENTICATION SYSTEM
function checkAuthenticationRequired() {
    console.log('Checking authentication requirements...');
    
    const userPin = localStorage.getItem('userPin');
    
    if (!userPin) {
        // First time - show PIN setup
        showPinSetup();
    } else {
        // PIN exists - show PIN login
        showPinLogin();
    }
}

function showPinSetup() {
    console.log('Showing PIN setup (first time)...');
    
    const authScreen = document.getElementById('authScreen');
    const setupPrompt = document.getElementById('setupPrompt');
    
    if (authScreen && setupPrompt) {
        authScreen.classList.remove('hidden');
        
        setupPrompt.innerHTML = `
            <div class="setup-icon">🔐</div>
            <h3>Create Your 6-Digit PIN</h3>
            <p>Set up your secure 6-digit PIN to protect your finance data</p>
            
            <div class="pin-setup-form">
                <div class="form-group">
                    <label for="newPin">Enter 6-digit PIN:</label>
                    <input type="password" id="newPin" placeholder="Enter 6 digits" maxlength="6" inputmode="numeric" autocomplete="new-password">
                </div>
                
                <div class="form-group">
                    <label for="confirmPin">Confirm PIN:</label>
                    <input type="password" id="confirmPin" placeholder="Confirm PIN" maxlength="6" inputmode="numeric" autocomplete="new-password">
                </div>
                
                <div class="pin-setup-actions">
                    <button class="btn btn--primary" id="savePinBtn">Create PIN</button>
                </div>
            </div>
        `;
        
        setupPrompt.classList.remove('hidden');
        
        setTimeout(() => {
            const savePinBtn = document.getElementById('savePinBtn');
            const newPinInput = document.getElementById('newPin');
            
            if (savePinBtn) {
                savePinBtn.addEventListener('click', savePIN);
            }
            
            // Focus on first input
            if (newPinInput) {
                newPinInput.focus();
            }
        }, 100);
    }
}

function showPinLogin() {
    console.log('Showing PIN login...');
    
    const authScreen = document.getElementById('authScreen');
    const pinLogin = document.getElementById('pinLogin');
    
    if (authScreen && pinLogin) {
        authScreen.classList.remove('hidden');
        pinLogin.classList.remove('hidden');
        
        // Reset PIN input
        currentPin = "";
        updatePinDisplay();
        
        setTimeout(() => {
            setupPinKeypad();
        }, 100);
    }
}

function savePIN() {
    const newPin = document.getElementById('newPin');
    const confirmPin = document.getElementById('confirmPin');
    
    if (!newPin || !confirmPin) return;
    
    const pin1 = newPin.value;
    const pin2 = confirmPin.value;
    
    if (pin1.length !== 6 || !/^\d{6}$/.test(pin1)) {
        showNotification('PIN must be exactly 6 digits', 'error');
        return;
    }
    
    if (pin1 !== pin2) {
        showNotification('PINs do not match', 'error');
        return;
    }
    
    // Save PIN
    localStorage.setItem('userPin', pin1);
    
    showNotification('PIN created successfully!', 'success');
    
    // Show main app after brief delay
    setTimeout(() => {
        showMainApplication();
    }, 1000);
}

function setupPinKeypad() {
    const keypad = document.getElementById('pinKeypad');
    if (!keypad) return;
    
    keypad.innerHTML = `
        <button class="pin-key" data-digit="1">1</button>
        <button class="pin-key" data-digit="2">2</button>
        <button class="pin-key" data-digit="3">3</button>
        <button class="pin-key" data-digit="4">4</button>
        <button class="pin-key" data-digit="5">5</button>
        <button class="pin-key" data-digit="6">6</button>
        <button class="pin-key" data-digit="7">7</button>
        <button class="pin-key" data-digit="8">8</button>
        <button class="pin-key" data-digit="9">9</button>
        <button class="pin-key"></button>
        <button class="pin-key" data-digit="0">0</button>
        <button class="pin-key delete-key" data-action="delete">⌫</button>
    `;
    
    // Add event listeners
    keypad.querySelectorAll('.pin-key').forEach(key => {
        key.addEventListener('click', handlePinKeyPress);
    });
}

function handlePinKeyPress(event) {
    const digit = event.target.getAttribute('data-digit');
    const action = event.target.getAttribute('data-action');
    
    if (digit && currentPin.length < 6) {
        currentPin += digit;
        updatePinDisplay();
        
        if (currentPin.length === 6) {
            verifyPin();
        }
    } else if (action === 'delete' && currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        updatePinDisplay();
        hideError();
    }
}

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function verifyPin() {
    const savedPin = localStorage.getItem('userPin');
    
    if (currentPin === savedPin) {
        showNotification('Welcome back!', 'success');
        setTimeout(() => {
            showMainApplication();
        }, 500);
    } else {
        showError();
        currentPin = "";
        updatePinDisplay();
    }
}

function showError() {
    const errorEl = document.getElementById('pinError');
    if (errorEl) {
        errorEl.classList.remove('hidden');
    }
}

function hideError() {
    const errorEl = document.getElementById('pinError');
    if (errorEl) {
        errorEl.classList.add('hidden');
    }
}

function showAuthenticationScreen() {
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (authScreen) {
        authScreen.classList.remove('hidden');
    }
    if (appContainer) {
        appContainer.classList.add('hidden');
    }
}

function showMainApplication() {
    console.log('Transitioning to main application...');
    
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (authScreen) {
        authScreen.classList.add('hidden');
    }
    if (appContainer) {
        appContainer.classList.remove('hidden');
    }
    
    isAuthenticated = true;
    
    // Initialize main app functionality
    setTimeout(() => {
        initializeMainApp();
    }, 100);
}

// Main Application Initialization
function initializeMainApp() {
    console.log('Initializing main application...');
    
    try {
        // Set up navigation
        initNavigation();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update displays
        updateAllDisplays();
        
        // Set random greeting
        setRandomGreeting();
        
        // Initialize dashboard
        showView('dashboard');
        
        console.log('Main application initialized successfully');
    } catch (error) {
        console.error('Main app initialization error:', error);
    }
}

// Data Persistence
function saveData() {
    try {
        localStorage.setItem('financeAppData', JSON.stringify(appData));
        console.log('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function loadData() {
    try {
        const saved = localStorage.getItem('financeAppData');
        if (saved) {
            const loadedData = JSON.parse(saved);
            Object.assign(appData, loadedData);
            console.log('Data loaded successfully');
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    applyTheme(currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    console.log('Theme toggle clicked');
    
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    showNotification(`Switched to ${currentTheme} mode`, 'success');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    document.body.setAttribute('data-theme', theme);
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Navigation System
function initNavigation() {
    console.log('Initializing navigation...');
    const navItems = document.querySelectorAll('.nav-item');
    console.log('Found nav items:', navItems.length);
    
    navItems.forEach(item => {
        // Remove existing listeners
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
    });
    
    // Add fresh event listeners
    const newNavItems = document.querySelectorAll('.nav-item');
    newNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const viewName = this.getAttribute('data-view');
            console.log('Navigation clicked:', viewName);
            
            // Remove active from all nav items
            newNavItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked item
            this.classList.add('active');
            
            // Show corresponding view
            showView(viewName);
        });
    });
    
    console.log('Navigation initialized successfully');
}

function showView(viewId) {
    console.log('Showing view:', viewId);
    
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
    });
    
    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';
        console.log(`View ${viewId} is now active and visible`);
    } else {
        console.error('View not found:', viewId);
        return;
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === viewId) {
            item.classList.add('active');
        }
    });
    
    currentView = viewId;
    
    // Load view-specific content
    switch(viewId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'budget':
            loadBudget();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'goals':
            loadGoals();
            break;
        case 'bills':
            loadBills();
            break;
    }
}

// Event Listeners Setup
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Notification panel
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotificationPanel = document.getElementById('closeNotificationPanel');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleNotificationPanel();
            markNotificationsAsRead();
        });
    }
    
    if (closeNotificationPanel) {
        closeNotificationPanel.addEventListener('click', () => {
            notificationPanel.classList.remove('active');
        });
    }

    // Quick actions
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const addIncomeBtn = document.getElementById('addIncomeBtn');
    const transferBtn = document.getElementById('transferBtn');
    
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => openTransactionModal('expense'));
    }
    if (addIncomeBtn) {
        addIncomeBtn.addEventListener('click', () => openTransactionModal('income'));
    }
    if (transferBtn) {
        transferBtn.addEventListener('click', openSplitModal);
    }

    // Navigation helpers
    const manageBudgetBtn = document.getElementById('manageBudgetBtn');
    const viewAllTransactions = document.getElementById('viewAllTransactions');
    const setBudgetsBtn = document.getElementById('setBudgetsBtn');
    
    if (manageBudgetBtn) {
        manageBudgetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showView('budget');
        });
    }
    if (viewAllTransactions) {
        viewAllTransactions.addEventListener('click', (e) => {
            e.preventDefault();
            showView('transactions');
        });
    }
    if (setBudgetsBtn) {
        setBudgetsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showView('budget');
        });
    }

    // Bills scanning
    const scanBillBtn = document.getElementById('scanBillBtn');
    if (scanBillBtn) {
        scanBillBtn.addEventListener('click', startBillScanning);
    }

    // Modal controls
    setupModalControls();

    // Form submissions
    setupFormHandlers();

    // Additional event handlers
    setupAdditionalEventListeners();
    
    // Close panels when clicking outside
    setupOutsideClickHandlers();
}

function setupOutsideClickHandlers() {
    document.addEventListener('click', (e) => {
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationBtn = document.getElementById('notificationBtn');
        
        // Close notification panel when clicking outside
        if (notificationPanel && !notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationPanel.classList.remove('active');
        }
    });
}

function setupModalControls() {
    // Transaction modal
    const closeModal = document.getElementById('closeModal');
    const cancelTransaction = document.getElementById('cancelTransaction');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeTransactionModal);
    }
    if (cancelTransaction) {
        cancelTransaction.addEventListener('click', closeTransactionModal);
    }
    
    // Goal modal
    const closeGoalModal = document.getElementById('closeGoalModal');
    const cancelGoal = document.getElementById('cancelGoal');
    
    if (closeGoalModal) {
        closeGoalModal.addEventListener('click', closeGoalModal_);
    }
    if (cancelGoal) {
        cancelGoal.addEventListener('click', closeGoalModal_);
    }
    
    // Budget modal
    const closeBudgetModal = document.getElementById('closeBudgetModal');
    const cancelBudget = document.getElementById('cancelBudget');
    
    if (closeBudgetModal) {
        closeBudgetModal.addEventListener('click', closeBudgetModal_);
    }
    if (cancelBudget) {
        cancelBudget.addEventListener('click', closeBudgetModal_);
    }
    
    // Split modal
    const closeSplitModal = document.getElementById('closeSplitModal');
    const cancelSplit = document.getElementById('cancelSplit');
    
    if (closeSplitModal) {
        closeSplitModal.addEventListener('click', closeSplitModal_);
    }
    if (cancelSplit) {
        cancelSplit.addEventListener('click', closeSplitModal_);
    }
    
    // Delete modal
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');
    
    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', closeDeleteModal_);
    }
    if (cancelDelete) {
        cancelDelete.addEventListener('click', closeDeleteModal_);
    }
    if (confirmDelete) {
        confirmDelete.addEventListener('click', () => {
            if (deleteCallback) {
                deleteCallback();
                deleteCallback = null;
            }
            closeDeleteModal_();
        });
    }

    // Bill scanning modal
    const closeBillScan = document.getElementById('closeBillScan');
    const cancelScanBtn = document.getElementById('cancelScanBtn');
    const captureBillBtn = document.getElementById('captureBillBtn');
    const saveBillBtn = document.getElementById('saveBillBtn');
    const retakeBillBtn = document.getElementById('retakeBillBtn');
    
    if (closeBillScan) {
        closeBillScan.addEventListener('click', closeBillScanModal);
    }
    if (cancelScanBtn) {
        cancelScanBtn.addEventListener('click', closeBillScanModal);
    }
    if (captureBillBtn) {
        captureBillBtn.addEventListener('click', captureBill);
    }
    if (saveBillBtn) {
        saveBillBtn.addEventListener('click', saveBill);
    }
    if (retakeBillBtn) {
        retakeBillBtn.addEventListener('click', retakeBill);
    }

    // Bill fullscreen modal
    const closeBillFullscreen = document.getElementById('closeBillFullscreen');
    const addBillAsTransaction = document.getElementById('addBillAsTransaction');
    const deleteBillBtn = document.getElementById('deleteBillBtn');
    
    if (closeBillFullscreen) {
        closeBillFullscreen.addEventListener('click', closeBillFullscreenModal);
    }
    if (addBillAsTransaction) {
        addBillAsTransaction.addEventListener('click', () => {
            if (currentBillId) {
                addBillAsTransactionPrompt(currentBillId);
            }
        });
    }
    if (deleteBillBtn) {
        deleteBillBtn.addEventListener('click', () => {
            if (currentBillId) {
                deleteBill(currentBillId);
                closeBillFullscreenModal();
            }
        });
    }
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

function setupFormHandlers() {
    // Transaction form
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionSubmit);
    }
    
    // Transaction type change
    const transactionType = document.getElementById('transactionType');
    if (transactionType) {
        transactionType.addEventListener('change', handleTransactionTypeChange);
    }

    // Goal form
    const goalForm = document.getElementById('goalForm');
    if (goalForm) {
        goalForm.addEventListener('submit', handleGoalSubmit);
    }

    // Budget form
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
        budgetForm.addEventListener('submit', handleBudgetSubmit);
    }

    // Split calculator
    const splitAmount = document.getElementById('splitAmount');
    const splitPeople = document.getElementById('splitPeople');
    const addSplitExpense = document.getElementById('addSplitExpense');
    
    if (splitAmount) {
        splitAmount.addEventListener('input', calculateSplit);
    }
    if (splitPeople) {
        splitPeople.addEventListener('input', calculateSplit);
    }
    if (addSplitExpense) {
        addSplitExpense.addEventListener('click', addSplitAsExpense);
    }
}

function setupAdditionalEventListeners() {
    // Transaction filters
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const monthFilter = document.getElementById('monthFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', displayAllTransactions);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', displayAllTransactions);
    }
    if (monthFilter) {
        monthFilter.addEventListener('change', displayAllTransactions);
    }
    
    // Chart period change
    const chartPeriod = document.getElementById('chartPeriod');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', updateSpendingChart);
    }

    // Analytics type change
    const analyticsType = document.getElementById('analyticsType');
    if (analyticsType) {
        analyticsType.addEventListener('change', function(e) {
            console.log('Analytics type changed to:', e.target.value);
            updateAnalyticsChart(e.target.value);
        });
    }
    
    // Add buttons
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const addGoalBtn = document.getElementById('addGoalBtn');
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', () => openTransactionModal());
    }
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => openGoalModal());
    }
    if (addBudgetBtn) {
        addBudgetBtn.addEventListener('click', () => showAllBudgetCategories());
    }
}

// BILLS SCANNING FEATURE - NEW FUNCTIONALITY
function startBillScanning() {
    console.log('Starting bill scanning...');
    
    if (!navigator.mediaDevices) {
        showNotification('Camera not supported on this device', 'error');
        return;
    }
    
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment', // Rear camera for documents
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        }
    }).then(stream => {
        showBillScanModal(stream);
    }).catch(error => {
        console.error('Camera access error:', error);
        showNotification('Please allow camera access to scan bills', 'error');
    });
}

function showBillScanModal(stream) {
    const modal = document.getElementById('billScanModal');
    const video = document.getElementById('billVideo');
    
    if (modal && video) {
        modal.classList.remove('hidden');
        video.srcObject = stream;
        currentCameraStream = stream;
        
        // Reset modal state
        const scanControls = modal.querySelector('.scan-controls');
        const billPreview = document.getElementById('billPreview');
        const scanArea = modal.querySelector('.scan-area');
        
        if (scanControls) scanControls.style.display = 'flex';
        if (billPreview) billPreview.classList.add('hidden');
        if (scanArea) scanArea.style.display = 'block';
        if (video) video.style.display = 'block';
    }
}

function captureBill() {
    const video = document.getElementById('billVideo');
    const canvas = document.getElementById('billCanvas');
    const preview = document.getElementById('billPreview');
    const billImage = document.getElementById('capturedBillImage');
    
    if (!video || !canvas || !preview || !billImage) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Capture current frame
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // Convert to blob and show preview
    canvas.toBlob(blob => {
        const imageUrl = URL.createObjectURL(blob);
        billImage.src = imageUrl;
        
        // Hide video and controls, show preview
        video.style.display = 'none';
        document.querySelector('.scan-controls').style.display = 'none';
        document.querySelector('.scan-area').style.display = 'none';
        preview.classList.remove('hidden');
        
        // Store for saving
        currentBillBlob = blob;
    }, 'image/jpeg', 0.9);
}

function retakeBill() {
    const video = document.getElementById('billVideo');
    const preview = document.getElementById('billPreview');
    const scanArea = document.querySelector('.scan-area');
    const scanControls = document.querySelector('.scan-controls');
    
    if (video) video.style.display = 'block';
    if (scanArea) scanArea.style.display = 'block';
    if (scanControls) scanControls.style.display = 'flex';
    if (preview) preview.classList.add('hidden');
    
    currentBillBlob = null;
}

function saveBill() {
    if (!currentBillBlob) {
        showNotification('No bill captured', 'error');
        return;
    }
    
    const billId = generateId();
    const bill = {
        id: billId,
        timestamp: new Date().toISOString(),
        size: currentBillBlob.size,
        type: 'bill'
    };
    
    // Save to app data
    if (!appData.documents) appData.documents = [];
    appData.documents.push(bill);
    
    // Save image to localStorage
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            localStorage.setItem(`bill_${billId}`, e.target.result);
            saveData();
            
            closeBillScanModal();
            showNotification('Bill saved successfully!', 'success');
            
            // Update bills view if currently active
            if (currentView === 'bills') {
                loadBills();
            }
            
            // Ask to add as transaction after short delay
            setTimeout(() => {
                askToAddTransaction(billId);
            }, 800);
            
        } catch (error) {
            console.error('Error saving bill:', error);
            if (error.name === 'QuotaExceededError') {
                showNotification('Storage full. Please delete some old bills.', 'error');
            } else {
                showNotification('Error saving bill. Please try again.', 'error');
            }
        }
    };
    
    reader.readAsDataURL(currentBillBlob);
}

function closeBillScanModal() {
    const modal = document.getElementById('billScanModal');
    
    if (modal) {
        modal.classList.add('hidden');
    }
    
    if (currentCameraStream) {
        currentCameraStream.getTracks().forEach(track => track.stop());
        currentCameraStream = null;
    }
    
    currentBillBlob = null;
}

function askToAddTransaction(billId) {
    const shouldAdd = confirm('📝 Would you like to add this bill as a transaction?');
    
    if (shouldAdd) {
        addBillAsTransactionPrompt(billId);
    }
}

function addBillAsTransactionPrompt(billId) {
    // Ask for basic bill info
    const amount = prompt('💰 Enter the bill amount:');
    const vendor = prompt('🏪 Enter vendor/store name (optional):') || 'Bill Payment';
    
    if (amount && !isNaN(parseFloat(amount))) {
        // Pre-fill transaction modal with bill data
        openTransactionModal('expense');
        
        setTimeout(() => {
            document.getElementById('transactionAmount').value = parseFloat(amount);
            document.getElementById('expenseName').value = vendor;
            document.getElementById('transactionDescription').value = `Bill scanned on ${formatDate(new Date().toISOString())}`;
        }, 100);
    }
}

function viewBillFullscreen(billId) {
    const imageData = localStorage.getItem(`bill_${billId}`);
    if (imageData) {
        const modal = document.getElementById('billFullscreenModal');
        const fullscreenImage = document.getElementById('fullscreenBillImage');
        
        if (modal && fullscreenImage) {
            fullscreenImage.src = imageData;
            modal.classList.remove('hidden');
            currentBillId = billId;
        }
    } else {
        showNotification('Bill image not found', 'error');
    }
}

function closeBillFullscreenModal() {
    const modal = document.getElementById('billFullscreenModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    currentBillId = null;
}

function deleteBill(billId) {
    const bill = appData.documents.find(d => d.id === billId);
    if (!bill) return;
    
    if (confirm('🗑️ Delete this bill? This action cannot be undone.')) {
        // Remove from documents
        appData.documents = appData.documents.filter(d => d.id !== billId);
        
        // Remove image from localStorage
        localStorage.removeItem(`bill_${billId}`);
        
        saveData();
        
        if (currentView === 'bills') {
            loadBills();
        }
        
        showNotification('Bill deleted successfully', 'success');
    }
}

// View Loading Functions
function loadDashboard() {
    console.log('Loading dashboard...');
    updateBalanceCards();
    loadBudgetProgress();
    loadRecentTransactions();
    setTimeout(() => {
        if (!charts.spending) {
            setupSpendingChart();
        }
    }, 100);
}

function loadTransactions() {
    console.log('Loading transactions...');
    populateTransactionFilters();
    populateMonthFilter();
    displayAllTransactions();
}

function loadBudget() {
    console.log('Loading budget...');
    updateBudgetSummary();
    displayBudgetCategories();
}

function loadAnalytics() {
    console.log('Loading analytics...');
    updateAnalyticsStats();
    displayInsights();
    setTimeout(() => {
        const analyticsType = document.getElementById('analyticsType');
        const selectedType = analyticsType ? analyticsType.value : 'spending';
        updateAnalyticsChart(selectedType);
    }, 100);
}

function loadGoals() {
    console.log('Loading goals...');
    displayGoals();
}

function loadBills() {
    console.log('Loading bills...');
    updateBillsStats();
    displayBills();
}

// Bills View Management - NEW
function updateBillsStats() {
    const totalBills = document.getElementById('totalBills');
    const monthlyBills = document.getElementById('monthlyBills');
    
    const totalCount = appData.documents ? appData.documents.length : 0;
    
    // Count bills from this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyCount = appData.documents ? appData.documents.filter(bill => {
        const billDate = new Date(bill.timestamp);
        return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
    }).length : 0;
    
    if (totalBills) {
        totalBills.textContent = totalCount;
    }
    if (monthlyBills) {
        monthlyBills.textContent = monthlyCount;
    }
}

function displayBills() {
    const billsList = document.getElementById('billsList');
    if (!billsList) return;
    
    if (!appData.documents || appData.documents.length === 0) {
        billsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📄</div>
                <h3>No Bills Scanned Yet</h3>
                <p>Scan your first bill to keep track of your receipts</p>
                <button class="btn btn--primary" onclick="startBillScanning()">
                    📷 Scan First Bill
                </button>
            </div>
        `;
        return;
    }
    
    // Sort bills by date (newest first)
    const sortedBills = [...appData.documents].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    const billsHTML = sortedBills.map(bill => {
        const imageData = localStorage.getItem(`bill_${bill.id}`);
        const fileSize = ((bill.size || 0) / 1024).toFixed(1);
        
        return `
            <div class="bill-item">
                <div class="bill-preview">
                    ${imageData ? 
                        `<img src="${imageData}" alt="Bill" class="bill-thumbnail" onclick="viewBillFullscreen('${bill.id}')">` : 
                        `<div class="bill-placeholder">📄</div>`
                    }
                </div>
                <div class="bill-info">
                    <div class="bill-date">${formatDate(bill.timestamp)}</div>
                    <div class="bill-size">${fileSize} KB</div>
                    <div class="bill-actions">
                        <button class="btn btn-small btn--primary" onclick="viewBillFullscreen('${bill.id}')" title="View Full Size">
                            👁️ View
                        </button>
                        <button class="btn btn-small btn--secondary" onclick="addBillAsTransactionPrompt('${bill.id}')" title="Add as Transaction">
                            ➕ Add
                        </button>
                        <button class="btn btn-small btn-danger" onclick="deleteBill('${bill.id}')" title="Delete Bill">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    billsList.innerHTML = billsHTML;
}

// Update Functions
function updateAllDisplays() {
    updateBalanceCards();
    updateNotificationBadge();
    loadNotifications();
    populateFormDropdowns();
}

function updateBalanceCards() {
    // Calculate totals
    appData.user.totalBalance = appData.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    // Calculate monthly totals
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = appData.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
    
    appData.user.monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    appData.user.monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    appData.user.savingsRate = appData.user.monthlyIncome > 0 
        ? ((appData.user.monthlyIncome - appData.user.monthlyExpenses) / appData.user.monthlyIncome * 100)
        : 0;

    // Update display
    const totalBalance = document.getElementById('totalBalance');
    const balanceChange = document.getElementById('balanceChange');
    const monthlyIncome = document.getElementById('monthlyIncome');
    const monthlyExpenses = document.getElementById('monthlyExpenses');

    if (totalBalance) {
        totalBalance.textContent = `₹${appData.user.totalBalance.toLocaleString()}`;
    }

    if (balanceChange) {
        if (appData.transactions.length === 0) {
            balanceChange.textContent = 'Start your journey!';
            balanceChange.className = 'balance-change positive';
        } else {
            const change = appData.user.monthlyIncome - appData.user.monthlyExpenses;
            balanceChange.textContent = `${change >= 0 ? '+' : ''}₹${change.toLocaleString()} this month`;
            balanceChange.className = `balance-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
    }

    if (monthlyIncome) {
        monthlyIncome.textContent = `₹${appData.user.monthlyIncome.toLocaleString()}`;
    }

    if (monthlyExpenses) {
        monthlyExpenses.textContent = `₹${appData.user.monthlyExpenses.toLocaleString()}`;
    }
}

function loadBudgetProgress() {
    const container = document.getElementById('budgetProgress');
    if (!container) return;
    
    const expenseCategories = appData.categories.filter(cat => cat.type === 'expense' && cat.budget > 0);
    
    if (expenseCategories.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Set your budgets to start tracking!</p>
                <button class="btn btn--primary btn--sm" onclick="showView('budget')">Set Budgets</button>
            </div>
        `;
        return;
    }

    container.innerHTML = expenseCategories.map(category => {
        const percentage = Math.min((category.spent / category.budget) * 100, 100);
        const isOverBudget = category.spent > category.budget;
        const status = isOverBudget ? 'over' : 'on-track';
        const progressClass = isOverBudget ? 'over-budget' : '';
        
        return `
            <div class="budget-item">
                <div class="budget-info">
                    <div class="budget-category">
                        <span class="category-icon">${category.icon}</span>
                        <span class="category-name">${category.name}</span>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-amounts">
                            <span class="spent-amount">₹${category.spent.toLocaleString()}</span>
                            <span class="budget-amount">₹${category.budget.toLocaleString()}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${progressClass}" style="width: ${percentage}%"></div>
                        </div>
                        <div class="budget-status ${status}">
                            ${isOverBudget ? `Over by ₹${(category.spent - category.budget).toLocaleString()}` : `${(100 - percentage).toFixed(0)}% remaining`}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    if (!container) return;
    
    if (appData.transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No transactions yet. Start by adding your first transaction!</p>
            </div>
        `;
        return;
    }

    const recentTransactions = appData.transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    container.innerHTML = recentTransactions.map(transaction => {
        const category = appData.categories.find(cat => cat.name === transaction.category);
        const account = appData.accounts.find(acc => acc.id === transaction.account);
        const sign = transaction.type === 'expense' ? '-' : '+';
        
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-category">
                        <span class="category-icon">${category?.icon || '💰'}</span>
                        <span class="transaction-description">${transaction.description || 'Transaction'}</span>
                    </div>
                    ${transaction.name ? `<div class="transaction-name">${transaction.name}</div>` : ''}
                    <div class="transaction-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount">
                    <div class="amount-value ${transaction.type}">${sign}₹${transaction.amount.toLocaleString()}</div>
                    <div class="transaction-account">${account?.name || 'Unknown'}</div>
                </div>
            </div>
        `;
    }).join('');
}

function populateTransactionFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    const categories = [...new Set(appData.transactions.map(t => t.category))];
    
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function populateMonthFilter() {
    const monthFilter = document.getElementById('monthFilter');
    if (!monthFilter) return;
    
    const months = [...new Set(appData.transactions.map(t => {
        const date = new Date(t.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))].sort().reverse();
    
    monthFilter.innerHTML = '<option value="">All Months</option>' +
        months.map(month => {
            const [year, monthNum] = month.split('-');
            const date = new Date(year, monthNum - 1);
            const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            return `<option value="${month}">${monthName}</option>`;
        }).join('');
}

function displayAllTransactions() {
    const container = document.getElementById('allTransactions');
    const categoryTotalEl = document.getElementById('categoryTotal');
    const totalLabelEl = document.getElementById('totalLabel');
    const totalAmountEl = document.getElementById('totalAmount');
    
    if (!container) return;
    
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const monthFilter = document.getElementById('monthFilter');
    
    const categoryValue = categoryFilter ? categoryFilter.value : '';
    const typeValue = typeFilter ? typeFilter.value : '';
    const monthValue = monthFilter ? monthFilter.value : '';
    
    let filteredTransactions = appData.transactions;
    
    if (categoryValue) {
        filteredTransactions = filteredTransactions.filter(t => t.category === categoryValue);
    }
    
    if (typeValue) {
        filteredTransactions = filteredTransactions.filter(t => t.type === typeValue);
    }
    
    if (monthValue) {
        filteredTransactions = filteredTransactions.filter(t => {
            const date = new Date(t.date);
            const transactionMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return transactionMonth === monthValue;
        });
    }
    
    if (filteredTransactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No transactions to show. Add your first transaction to get started!</p>
            </div>
        `;
        if (categoryTotalEl) categoryTotalEl.classList.add('hidden');
        return;
    }

    // Calculate total for selected filters
    if ((categoryValue || monthValue) && totalLabelEl && totalAmountEl && categoryTotalEl) {
        const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
        const isIncome = filteredTransactions.length > 0 && filteredTransactions[0].type === 'income';
        
        let label = 'Total';
        if (categoryValue) label += ` ${categoryValue}`;
        if (monthValue) {
            const [year, monthNum] = monthValue.split('-');
            const date = new Date(year, monthNum - 1);
            const monthName = date.toLocaleDateString('en-US', { month: 'long' });
            label += ` ${monthName}`;
        }
        label += isIncome ? ' Income:' : ' Spending:';
        
        totalLabelEl.textContent = label;
        totalAmountEl.textContent = `₹${total.toLocaleString()}`;
        categoryTotalEl.classList.remove('hidden');
    } else {
        if (categoryTotalEl) categoryTotalEl.classList.add('hidden');
    }

    const sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedTransactions.map(transaction => {
        const category = appData.categories.find(cat => cat.name === transaction.category);
        const account = appData.accounts.find(acc => acc.id === transaction.account);
        const sign = transaction.type === 'expense' ? '-' : '+';
        
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-category">
                        <span class="category-icon">${category?.icon || '💰'}</span>
                        <span class="transaction-description">${transaction.description || 'Transaction'}</span>
                    </div>
                    ${transaction.name ? `<div class="transaction-name">${transaction.name}</div>` : ''}
                    <div class="transaction-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount">
                    <div class="amount-value ${transaction.type}">${sign}₹${transaction.amount.toLocaleString()}</div>
                    <div class="transaction-account">${account?.name || 'Unknown'}</div>
                    <div style="display: flex; gap: var(--space-4);">
                        <button class="transaction-edit" onclick="editTransaction('${transaction.id}')" title="Edit Transaction">✏️</button>
                        <button class="transaction-delete" onclick="confirmDeleteTransaction('${transaction.id}')" title="Delete Transaction">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateBudgetSummary() {
    const budgetSummary = document.getElementById('budgetSummary');
    const budgetProgressFill = document.getElementById('budgetProgressFill');
    const budgetUsageText = document.getElementById('budgetUsageText');

    const totalBudget = appData.categories
        .filter(cat => cat.type === 'expense')
        .reduce((sum, cat) => sum + cat.budget, 0);

    const totalSpent = appData.categories
        .filter(cat => cat.type === 'expense')
        .reduce((sum, cat) => sum + cat.spent, 0);

    if (budgetSummary) {
        budgetSummary.textContent = `₹${totalSpent.toLocaleString()} / ₹${totalBudget.toLocaleString()}`;
    }

    if (budgetProgressFill) {
        const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
        budgetProgressFill.style.width = `${percentage}%`;
        budgetProgressFill.className = totalSpent > totalBudget ? 'progress-fill over-budget' : 'progress-fill';
    }

    if (budgetUsageText) {
        if (totalBudget === 0) {
            budgetUsageText.textContent = 'Set your budgets to start tracking';
        } else {
            const percentage = (totalSpent / totalBudget * 100).toFixed(0);
            budgetUsageText.textContent = `${percentage}% of budget used`;
        }
    }
}

function displayBudgetCategories() {
    const container = document.getElementById('budgetCategories');
    if (!container) return;
    
    const expenseCategories = appData.categories.filter(cat => cat.type === 'expense');
    
    container.innerHTML = expenseCategories.map(category => {
        const percentage = category.budget > 0 ? Math.min((category.spent / category.budget) * 100, 100) : 0;
        const isOverBudget = category.spent > category.budget;
        const progressClass = isOverBudget ? 'over-budget' : '';
        
        return `
            <div class="budget-category-item">
                <div class="budget-info">
                    <div class="budget-category">
                        <span class="category-icon">${category.icon}</span>
                        <span class="category-name">${category.name}</span>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-amounts">
                            <span class="spent-amount">₹${category.spent.toLocaleString()}</span>
                            <span class="budget-amount">of ₹${category.budget.toLocaleString()}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${progressClass}" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
                <button class="budget-edit-btn" onclick="openBudgetModal('${category.id}')">Edit</button>
            </div>
        `;
    }).join('');
}

function showAllBudgetCategories() {
    const container = document.getElementById('budgetCategories');
    if (!container) return;
    
    const expenseCategories = appData.categories.filter(cat => cat.type === 'expense');
    
    container.innerHTML = expenseCategories.map(category => `
        <div class="budget-category-item">
            <div class="budget-info">
                <div class="budget-category">
                    <span class="category-icon">${category.icon}</span>
                    <span class="category-name">${category.name}</span>
                </div>
                <div class="budget-progress">
                    <div class="budget-amounts">
                        <span class="spent-amount">₹${category.spent.toLocaleString()}</span>
                        <span class="budget-amount">Budget: ₹${category.budget.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <button class="budget-edit-btn" onclick="openBudgetModal('${category.id}')">Set Budget</button>
        </div>
    `).join('');
}

function updateAnalyticsStats() {
    const avgDailySpending = document.getElementById('avgDailySpending');
    const spendingChange = document.getElementById('spendingChange');
    const savingsRate = document.getElementById('savingsRate');
    const savingsChange = document.getElementById('savingsChange');

    if (appData.transactions.length === 0) {
        if (avgDailySpending) avgDailySpending.textContent = '₹0';
        if (spendingChange) spendingChange.textContent = 'No data yet';
        if (savingsRate) savingsRate.textContent = '0%';
        if (savingsChange) savingsChange.textContent = 'Start saving today!';
        return;
    }

    // Calculate average daily spending
    const expenses = appData.transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const daysWithExpenses = new Set(expenses.map(t => t.date)).size || 1;
    const avgDaily = totalExpenses / daysWithExpenses;

    // Calculate savings rate
    const totalIncome = appData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const rate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    if (avgDailySpending) {
        avgDailySpending.textContent = `₹${Math.round(avgDaily).toLocaleString()}`;
    }
    if (spendingChange) {
        spendingChange.textContent = expenses.length > 0 ? 'Track for trends' : 'No expenses yet';
        spendingChange.className = 'stat-change';
    }
    if (savingsRate) {
        savingsRate.textContent = `${Math.max(0, rate).toFixed(0)}%`;
    }
    if (savingsChange) {
        savingsChange.textContent = rate > 0 ? 'Great job saving!' : 'Start building your savings!';
        savingsChange.className = `stat-change ${rate > 0 ? 'positive' : ''}`;
    }
}

function displayInsights() {
    const container = document.getElementById('insightsList');
    if (!container) return;

    if (appData.transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Add some transactions to get personalized insights!</p>
            </div>
        `;
        return;
    }

    const insights = generateInsights();
    
    if (insights.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Keep using the app to get more insights!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = insights.map(insight => `
        <div class="insight-item ${insight.severity}">
            <div class="insight-message">${insight.message}</div>
            <div class="insight-action">${insight.action}</div>
        </div>
    `).join('');
}

function generateInsights() {
    const insights = [];
    
    // Check for overspending
    appData.categories.filter(cat => cat.type === 'expense' && cat.budget > 0).forEach(category => {
        if (category.spent > category.budget) {
            insights.push({
                type: 'overspending',
                message: `You've exceeded your ${category.name} budget by ₹${(category.spent - category.budget).toLocaleString()}`,
                severity: 'warning',
                action: 'Consider reducing expenses in this category'
            });
        }
    });

    // Check savings rate
    const totalIncome = appData.user.monthlyIncome;
    const totalExpenses = appData.user.monthlyExpenses;
    if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100);
        if (savingsRate > 20) {
            insights.push({
                type: 'savings',
                message: `Excellent! You're saving ${savingsRate.toFixed(0)}% of your income`,
                severity: 'positive',
                action: 'Keep up the great work with your savings!'
            });
        } else if (savingsRate > 0) {
            insights.push({
                type: 'savings',
                message: `You're saving ${savingsRate.toFixed(0)}% of your income`,
                severity: 'info',
                action: 'Try to increase your savings rate to 20% or more'
            });
        }
    }

    return insights;
}

function displayGoals() {
    const container = document.getElementById('goalsGrid');
    if (!container) return;
    
    if (appData.goals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No savings goals yet. Create your first goal to start saving!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = appData.goals.map(goal => {
        const percentage = (goal.currentAmount / goal.targetAmount * 100).toFixed(0);
        const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="goal-card">
                <div class="goal-actions">
                    <button class="goal-action-btn" onclick="openGoalModal('${goal.id}')">✏️</button>
                    <button class="goal-action-btn delete" onclick="confirmDeleteGoal('${goal.id}')">🗑️</button>
                </div>
                <div class="goal-header">
                    <div class="goal-info">
                        <h4>${goal.name}</h4>
                        <div class="goal-category">${goal.category || 'Personal'}</div>
                    </div>
                    <div class="goal-priority ${goal.priority}">${goal.priority}</div>
                </div>
                <div class="goal-progress">
                    <div class="goal-amounts">
                        <span class="current-amount">₹${goal.currentAmount.toLocaleString()}</span>
                        <span class="target-amount">₹${goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="goal-percentage">${percentage}% completed</div>
                </div>
                <div class="goal-deadline">${daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</div>
            </div>
        `;
    }).join('');
}

// Chart Functions
function setupSpendingChart() {
    const ctx = document.getElementById('spendingChart');
    if (!ctx) return;
    
    try {
        const expenseCategories = appData.categories.filter(cat => cat.type === 'expense' && cat.spent > 0);
        
        if (expenseCategories.length === 0) {
            ctx.parentElement.innerHTML = '<div class="empty-state"><p>No expenses to show yet</p></div>';
            return;
        }

        if (charts.spending) {
            charts.spending.destroy();
        }

        charts.spending = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: expenseCategories.map(cat => cat.name),
                datasets: [{
                    data: expenseCategories.map(cat => cat.spent),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: 12 }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    } catch (error) {
        console.error('Error setting up spending chart:', error);
    }
}

function updateSpendingChart() {
    setupSpendingChart();
}

function updateAnalyticsChart(type = 'spending') {
    console.log('Updating analytics chart for type:', type);
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;

    if (charts.analytics) {
        charts.analytics.destroy();
    }

    try {
        let chartData;
        let chartConfig;

        switch (type) {
            case 'income':
                chartData = getIncomeAnalysisData();
                chartConfig = createIncomeChart(chartData);
                break;
            case 'trends':
                chartData = getTrendsData();
                chartConfig = createTrendsChart(chartData);
                break;
            case 'spending':
            default:
                chartData = getSpendingAnalysisData();
                chartConfig = createSpendingChart(chartData);
                break;
        }

        charts.analytics = new Chart(ctx, chartConfig);
        console.log(`Analytics chart updated for ${type}`);
    } catch (error) {
        console.error('Error setting up analytics chart:', error);
    }
}

function getSpendingAnalysisData() {
    const expenseCategories = appData.categories.filter(cat => cat.type === 'expense' && cat.spent > 0);
    if (expenseCategories.length === 0) {
        return {
            labels: ['Food & Dining', 'Transportation', 'Entertainment'],
            data: [0, 0, 0]
        };
    }
    return {
        labels: expenseCategories.map(cat => cat.name),
        data: expenseCategories.map(cat => cat.spent)
    };
}

function getIncomeAnalysisData() {
    const incomeCategories = appData.categories.filter(cat => cat.type === 'income' && cat.earned > 0);
    if (incomeCategories.length === 0) {
        return {
            labels: ['Consulting', 'Family Support', 'Freelance'],
            data: [0, 0, 0]
        };
    }
    return {
        labels: incomeCategories.map(cat => cat.name),
        data: incomeCategories.map(cat => cat.earned)
    };
}

function getTrendsData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const income = [0, 0, 0, 0, 0, 0];
    const expenses = [0, 0, 0, 0, 0, 0];
    
    return { labels: months, income, expenses };
}

function createSpendingChart(data) {
    return {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Spending by Category',
                data: data.data,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Spending Analysis'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: function(value) { return '₹' + value.toLocaleString(); }}
                }
            }
        }
    };
}

function createIncomeChart(data) {
    return {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Income Sources',
                data: data.data,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Income Analysis'
                }
            },
            cutout: '50%'
        }
    };
}

function createTrendsChart(data) {
    return {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Income',
                data: data.income,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Expenses',
                data: data.expenses,
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: 'Income vs Expenses Trends'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { callback: function(value) { return '₹' + value.toLocaleString(); }}
                }
            }
        }
    };
}

// Modal Functions
function openTransactionModal(type = 'expense', prefillData = null) {
    const modal = document.getElementById('transactionModal');
    const transactionType = document.getElementById('transactionType');
    const modalTitle = document.getElementById('modalTitle');
    const today = new Date().toISOString().split('T')[0];
    
    // Reset form first
    const form = document.getElementById('transactionForm');
    if (form) {
        form.reset();
    }
    
    // Set current date
    document.getElementById('transactionDate').value = today;
    
    if (transactionType) {
        transactionType.value = type;
    }
    if (modalTitle) {
        modalTitle.textContent = prefillData ? 'Edit Transaction' : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
    
    // Pre-fill data if editing or from bill
    if (prefillData) {
        setTimeout(() => {
            if (prefillData.amount) document.getElementById('transactionAmount').value = prefillData.amount;
            if (prefillData.name) document.getElementById('expenseName').value = prefillData.name;
            if (prefillData.description) document.getElementById('transactionDescription').value = prefillData.description;
            if (prefillData.category) document.getElementById('transactionCategory').value = prefillData.category;
            if (prefillData.account) document.getElementById('transactionAccount').value = prefillData.account;
            if (prefillData.date) document.getElementById('transactionDate').value = prefillData.date;
        }, 100);
    }
    
    // Update categories AFTER setting type
    setTimeout(() => {
        updateCategoryOptions(type);
        handleTransactionTypeChange();
    }, 50);
    
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeTransactionModal() {
    const modal = document.getElementById('transactionModal');
    const form = document.getElementById('transactionForm');
    
    if (modal) {
        modal.classList.add('hidden');
    }
    if (form) {
        form.reset();
        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
    }
    
    currentEditingTransaction = null;
}

function openGoalModal(goalId = null) {
    const modal = document.getElementById('goalModal');
    const modalTitle = document.getElementById('goalModalTitle');
    const form = document.getElementById('goalForm');
    
    currentEditingGoal = goalId;
    
    if (goalId) {
        const goal = appData.goals.find(g => g.id === goalId);
        if (goal) {
            document.getElementById('goalName').value = goal.name;
            document.getElementById('goalTarget').value = goal.targetAmount;
            document.getElementById('goalCurrent').value = goal.currentAmount;
            document.getElementById('goalDate').value = goal.targetDate;
            document.getElementById('goalPriority').value = goal.priority;
            modalTitle.textContent = 'Edit Goal';
        }
    } else {
        form.reset();
        modalTitle.textContent = 'Add Savings Goal';
        // Set default date to 6 months from now
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        document.getElementById('goalDate').value = sixMonthsFromNow.toISOString().split('T')[0];
    }
    
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeGoalModal_() {
    const modal = document.getElementById('goalModal');
    const form = document.getElementById('goalForm');
    
    currentEditingGoal = null;
    
    if (modal) {
        modal.classList.add('hidden');
    }
    if (form) {
        form.reset();
    }
}

function openBudgetModal(categoryId = null) {
    const modal = document.getElementById('budgetModal');
    const form = document.getElementById('budgetForm');
    
    currentEditingBudget = categoryId;
    
    if (categoryId) {
        const category = appData.categories.find(c => c.id === categoryId);
        if (category) {
            document.getElementById('budgetCategory').value = category.name;
            document.getElementById('budgetAmount').value = category.budget || '';
        }
    } else {
        form.reset();
    }
    
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeBudgetModal_() {
    const modal = document.getElementById('budgetModal');
    const form = document.getElementById('budgetForm');
    
    currentEditingBudget = null;
    
    if (modal) {
        modal.classList.add('hidden');
    }
    if (form) {
        form.reset();
    }
}

function openSplitModal() {
    const modal = document.getElementById('splitModal');
    const form = modal.querySelector('.split-calculator');
    
    if (form) {
        form.querySelector('#splitAmount').value = '';
        form.querySelector('#splitPeople').value = '2';
        form.querySelector('#splitResult').textContent = '0';
    }
    
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeSplitModal_() {
    const modal = document.getElementById('splitModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function openDeleteModal(message, callback) {
    const modal = document.getElementById('deleteModal');
    const messageEl = document.getElementById('deleteMessage');
    
    if (messageEl) {
        messageEl.textContent = message;
    }
    
    deleteCallback = callback;
    
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeDeleteModal_() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    deleteCallback = null;
}

// Form Handlers
function populateFormDropdowns() {
    // Populate accounts dropdown
    const accountSelect = document.getElementById('transactionAccount');
    if (accountSelect) {
        accountSelect.innerHTML = appData.accounts.map(account => 
            `<option value="${account.id}">${account.name}</option>`
        ).join('');
    }
    
    // Initialize with expense categories
    updateCategoryOptions('expense');
}

function updateCategoryOptions(type) {
    const categorySelect = document.getElementById('transactionCategory');
    if (!categorySelect) return;
    
    console.log('Updating categories for type:', type);
    
    const filteredCategories = appData.categories.filter(cat => cat.type === type);
    console.log('Filtered categories:', filteredCategories);
    
    // Clear existing options
    categorySelect.innerHTML = '';
    
    // Add new options
    filteredCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = `${category.icon} ${category.name}`;
        categorySelect.appendChild(option);
    });
    
    // Set default to first option
    if (filteredCategories.length > 0) {
        categorySelect.selectedIndex = 0;
    }
    
    console.log('Categories updated, selected:', categorySelect.value);
}

function handleTransactionTypeChange() {
    const transactionType = document.getElementById('transactionType');
    const expenseNameGroup = document.getElementById('expenseNameGroup');
    
    if (transactionType && expenseNameGroup) {
        if (transactionType.value === 'expense') {
            expenseNameGroup.classList.add('visible');
        } else {
            expenseNameGroup.classList.remove('visible');
        }
    }
    
    if (transactionType) {
        updateCategoryOptions(transactionType.value);
    }
}

function handleTransactionSubmit(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    const categoryValue = document.getElementById('transactionCategory').value;
    console.log('Selected category:', categoryValue);
    
    const transactionData = {
        type: document.getElementById('transactionType').value,
        amount: amount,
        category: categoryValue,
        name: document.getElementById('expenseName').value || null,
        description: document.getElementById('transactionDescription').value || 'Transaction',
        account: document.getElementById('transactionAccount').value,
        date: document.getElementById('transactionDate').value
    };
    
    if (currentEditingTransaction) {
        // Update existing transaction
        const transactionIndex = appData.transactions.findIndex(t => t.id === currentEditingTransaction);
        if (transactionIndex !== -1) {
            const oldTransaction = appData.transactions[transactionIndex];
            
            // Reverse old transaction effects
            reverseCategoryAmounts(oldTransaction);
            reverseAccountBalance(oldTransaction);
            
            // Update transaction
            appData.transactions[transactionIndex] = { ...oldTransaction, ...transactionData };
            
            // Apply new transaction effects
            updateCategoryAmounts(appData.transactions[transactionIndex]);
            updateAccountBalance(appData.transactions[transactionIndex]);
            
            showNotification('Transaction updated successfully!', 'success');
        }
    } else {
        // Create new transaction
        const transaction = {
            id: 't' + Date.now(),
            ...transactionData
        };
        
        console.log('Creating transaction:', transaction);
        
        // Add to data
        appData.transactions.unshift(transaction);
        
        // Update category amounts
        updateCategoryAmounts(transaction);
        
        // Update account balance
        updateAccountBalance(transaction);
        
        showNotification('Transaction added successfully!', 'success');
    }
    
    // Save data
    saveData();
    
    // Close modal and refresh views
    closeTransactionModal();
    
    // Refresh current view
    updateAllDisplays();
    if (currentView === 'dashboard') {
        loadDashboard();
    } else if (currentView === 'transactions') {
        loadTransactions();
    }
}

function handleGoalSubmit(e) {
    e.preventDefault();
    
    const goalData = {
        name: document.getElementById('goalName').value,
        targetAmount: parseFloat(document.getElementById('goalTarget').value),
        currentAmount: parseFloat(document.getElementById('goalCurrent').value) || 0,
        targetDate: document.getElementById('goalDate').value,
        priority: document.getElementById('goalPriority').value
    };
    
    if (currentEditingGoal) {
        // Update existing goal
        const goalIndex = appData.goals.findIndex(g => g.id === currentEditingGoal);
        if (goalIndex !== -1) {
            appData.goals[goalIndex] = { ...appData.goals[goalIndex], ...goalData };
        }
    } else {
        // Create new goal
        const goal = {
            id: 'goal' + Date.now(),
            category: 'Personal',
            ...goalData
        };
        appData.goals.push(goal);
    }
    
    saveData();
    closeGoalModal_();
    
    if (currentView === 'goals') {
        loadGoals();
    }
    
    showNotification(currentEditingGoal ? 'Goal updated successfully!' : 'Goal created successfully!', 'success');
}

function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const budgetAmount = parseFloat(document.getElementById('budgetAmount').value) || 0;
    
    if (currentEditingBudget) {
        const category = appData.categories.find(c => c.id === currentEditingBudget);
        if (category) {
            category.budget = budgetAmount;
        }
    }
    
    saveData();
    closeBudgetModal_();
    
    updateAllDisplays();
    if (currentView === 'budget') {
        loadBudget();
    } else if (currentView === 'dashboard') {
        loadBudgetProgress();
    }
    
    showNotification('Budget updated successfully!', 'success');
}

function updateCategoryAmounts(transaction) {
    const category = appData.categories.find(cat => cat.name === transaction.category);
    if (category) {
        if (transaction.type === 'expense') {
            category.spent += transaction.amount;
        } else {
            category.earned = (category.earned || 0) + transaction.amount;
        }
    }
}

function reverseCategoryAmounts(transaction) {
    const category = appData.categories.find(cat => cat.name === transaction.category);
    if (category) {
        if (transaction.type === 'expense') {
            category.spent = Math.max(0, category.spent - transaction.amount);
        } else {
            category.earned = Math.max(0, (category.earned || 0) - transaction.amount);
        }
    }
}

function updateAccountBalance(transaction) {
    const account = appData.accounts.find(acc => acc.id === transaction.account);
    if (account) {
        if (transaction.type === 'expense') {
            account.balance -= transaction.amount;
        } else {
            account.balance += transaction.amount;
        }
    }
}

function reverseAccountBalance(transaction) {
    const account = appData.accounts.find(acc => acc.id === transaction.account);
    if (account) {
        if (transaction.type === 'expense') {
            account.balance += transaction.amount;
        } else {
            account.balance -= transaction.amount;
        }
    }
}

// Edit and Delete Functions - PRESERVED AND ENHANCED
function editTransaction(transactionId) {
    const transaction = appData.transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    currentEditingTransaction = transactionId;
    
    const prefillData = {
        amount: transaction.amount,
        name: transaction.name,
        description: transaction.description,
        category: transaction.category,
        account: transaction.account,
        date: transaction.date
    };
    
    openTransactionModal(transaction.type, prefillData);
}

function confirmDeleteTransaction(transactionId) {
    const transaction = appData.transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const message = `Delete transaction: ${transaction.description || 'Transaction'} (₹${transaction.amount.toLocaleString()})?`;
    
    openDeleteModal(message, () => {
        deleteTransaction(transactionId);
    });
}

function deleteTransaction(transactionId) {
    const transactionIndex = appData.transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex === -1) return;
    
    const transaction = appData.transactions[transactionIndex];
    
    // Reverse category amounts
    reverseCategoryAmounts(transaction);
    
    // Reverse account balance
    reverseAccountBalance(transaction);
    
    // Remove transaction
    appData.transactions.splice(transactionIndex, 1);
    
    saveData();
    updateAllDisplays();
    
    if (currentView === 'transactions') {
        displayAllTransactions();
    } else if (currentView === 'dashboard') {
        loadDashboard();
    }
    
    showNotification('Transaction deleted successfully!', 'success');
}

function confirmDeleteGoal(goalId) {
    const goal = appData.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const message = `Delete goal: ${goal.name}?`;
    
    openDeleteModal(message, () => {
        deleteGoal(goalId);
    });
}

function deleteGoal(goalId) {
    appData.goals = appData.goals.filter(g => g.id !== goalId);
    saveData();
    loadGoals();
    showNotification('Goal deleted successfully!', 'success');
}

// Split Calculator
function calculateSplit() {
    const amount = parseFloat(document.getElementById('splitAmount').value) || 0;
    const people = parseInt(document.getElementById('splitPeople').value) || 2;
    const result = amount / people;
    
    const resultElement = document.getElementById('splitResult');
    if (resultElement) {
        resultElement.textContent = result.toFixed(2);
    }
}

function addSplitAsExpense() {
    const amount = parseFloat(document.getElementById('splitAmount').value);
    const people = parseInt(document.getElementById('splitPeople').value);
    
    if (amount && people) {
        const splitAmount = amount / people;
        
        closeSplitModal_();
        openTransactionModal('expense');
        
        // Pre-fill transaction modal with split amount
        setTimeout(() => {
            document.getElementById('transactionAmount').value = splitAmount.toFixed(2);
            document.getElementById('transactionDescription').value = `Split expense (${people} people)`;
        }, 100);
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function setRandomGreeting() {
    const greetingElement = document.getElementById('greeting');
    
    if (greetingElement) {
        const randomGreeting = appData.greetings[Math.floor(Math.random() * appData.greetings.length)];
        greetingElement.textContent = randomGreeting;
    }
}

function toggleNotificationPanel() {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) {
        notificationPanel.classList.toggle('active');
    }
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    const unreadCount = appData.notifications.filter(n => !n.read).length;
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function markNotificationsAsRead() {
    appData.notifications.forEach(notification => {
        notification.read = true;
    });
    updateNotificationBadge();
    saveData();
}

function loadNotifications() {
    const container = document.getElementById('notificationList');
    if (!container) return;
    
    if (appData.notifications.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No notifications</p></div>';
        return;
    }

    container.innerHTML = appData.notifications.map(notification => `
        <div class="notification-item ${notification.type}">
            <div class="notification-content">
                <h4>${getNotificationTitle(notification.type)}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${formatDate(notification.timestamp.split('T')[0])}</span>
            </div>
        </div>
    `).join('');
}

function getNotificationTitle(type) {
    const titles = {
        'info': 'Information',
        'tip': 'Tip',
        'warning': 'Warning',
        'success': 'Success',
        'feature': 'New Feature',
        'security': 'Security'
    };
    return titles[type] || 'Notification';
}

function showNotification(message, type = 'info') {
    // Create and show a temporary notification
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Global functions for onclick handlers
window.showView = showView;
window.openGoalModal = openGoalModal;
window.confirmDeleteGoal = confirmDeleteGoal;
window.deleteGoal = deleteGoal;
window.openBudgetModal = openBudgetModal;
window.confirmDeleteTransaction = confirmDeleteTransaction;
window.deleteTransaction = deleteTransaction;
window.editTransaction = editTransaction;
window.startBillScanning = startBillScanning;
window.viewBillFullscreen = viewBillFullscreen;
window.addBillAsTransactionPrompt = addBillAsTransactionPrompt;
window.deleteBill = deleteBill;