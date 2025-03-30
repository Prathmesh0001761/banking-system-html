// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const userDisplay = document.getElementById('user-display');
const logoutButton = document.getElementById('logout-button');
const balanceDisplay = document.getElementById('balance');
const transactionForm = document.getElementById('transaction-form');
const amountInput = document.getElementById('amount');
const depositButton = document.getElementById('deposit-button');
const withdrawButton = document.getElementById('withdraw-button');
const transactionList = document.getElementById('transaction-list');

// Helper Functions
function getUserData(username) {
    const userData = JSON.parse(localStorage.getItem(username)) || { balance: 0, transactions: [] };
    return userData;
}

function saveUserData(username, data) {
    localStorage.setItem(username, JSON.stringify(data));
}

function updateBalance(username) {
    const userData = getUserData(username);
    balanceDisplay.textContent = userData.balance.toFixed(2);
}

function addTransaction(username, type, amount) {
    const userData = getUserData(username);
    const timestamp = new Date().toLocaleString();
    userData.transactions.unshift({ type, amount, timestamp });
    saveUserData(username, userData);

    const transactionItem = document.createElement('li');
    transactionItem.classList.add(
        type === 'Deposit' ? 'transaction-deposit' : 'transaction-withdrawal'
    );
    transactionItem.innerHTML = `
        <span>${type}: $${amount.toFixed(2)}</span>
        <span>${timestamp}</span>
    `;
    transactionList.prepend(transactionItem);
}

function handleTransaction(username, type) {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    const userData = getUserData(username);

    if (type === 'Withdraw' && amount > userData.balance) {
        alert('Insufficient balance.');
        return;
    }

    userData.balance = type === 'Deposit' ? userData.balance + amount : userData.balance - amount;
    saveUserData(username, userData);
    updateBalance(username);
    addTransaction(username, type, amount);
    amountInput.value = '';
}

// Event Listeners
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('currentUser', username);
        userDisplay.textContent = username;

        // Initialize user data if not already present
        if (!localStorage.getItem(username)) {
            saveUserData(username, { balance: 0, transactions: [] });
        }

        // Load user-specific data
        const userData = getUserData(username);
        updateBalance(username);

        // Populate transaction history
        transactionList.innerHTML = '';
        userData.transactions.forEach(({ type, amount, timestamp }) => {
            const transactionItem = document.createElement('li');
            transactionItem.classList.add(
                type === 'Deposit' ? 'transaction-deposit' : 'transaction-withdrawal'
            );
            transactionItem.innerHTML = `
                <span>${type}: $${amount.toFixed(2)}</span>
                <span>${timestamp}</span>
            `;
            transactionList.appendChild(transactionItem);
        });

        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    }
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    usernameInput.value = '';
});

depositButton.addEventListener('click', () => {
    const username = localStorage.getItem('currentUser');
    if (username) handleTransaction(username, 'Deposit');
});

withdrawButton.addEventListener('click', () => {
    const username = localStorage.getItem('currentUser');
    if (username) handleTransaction(username, 'Withdraw');
});

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('currentUser');
    if (username) {
        userDisplay.textContent = username;

        // Load user-specific data
        const userData = getUserData(username);
        updateBalance(username);

        // Populate transaction history
        transactionList.innerHTML = '';
        userData.transactions.forEach(({ type, amount, timestamp }) => {
            const transactionItem = document.createElement('li');
            transactionItem.classList.add(
                type === 'Deposit' ? 'transaction-deposit' : 'transaction-withdrawal'
            );
            transactionItem.innerHTML = `
                <span>${type}: $${amount.toFixed(2)}</span>
                <span>${timestamp}</span>
            `;
            transactionList.appendChild(transactionItem);
        });

        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    }
});