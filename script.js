document.addEventListener('DOMContentLoaded', () => {
    const navElements = document.querySelectorAll('.nav a, .nav button');
    let themeBtn = null;
    
    navElements.forEach(el => {
        if (el.textContent.trim().toLowerCase() === 'theme') {
            themeBtn = el;
            themeBtn.id = 'theme-toggle';
            themeBtn.classList.add('theme-nav-btn');
        }
    });

    const floatingBtn = document.querySelector('.theme-btn');
    if (floatingBtn && floatingBtn !== themeBtn) {
        floatingBtn.remove();
    }

    const currentTheme = localStorage.getItem('theme') || 'light';

    function updateButtonState(theme) {
        if (themeBtn) {
            themeBtn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
        }
    }

    updateButtonState(currentTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                updateButtonState('light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateButtonState('dark');
            }
        });
    }
});