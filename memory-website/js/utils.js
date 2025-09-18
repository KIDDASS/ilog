function showMessage(element, message = '') {
    element.classList.remove('hidden');
    if (message) {
        element.textContent = message;
    }
}

function hideMessage(element) {
    element.classList.add('hidden');
}

function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('current_user');
    localStorage.removeItem('token');
}

function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireAdmin() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'memories.html';
        return false;
    }
    return true;
}

// Initialize demo data if not exists
function initializeDemoData() {
    if (!localStorage.getItem('demo_users')) {
        const demoUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@memories.com',
                password: btoa('admin123'),
                role: 'admin',
                can_post: true,
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                username: 'member',
                email: 'member@memories.com',
                password: btoa('member123'),
                role: 'member',
                can_post: true,
                created_at: new Date().toISOString()
            }
        ];
        localStorage.setItem('demo_users', JSON.stringify(demoUsers));
    }

    if (!localStorage.getItem('demo_memories')) {
        const demoMemories = [
            {
                id: 1,
                user_id: 1,
                username: 'admin',
                title: 'Beautiful Sunset',
                description: 'Captured this amazing sunset during my evening walk. Nature never fails to amaze me!',
                image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=800&q=80',
                created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                user_id: 2,
                username: 'member',
                title: 'Coffee Shop Vibes',
                description: 'Perfect morning at my favorite coffee shop. The aroma and atmosphere always inspire me.',
                image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&w=800&q=80',
                created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                user_id: 1,
                username: 'admin',
                title: 'Mountain Adventure',
                description: 'Reached the summit after a challenging hike. The view was absolutely worth it!',
                image_url: 'https://images.unsplash.com/photo-1464822759844-d150baec4c69?ixlib=rb-4.0.3&w=800&q=80',
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            }
        ];
        localStorage.setItem('demo_memories', JSON.stringify(demoMemories));
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 7) {
        return `${days} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}
