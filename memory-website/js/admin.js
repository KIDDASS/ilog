document.addEventListener('DOMContentLoaded', function() {
    // Check admin access
    if (!requireAuth() || !requireAdmin()) {
        return;
    }

    const user = getCurrentUser();
    const userInfo = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    const usersTableBody = document.getElementById('usersTableBody');
    const errorEl = document.getElementById('error');
    const successEl = document.getElementById('success');

    // Update navigation
    userInfo.textContent = `Hello, ${user.username}`;
    
    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        clearCurrentUser();
        window.location.href = 'index.html';
    });

    // Load users
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
        
        if (users.length === 0) {
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No users found</td>
                </tr>
            `;
            return;
        }

        usersTableBody.innerHTML = users.map(userItem => `
            <tr>
                <td>${userItem.username}</td>
                <td>${userItem.email}</td>
                <td>
                    <span class="role-badge role-${userItem.role}">
                        ${userItem.role}
                    </span>
                </td>
                <td>
                    <span class="permission-status permission-${userItem.can_post ? 'yes' : 'no'}">
                        ${userItem.can_post ? '✓' : '✗'}
                    </span>
                </td>
                <td>
                    ${userItem.role !== 'admin' ? `
                        <button 
                            class="action-btn ${userItem.can_post ? 'btn-revoke' : 'btn-grant'}"
                            onclick="togglePermission(${userItem.id}, ${userItem.can_post})"
                        >
                            ${userItem.can_post ? 'Revoke' : 'Grant'}
                        </button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    }

    // Toggle permission function
    window.togglePermission = async function(userId, currentPermission) {
        hideMessage(errorEl);
        hideMessage(successEl);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update user permission
            const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                users[userIndex].can_post = !currentPermission;
                localStorage.setItem('demo_users', JSON.stringify(users));
                
                showMessage(successEl, 'User permissions updated successfully');
                loadUsers();
                
                // Hide success message after 3 seconds
                setTimeout(() => hideMessage(successEl), 3000);
            } else {
                throw new Error('User not found');
            }
            
        } catch (error) {
            showMessage(errorEl, error.message || 'Failed to update permissions');
        }
    };

    // Initial load
    loadUsers();
});