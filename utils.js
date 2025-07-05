// utils.js

let scrollObserver; 
let activeSkill = null; 

/**
 * Applies the selected theme to the website by updating CSS variables.
 * @param {string} themeName - The name of the theme to apply (e.g., 'blue', 'green').
 */
function applyTheme(themeName) {
    const theme = colorThemes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--glow-primary', theme.primary);
    root.style.setProperty('--glow-secondary', theme.secondary);
    root.style.setProperty('--border-color', `rgba(${theme.rgb}, 0.25)`);
    root.style.setProperty('--border-hover', `rgba(${theme.rgb}, 0.6)`);
    root.style.setProperty('--glow-rgb', theme.rgb);
    
    document.querySelectorAll('.color-swatch').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.themeName === themeName);
    });

    localStorage.setItem('portfolioTheme', themeName);
}

/**
 * Opens a modal with detailed information about a project.
 * @param {string} type - The type of data ('project').
 * @param {string} id - The ID of the project to display.
 */
function openModal(type, id) {
    let data;
    if (type === 'project') data = portfolioData.projects.find(p => p.id === id);
    if (!data) return;

    const modalContainer = document.getElementById('modal-container');
    let contentHtml = `
        <h3 class="text-2xl font-bold text-white mb-2">${data.name}</h3>
        <div class="flex flex-wrap gap-2 my-4">${data.technologies.map(t => `<span class="skill-tag px-2 py-1 text-xs">${t}</span>`).join('')}</div>
        <p class="text-text-dark text-sm mb-4">${data.longDescription}</p>
        ${data.screenshots.length > 0 ? `<div class="grid grid-cols-2 gap-2 mt-4">${data.screenshots.map(s => `<img src="${s}" class="rounded-md border border-[var(--border-color)]" alt="Project screenshot for ${data.name}">`).join('')}</div>` : ''}
        ${data.url ? `<a href="${data.url}" target="_blank" class="inline-block mt-4 bg-[var(--glow-primary)] hover:bg-[var(--glow-secondary)] text-black font-semibold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--glow-primary)]">Visit Project</a>` : ''}
    `;
    
    modalContainer.innerHTML = `
        <div id="modal-overlay" class="modal-overlay" role="dialog" aria-modal="true" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <i data-feather="x" class="modal-close-btn" onclick="closeModal()"></i>
                ${contentHtml}
            </div>
        </div>
    `;
    feather.replace();
    setTimeout(() => {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.add('visible');
        overlay.focus();
    }, 10);
}

/**
 * Closes the currently open modal.
 */
function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        setTimeout(() => { overlay.remove(); }, 300);
    }
}

let currentLightboxIndex = 0;

/**
 * Opens the lightbox with a specific image from the gallery.
 * @param {number} index - The index of the image in the `portfolioData.photoGallery` array.
 */
function openLightbox(index) {
    currentLightboxIndex = index;
    const photo = portfolioData.photoGallery[index];
    const lightboxContainer = document.getElementById('lightbox-container');
    
    lightboxContainer.innerHTML = `
        <div id="lightbox-overlay" class="lightbox-overlay" role="dialog" aria-modal="true" onclick="closeLightbox()">
            <div class="lightbox-content" onclick="event.stopPropagation()">
                 <i data-feather="x" class="modal-close-btn" onclick="closeLightbox()"></i>
                 <button class="lightbox-nav prev" onclick="navigateLightbox(-1)"><i data-feather="chevron-left"></i></button>
                 <img src="${photo.full}" class="lightbox-img" alt="${photo.caption}">
                 <button class="lightbox-nav next" onclick="navigateLightbox(1)"><i data-feather="chevron-right"></i></button>
                 <div id="lightbox-caption" class="lightbox-caption">${photo.caption}</div>
            </div>
        </div>`;
    feather.replace();
    setTimeout(() => {
        const overlay = document.getElementById('lightbox-overlay');
        overlay.classList.add('visible');
        overlay.focus();
    }, 10);
}

/**
 * Navigates to the next or previous image in the lightbox.
 * @param {number} direction - 1 for next, -1 for previous.
 */
function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    const gallery = portfolioData.photoGallery;
    if (currentLightboxIndex < 0) currentLightboxIndex = gallery.length - 1;
    if (currentLightboxIndex >= gallery.length) currentLightboxIndex = 0;
    
    const photo = gallery[currentLightboxIndex];
    document.querySelector('.lightbox-img').src = photo.full;
    document.getElementById('lightbox-caption').textContent = photo.caption;
}

function closeLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        setTimeout(() => { overlay.remove(); }, 300);
    }
}

/**
 * Filters projects and repositories based on a selected skill.
 * @param {string} skill - The skill to filter by.
 * @param {HTMLElement} element - The skill tag element that was clicked.
 */
function filterBySkill(skill, element) {
    const skillCards = document.querySelectorAll('#project-list > div, #repo-list > div');
    
    if (activeSkill === skill) {
        activeSkill = null;
        document.querySelectorAll('.skill-tag.active').forEach(el => el.classList.remove('active'));
        skillCards.forEach(card => card.classList.remove('dimmed'));
    } else {
        activeSkill = skill;
        document.querySelectorAll('.skill-tag.active').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        
        skillCards.forEach(card => {
            const techs = (card.dataset.technologies || card.dataset.language || '').split(',');
            if (techs.map(t => t.toLowerCase()).includes(skill.toLowerCase())) {
                card.classList.remove('dimmed');
            } else {
                card.classList.add('dimmed');
            }
        });
    }
}
