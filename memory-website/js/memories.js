document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    const memoriesContainer = document.getElementById('memoriesContainer');
    const postForm = document.getElementById('postForm');
    const noPermission = document.getElementById('noPermission');
    const userInfo = document.getElementById('userInfo');
    const adminLink = document.getElementById('adminLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginLink = document.getElementById('loginLink');

    // Update navigation
    if (user) {
        userInfo.textContent = `Hello, ${user.username}`;
        logoutBtn.classList.remove('hidden');
        loginLink.classList.add('hidden');
        
        if (user.role === 'admin') {
            adminLink.classList.remove('hidden');
        }
        
        // Show appropriate form
        if (user.can_post) {
            postForm.classList.remove('hidden');
        } else if (user.role !== 'admin') {
            noPermission.classList.remove('hidden');
        }
    } else {
        userInfo.textContent = 'Hello, Guest';
        logoutBtn.classList.add('hidden');
        loginLink.classList.remove('hidden');
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearCurrentUser();
            window.location.href = 'index.html';
        });
    }

    // Post form functionality
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('memoryTitle').value;
            const description = document.getElementById('memoryDescription').value;
            const imageUrl = document.getElementById('memoryImage').value;
            const errorEl = document.getElementById('postError');
            const btnEl = document.getElementById('postBtn');
            
            hideMessage(errorEl);
            btnEl.disabled = true;
            btnEl.textContent = 'Posting...';
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Add new memory
                const memories = JSON.parse(localStorage.getItem('demo_memories') || '[]');
                const newMemory = {
                    id: Date.now(),
                    user_id: user.id,
                    username: user.username,
                    title,
                    description,
                    image_url: imageUrl,
                    created_at: new Date().toISOString()
                };
                
                memories.unshift(newMemory);
                localStorage.setItem('demo_memories', JSON.stringify(memories));
                
                // Reset form
                postForm.reset();
                
                // Reload memories
                loadMemories();
                
            } catch (error) {
                showMessage(errorEl, 'Failed to post memory. Please try again.');
            } finally {
                btnEl.disabled = false;
                btnEl.textContent = 'Share Memory';
            }
        });
    }

    // Load memories
    function loadMemories() {
        const memories = JSON.parse(localStorage.getItem('demo_memories') || '[]');
        
        if (memories.length === 0) {
            memoriesContainer.innerHTML = `
                <div class="memory-card">
                    <div class="memory-content empty-state">
                        <h3>No memories shared yet</h3>
                        <p>Be the first to share a precious moment!</p>
                    </div>
                </div>
            `;
            return;
        }

        memoriesContainer.innerHTML = memories.map(memory => `
            <div class="memory-card">
                <div class="memory-header">
                    <span class="memory-user">@${memory.username}</span>
                </div>
                
                <img 
                    src="${memory.image_url}" 
                    alt="${memory.title}"
                    class="memory-image"
                    onerror="this.src='https://via.placeholder.com/600x400/f0f0f0/999?text=Image+Not+Found'"
                />
                
                <div class="memory-content">
                    <h3 class="memory-title">${memory.title}</h3>
                    ${memory.description ? `<p class="memory-description">${memory.description}</p>` : ''}
                    <p class="memory-date">${formatDate(memory.created_at)}</p>
                </div>
            </div>
        `).join('');
    }

    // Initial load
    loadMemories();
});
