// ===== GESTION DU THÈME (CLAIR/SOMBRE) =====
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) html.setAttribute('data-theme', saved);
// Bascule entre thème clair et sombre au clic
toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ===== ANIMATION D'APPARITION DES ÉLÉMENTS =====
// Ajoute une classe "visible" aux éléments quand ils apparaissent à l'écran
const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 80);
    });
}, { threshold: .12 });
document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

// ===== MISE EN AVANT DE LA SECTION ACTIVE DANS LA NAV =====
// Surligne le lien de navigation correspondant à la section visible
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const sections = document.querySelectorAll('main section[id]');
const secObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === entry.target.id));
        }
    });
}, { threshold: .35 });
sections.forEach(section => secObs.observe(section));

// ===== COMPTEUR ANIMÉ POUR LES STATISTIQUES =====
// Compte progressivement jusqu'aux nombres cibles
const counters = document.querySelectorAll('.stat-value[data-target]');
let counted = false;
const countObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !counted) {
            counted = true;
            counters.forEach((el) => {
                const target = +el.dataset.target;
                const duration = 900;
                const step = 16;
                const increment = target / (duration / step);
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = Math.floor(current);
                }, step);
            });
        }
    });
}, { threshold: .5 });
const statsBlock = document.querySelector('.hero-stats');
if (statsBlock) countObs.observe(statsBlock);

// ===== MODAL DE PRÉVISUALISATION DES PROJETS =====
// Affiche une fenêtre popup pour visualiser les projets
const previewModal = document.querySelector('.preview-modal');
if (previewModal) {
    const previewButtons = document.querySelectorAll('.project-btn.preview');
    const previewBackdrop = previewModal.querySelector('.preview-backdrop');
    const previewClose = previewModal.querySelector('.preview-close');
    const previewIframe = previewModal.querySelector('.preview-iframe');
    const previewTitle = previewModal.querySelector('.preview-title');

    // Ouvre le modal avec l'URL du projet et son titre
    const openPreview = (url, title) => {
        previewTitle.textContent = title ? `Aperçu — ${title}` : 'Aperçu du projet';
        previewIframe.src = url;
        previewModal.classList.add('open');
        previewModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    };

    // Ferme le modal et efface l'iframe
    const closePreview = () => {
        previewModal.classList.remove('open');
        previewModal.setAttribute('aria-hidden', 'true');
        previewIframe.src = '';
        document.body.classList.remove('modal-open');
    };

    // Ajoute les événements aux boutons Aperçu
    previewButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const project = button.closest('.project-item');
            openPreview(button.href, project?.querySelector('.project-name')?.textContent || '');
        });
    });

    // Fermeture : clic croix, fond, ou touche Échap
    previewClose.addEventListener('click', closePreview);
    previewBackdrop.addEventListener('click', closePreview);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && previewModal.classList.contains('open')) closePreview();
    });
}
