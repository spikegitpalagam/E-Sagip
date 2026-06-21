// js/audit_log.js

let auditEntries = [];
let auditActiveFilter = 'all';
let auditSearchTerm = '';

// Maps each action to a human label, a category (for color-coding), and an icon
const AUDIT_ACTION_META = {
    DEPLOY_OPERATION:   { label: 'Deployed Operation',   category: 'op',    icon: '🚀' },
    COMPLETE_OPERATION: { label: 'Completed Operation',  category: 'op',    icon: '✅' },
    APPROVE_VOLUNTEER:  { label: 'Approved Volunteer',   category: 'vol',   icon: '✓' },
    REMOVE_VOLUNTEER:   { label: 'Removed Volunteer',    category: 'vol',   icon: '🗑' },
    EDIT_VOLUNTEER:     { label: 'Edited Volunteer',     category: 'vol',   icon: '✏️' },
    ADD_ADMIN:          { label: 'Added Admin',          category: 'admin', icon: '➕' },
    EDIT_ADMIN:         { label: 'Edited Admin',         category: 'admin', icon: '✏️' },
    DELETE_ADMIN:       { label: 'Deleted Admin',        category: 'admin', icon: '🗑' },
    PUBLISH_POST:       { label: 'Published Post',       category: 'post',  icon: '📝' },
    EDIT_POST:          { label: 'Edited Post',          category: 'post',  icon: '✏️' },
    DELETE_POST:        { label: 'Deleted Post',         category: 'post',  icon: '🗑' }
};

function getActionMeta(action) {
    return AUDIT_ACTION_META[action] || { label: action, category: 'auth', icon: '•' };
}

async function loadAuditLogs() {
    const list = document.getElementById('audit-list');
    if (!list) return;

    try {
        const res = await fetch(`${API_BASE_URL}/audit`);
        auditEntries = await res.json();
        renderAuditLogs();
    } catch (err) {
        console.error('Failed to load audit logs:', err);
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Could not load audit log</h3>
                <p>Please check your connection and try again.</p>
            </div>`;
    }
}

function renderAuditLogs() {
    const list = document.getElementById('audit-list');
    const countEl = document.getElementById('audit-count');
    if (!list) return;

    const term = auditSearchTerm.toLowerCase();

    const filtered = auditEntries.filter(entry => {
        const matchesAction = auditActiveFilter === 'all' || entry.action === auditActiveFilter;
        const matchesSearch = !term ||
            entry.admin_name.toLowerCase().includes(term) ||
            entry.action.toLowerCase().includes(term) ||
            (entry.target || '').toLowerCase().includes(term);
        return matchesAction && matchesSearch;
    });

    if (countEl) {
        countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'}`;
    }

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No Activity Yet</h3>
                <p>Admin actions will be recorded here automatically.</p>
            </div>`;
        return;
    }

    list.innerHTML = filtered.map(entry => {
        const meta = getActionMeta(entry.action);
        const date = new Date(entry.created_at);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        return `
            <div class="audit-entry">
                <div class="audit-dot ${meta.category}">${meta.icon}</div>
                <div class="audit-body">
                    <div class="audit-action-row">
                        <span class="audit-actor">${entry.admin_name}</span>
                        <span class="audit-badge ${meta.category}">${meta.label}</span>
                    </div>
                    ${entry.target ? `<div class="audit-desc">${entry.target}</div>` : ''}
                    ${entry.details ? `<div class="audit-desc">${entry.details}</div>` : ''}
                    <div class="audit-time">${formattedDate} · ${formattedTime}</div>
                </div>
            </div>
        `;
    }).join('');
}

function setAuditFilter(button, action) {
    document.querySelectorAll('#audit-filter-row .vfilter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    auditActiveFilter = action;
    renderAuditLogs();
}

function filterAuditLogs() {
    const input = document.getElementById('audit-search');
    auditSearchTerm = input ? input.value.trim() : '';
    renderAuditLogs();
}

async function clearAuditLogs() {
    if (!confirm('Permanently clear all audit log entries? This cannot be undone.')) return;

    try {
        const res = await fetch(`${API_BASE_URL}/audit`, { method: 'DELETE' });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Could not clear audit log.');
        }

        auditEntries = [];
        renderAuditLogs();
        alert('✅ Audit log cleared.');
    } catch (err) {
        console.error('Clear audit log error:', err);
        alert('Failed to clear audit log: ' + err.message);
    }
}

// Any other script on this page can call this to record an action.
// Example: logAuditAction('DEPLOY_OPERATION', 'Flood Relief Distribution');
async function logAuditAction(action, target = null, details = null) {
    let currentUser = null;
    try { currentUser = JSON.parse(localStorage.getItem('currentUser')); } catch (e) {}

    if (!currentUser) return;

    try {
        await fetch(`${API_BASE_URL}/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminId: currentUser.id,
                adminName: currentUser.name,
                action,
                target,
                details
            })
        });
    } catch (err) {
        console.error('Failed to log audit action:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadAuditLogs);
