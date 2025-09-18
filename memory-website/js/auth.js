document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const errorEl = document.getElementById('error');
            const loadingEl = document.getElementById('loading');
            const btnEl = document.getElementById('loginBtn');
            
            hideMessage(errorEl);
            showMessage(loadingEl);
            btnEl.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Check credentials
                const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
                const user = users.find(u => 
                    u.username === username && atob(u.password) === password
                );
                
                if (!user) {
                    throw new Error('Invalid username or password');
                }
                
                // Generate token and store user
                const token = btoa(`${user.id}-${Date.now()}-${Math.random()}`);
                localStorage.setItem('token', token);
                setCurrentUser(user);
                
                // Redirect to memories
                window.location.href = 'memories.html';
                
            } catch (error) {
                hideMessage(loadingEl);
                showMessage(errorEl, error.message);
                btnEl.disabled = false;
            }
        });
    }
});
