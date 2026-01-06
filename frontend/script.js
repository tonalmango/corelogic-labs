// Base URL for API
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';

// ===== Mobile Menu Toggle (Simple & Robust) =====
const initMobileMenu = () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Debug logging
    if (mobileMenuBtn) {
        mobileMenuBtn.style.cursor = 'pointer';
        mobileMenuBtn.style.transition = 'all 0.3s ease';
    }
    
    if (!mobileMenuBtn || !navLinks) {
        return;
    }
    
    // Click handler for menu button
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Click handler for nav links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const header = document.querySelector('header');
        if (header && !header.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

// ===== Form Submission =====
// Form submission with API call
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get selected services
        const servicesSelect = document.getElementById('services');
        const selectedServices = Array.from(servicesSelect.selectedOptions).map(option => option.value);
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            agencyName: document.getElementById('agency').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value || '',
            services: selectedServices.length > 0 ? selectedServices : ['website'],
            budget: document.getElementById('budget').value,
            details: document.getElementById('details').value || ''
        };
        
        console.log('Submitting quote:', formData); // Debug log
        
        // Disable submit button and show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Send data to backend
            console.log('API_BASE_URL:', API_BASE_URL); // Debug URL
            console.log('Posting to:', `${API_BASE_URL}/quotes`); // Debug endpoint
            
            const response = await fetch(`${API_BASE_URL}/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Response status:', response.status); // Debug response
            console.log('Response ok:', response.ok); // Debug ok flag
            
            const data = await response.json();
            console.log('Response data:', data); // Debug full response
            
            if (response.ok) {
                // Show success message
                showNotification('success', data.message || 'Quote request submitted successfully!');
                
                // Reset form
                quoteForm.reset();
                
                // Show confirmation modal (optional)
                showConfirmationModal(data.data.quote);
            } else {
                // Show error message
                showNotification('error', data.message || 'Something went wrong. Please try again.');
                
                // Show validation errors if any
                if (data.errors) {
                    data.errors.forEach(error => {
                        showNotification('error', error.msg);
                    });
                }
            }
        } catch (error) {
            // Error handled - log for debugging
            console.error('Form submission error:', error); // Debug error
            showNotification('error', 'Network error. Please check your connection and try again.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Helper function to show notifications
function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Show confirmation modal with quote details
function showConfirmationModal(quoteData) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-check-circle" style="color: #10b981;"></i> Quote Request Confirmed</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Thank you <strong>${quoteData.name}</strong>!</p>
                <p>Your quote request has been submitted successfully.</p>
                <div class="quote-summary">
                    <h4>Request Summary:</h4>
                    <ul>
                        <li><strong>Agency:</strong> ${quoteData.agencyName}</li>
                        <li><strong>Services:</strong> ${quoteData.services.join(', ')}</li>
                        <li><strong>Budget Range:</strong> ${quoteData.budget}</li>
                        <li><strong>Status:</strong> <span class="status-badge pending">${quoteData.status}</span></li>
                    </ul>
                </div>
                <p>We'll email you at <strong>${quoteData.email}</strong> within 24 hours with your custom quote.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="closeModal">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#closeModal').addEventListener('click', () => modal.remove());
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Add CSS for notifications and modal
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .notification-success {
        background-color: #10b981;
    }
    
    .notification-error {
        background-color: #ef4444;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        margin-left: 15px;
    }
    
    .notification.fade-out {
        animation: slideOut 0.3s ease forwards;
    }
    
    .confirmation-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .modal-content {
        background-color: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        animation: modalFadeIn 0.3s ease;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #64748b;
    }
    
    .quote-summary {
        background-color: #f8fafc;
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
    }
    
    .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .status-badge.pending {
        background-color: #fbbf24;
        color: #92400e;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);