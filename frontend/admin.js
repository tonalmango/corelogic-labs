// Admin Panel Script
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';

// Auth Manager 
const AuthManager = {
    getToken() {
        return localStorage.getItem('authToken');
    },
    
    getUser() {
        const user = localStorage.getItem('authUser');
        return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated() {
        return !!this.getToken();
    },
    
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    }
};

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    // Redirect to home if not authenticated or not admin
    if (!AuthManager.isAuthenticated() || !AuthManager.isAdmin()) {
        window.location.href = 'index.html';
        return;
    }
    
    loadDashboard();
});

// API helper with JWT
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = AuthManager.getToken();
    
    if (!token) {
        window.location.href = 'index.html';
        return null;
    }
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            window.location.href = 'index.html';
            return null;
        }

        const result = await response.json();
        return response.ok ? result : { error: result.message };
    } catch (error) {
        console.error('API error:', error);
        return { error: 'Network error' };
    }
}

// Load dashboard stats
async function loadDashboard() {
    // Load quotes
    const quotesRes = await apiCall('/quotes?limit=10');
    if (quotesRes && quotesRes.data) {
        displayQuotes(quotesRes.data.quotes || quotesRes.data);
    }

    // Load contacts
    const contactsRes = await apiCall('/contacts?limit=10');
    if (contactsRes && contactsRes.data) {
        displayContacts(contactsRes.data.contacts || contactsRes.data);
    }

    // Load user info
    const user = AuthManager.getUser();
    if (user && document.getElementById('user-name')) {
        document.getElementById('user-name').textContent = user.name || user.email;
    }

    if (document.getElementById('last-updated')) {
        document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
}

// Display quotes table
function displayQuotes(quotes) {
    const tbody = document.getElementById('quotes-table-body');
    if (!tbody) return;

    tbody.innerHTML = quotes.map(quote => `
        <tr>
            <td>${quote.name}</td>
            <td>${quote.agencyName}</td>
            <td>${quote.email}</td>
            <td>${quote.services.join(', ')}</td>
            <td><span class="status-badge status-${quote.status}">${quote.status}</span></td>
            <td>
                <button class="btn btn-sm" onclick="editQuote('${quote._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteQuote('${quote._id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Display contacts table
function displayContacts(contacts) {
    const tbody = document.getElementById('contacts-table-body');
    if (!tbody) return;

    tbody.innerHTML = contacts.map(contact => `
        <tr>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.subject}</td>
            <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
            <td>
                <button class="btn btn-sm" onclick="viewContact('${contact._id}')">View</button>
                <button class="btn btn-sm btn-danger" onclick="deleteContact('${contact._id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Edit quote
async function editQuote(id) {
    const status = prompt('Enter new status (pending/contacted/quoted/accepted/rejected):');
    if (!status) return;

    const quoteAmount = prompt('Enter quote amount (optional):');
    const data = { status };
    if (quoteAmount) data.quoteAmount = parseFloat(quoteAmount);

    const res = await apiCall(`/quotes/${id}`, 'PATCH', data);
    if (res && !res.error) {
        alert('Quote updated successfully');
        loadDashboard();
    } else {
        alert('Error updating quote: ' + (res?.error || 'Unknown error'));
    }
}

// Delete quote
async function deleteQuote(id) {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    const res = await apiCall(`/quotes/${id}`, 'DELETE');
    if (res && !res.error) {
        alert('Quote deleted successfully');
        loadDashboard();
    } else {
        alert('Error deleting quote');
    }
}

// View contact details
async function viewContact(id) {
    const res = await apiCall(`/contacts/${id}`);
    if (res && res.data) {
        const contact = res.data.contact;
        alert(`Name: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\nMessage: ${contact.message}\nStatus: ${contact.status}`);
    }
}

// Delete contact
async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    const res = await apiCall(`/contacts/${id}`, 'DELETE');
    if (res && !res.error) {
        alert('Contact deleted successfully');
        loadDashboard();
    } else {
        alert('Error deleting contact');
    }
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

// Auto-refresh dashboard every 30 seconds
if (checkAuth()) {
    loadDashboard();
    setInterval(loadDashboard, 30000);
}
