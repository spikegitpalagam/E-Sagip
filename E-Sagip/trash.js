// js/trash.js
// Powers the Trash tab on the superadmin page: lists soft-deleted volunteers/admins,
// lets the superadmin restore them or permanently delete them.

let trashItems = [];

async function loadTrash() {
    const list = document.getElementById('trash-list');
    if (!list) return;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/trash`);
        trashItems = await res.json();
        renderTrash();
    } catch (err) {
        console.error('Failed to load trash:', err);
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Could not load trash</h3>
                <p>Please check your connection and try again.</p>
            </div>`;
    }
}

function renderTrash() {
    const list = document.getElementById('trash-list');
    const countEl = document.getElementById('trash-count');
    if (!list) return;

    if (countEl) {
        countEl.textContent = `${trashItems.length} item${trashItems.length === 1 ? '' : 's'}`;
    }

    if (trashItems.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🗑️</div>
                <h3>Trash is Empty</h3>
                <p>Deleted volunteers and admins will appear here for 90 days before being permanently removed.</p>
            </div>`;
        return;
    }

    list.innerHTML = trashItems.map(item => {
        const deletedDate = new Date(item.deletedAt);
        const daysLeft = 90 - Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
        const typeLabel = item.accountType === 'admin' ? 'Admin' : 'Volunteer';
        const typeBadgeClass = item.accountType === 'admin' ? 'admin' : 'vol';

        return `
            <div class="card trash-card">
                <div class="trash-top">
                    <div class="trash-info">
                        <div class="trash-name-row">
                            <span class="trash-name">${item.name}</span>
                            <span class="status-badge ${typeBadgeClass}">${typeLabel}</span>
                        </div>
                        <div class="trash-meta">${item.email}</div>
                        <div class="trash-meta">Deleted ${deletedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${daysLeft > 0 ? `${daysLeft} days left` : 'Pending purge'}</div>
                    </div>
                </div>
                <div class="trash-actions">
                    <button class="v-approve" onclick="restoreFromTrash('${item.accountType}', ${item.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <polyline points="1 4 1 10 7 10"/>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                        </svg>
                        Restore
                    </button>
                    <button class="v-remove" onclick="purgeFromTrash('${item.accountType}', ${item.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        </svg>
                        Delete Forever
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function restoreFromTrash(accountType, id) {
    if (!confirm('Restore this account? It will become active again.')) return;

    let currentUser = null;
    try { currentUser = JSON.parse(localStorage.getItem('currentUser')); } catch (e) {}

    const endpoint = accountType === 'admin'
        ? `${API_BASE_URL}/auth/admins/${id}/restore`
        : `${API_BASE_URL}/auth/volunteers/${id}/restore`;

    try {
        const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminId: currentUser?.id,
                adminName: currentUser?.name
            })
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Could not restore this account.');
        }

        alert('✅ Account restored successfully.');
        loadTrash();
    } catch (err) {
        console.error('Restore error:', err);
        alert('Failed to restore: ' + err.message);
    }
}

async function purgeFromTrash(accountType, id) {
    if (!confirm('Permanently delete this account? This CANNOT be undone.')) return;

    let currentUser = null;
    try { currentUser = JSON.parse(localStorage.getItem('currentUser')); } catch (e) {}

    const params = new URLSearchParams({
        adminId: currentUser?.id || '',
        adminName: currentUser?.name || ''
    });

    try {
        const res = await fetch(`${API_BASE_URL}/auth/trash/${accountType}/${id}?${params}`, {
            method: 'DELETE'
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Could not permanently delete this account.');
        }

        alert('🗑️ Account permanently deleted.');
        loadTrash();
    } catch (err) {
        console.error('Purge error:', err);
        alert('Failed to delete: ' + err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only load if the trash tab/list actually exists on this page
    if (document.getElementById('trash-list')) {
        loadTrash();
    }
});
