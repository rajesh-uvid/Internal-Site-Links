// Check if already logged in
if (sessionStorage.getItem("auth") === "true") {
    window.location.replace("dashboard.html");
}

const loginForm = {
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.getElementById('login-btn'),
    errorMsg: document.getElementById('error-msg'),

    init() {
        // Init Theme
        this.initTheme();

        this.loginBtn.addEventListener('click', () => this.handleLogin());

        // Allow Enter key to submit
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // Clear error on input
        this.usernameInput.addEventListener('input', () => this.hideError());
        this.passwordInput.addEventListener('input', () => this.hideError());
    },

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const target = current === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', target);
                localStorage.setItem('theme', target);
                this.updateThemeIcon(target);
            });
        }
    },

    updateThemeIcon(theme) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        if (theme === 'dark') {
            btn.innerHTML = `
                <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>`;
        } else {
            btn.innerHTML = `
                <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>`;
        }
    },

    async hashPassword(str) {
        const buf = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    },

    showError(msg) {
        this.errorMsg.innerText = msg;
        this.errorMsg.style.display = 'block';
        this.loginBtn.disabled = false;
        this.loginBtn.innerText = 'Login';
    },

    hideError() {
        this.errorMsg.style.display = 'none';
    },

    async handleLogin() {
        const userIn = this.usernameInput.value.trim();
        const passIn = this.passwordInput.value;

        if (!userIn || !passIn) {
            this.showError("Please enter both username and password");
            return;
        }

        this.loginBtn.disabled = true;
        this.loginBtn.innerText = 'Verifying...';
        this.hideError();

        try {
            // Fetch the users.json file
            // In a real app, never expose user hashes to the client!
            const response = await fetch('config/users.json');

            if (!response.ok) {
                throw new Error("Config not found");
            }

            const users = await response.json();

            if (users[userIn]) {
                const hashedInput = await this.hashPassword(passIn);

                if (hashedInput === users[userIn]) {
                    // Success!
                    sessionStorage.setItem("auth", "true");
                    sessionStorage.setItem("user", userIn);

                    // Use replace to prevent back-button loop
                    window.location.replace("dashboard.html");
                    return;
                }
            }

            // Artificial delay to prevent brute-force (client-side only, but good UX practice)
            await new Promise(r => setTimeout(r, 500));
            this.showError("Invalid username or password");

        } catch (err) {
            console.error("Login Error:", err);
            this.showError("System Error. Please try again later.");
        }
    }
};

// Initialize only after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loginForm.init();
});
