// Admin Panel Script
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');

// Check if user is authenticated
function checkAuth() {
    if (!authToken) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// API helper with auth
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    };

    if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return null;
        }

        const result = await response.json();
        return response.ok ? result : { error: result.message };
    } catch (error) {
        // API error - silent in production
        return { error: 'Network error' };
    }
}

// Load dashboard stats
async function loadDashboard() {
    if (!checkAuth()) return;

    // Load quote stats
    const quoteStatsRes = await apiCall('/quotes/stats');
    if (quoteStatsRes && quoteStatsRes.data) {
        const stats = quoteStatsRes.data.summary;
        document.getElementById('total-quotes').textContent = stats.totalQuotes || 0;
        
        const pending = stats.statusCounts?.find(s => s.status === 'pending')?.count || 0;
        document.getElementById('pending-quotes').textContent = pending;
        
        document.getElementById('total-revenue').textContent = '$' + (stats.totalQuoteAmount || 0).toLocaleString();
    }

    // Load quotes
    const quotesRes = await apiCall('/quotes?limit=10');
    if (quotesRes && quotesRes.data) {
        displayQuotes(quotesRes.data.quotes);
    }

    // Load contacts
    const contactsRes = await apiCall('/contacts?limit=10');
    if (contactsRes && contactsRes.data) {
        displayContacts(contactsRes.data.contacts);
    }

    // Load user info
    const userRes = await apiCall('/auth/me');
    if (userRes && userRes.data) {
        document.getElementById('user-name').textContent = userRes.data.user.name;
    }

    document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
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
