// ============================================
// Kotten Portfolio — Main Application
// ============================================

import { LANYARD_USER_ID, portfolioData, languageColors, colorThemes, customIcons } from './data.js';

// ============================================
// State
// ============================================
let scrollObserver;
let activeSkill = null;
let currentPhotoIndex = 0;
let allPhotos = [];
let cliStartTime = Date.now();
let paletteSelectedIndex = 0;

// ============================================
// Theme System
// ============================================
function applyTheme(themeName) {
    const theme = colorThemes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--glow-primary', theme.primary);
    root.style.setProperty('--glow-secondary', theme.secondary);
    root.style.setProperty('--border-color', `rgba(${theme.rgb}, 0.15)`);
    root.style.setProperty('--border-hover', `rgba(${theme.rgb}, 0.4)`);
    root.style.setProperty('--glow-rgb', theme.rgb);

    document.querySelectorAll('.color-swatch').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.themeName === themeName);
    });

    localStorage.setItem('portfolioTheme', themeName);
}

function initThemePicker() {
    const picker = document.getElementById('theme-picker');
    picker.innerHTML = Object.entries(colorThemes).map(([name, theme]) =>
        `<div class="color-swatch" style="background-color: ${theme.primary}" data-theme-name="${name}" title="${name}"></div>`
    ).join('');

    picker.querySelectorAll('.color-swatch').forEach(sw => {
        sw.addEventListener('click', () => applyTheme(sw.dataset.themeName));
    });

    const saved = localStorage.getItem('portfolioTheme') || 'blue';
    applyTheme(saved);
}

// ============================================
// Boot Loader
// ============================================
async function initLoader() {
    const loader = document.getElementById('loader');
    const mainWrapper = document.getElementById('main-wrapper');
    const output = document.getElementById('loader-output');

    const bootSequence = [
        "Booting HavenOS v2.0.0...",
        "Initializing kernel... <span class='status-ok'>[OK]</span>",
        "Mounting virtual file systems... <span class='status-ok'>[OK]</span>",
        "Loading user profile: [kotten]... <span class='status-ok'>[OK]</span>",
        "Connecting to external services... <span class='status-ok'>[OK]</span>",
        "Finalizing UI... <span class='status-ok'>[OK]</span>",
        "Welcome."
    ];

    for (let i = 0; i < bootSequence.length; i++) {
        const p = document.createElement('p');
        p.innerHTML = bootSequence[i];
        p.style.animationDelay = `${i * 120}ms`;
        output.appendChild(p);
    }

    await new Promise(r => setTimeout(r, bootSequence.length * 120 + 400));

    loader.classList.add('hidden');
    mainWrapper.classList.add('loaded');
}

// ============================================
// Canvas Background — Particle Network
// ============================================
function initCanvasBg() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;
    let isActive = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        canvas.style.display = 'none';
        return;
    }

    const PARTICLE_COUNT = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    const CONNECTION_DIST = 120;
    const MOUSE_DIST = 200;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_DIST) {
                    const force = (MOUSE_DIST - dist) / MOUSE_DIST;
                    this.vx += dx * force * 0.001;
                    this.vy += dy * force * 0.001;
                }
            }

            // Damping
            this.vx *= 0.99;
            this.vy *= 0.99;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--glow-rgb')}, 0.5)`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        const rgb = getComputedStyle(document.documentElement).getPropertyValue('--glow-rgb');
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!isActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    // Visibility handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(animationId);
        } else {
            isActive = true;
            animate();
        }
    });

    // Mouse tracking
    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    animate();
}

// ============================================
// Scroll Reveal
// ============================================
function initScrollReveal() {
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => scrollObserver.observe(el));
}

// ============================================
// Scroll Progress
// ============================================
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    const update = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) : 0;
        bar.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    // Desktop nav highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');

    const updateActive = () => {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
                current = section.id;
            }
        });
        if (window.scrollY < 200) current = 'about';

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    // Mobile menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            const isOpen = !mobileNav.classList.contains('hidden');
            mobileNav.classList.toggle('hidden');
            menuBtn.setAttribute('aria-expanded', String(!isOpen));
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ============================================
// Section Dots
// ============================================
function initSectionDots() {
    const container = document.getElementById('section-dots');
    const navSections = ['about', 'projects', 'repositories', 'videos', 'photos', 'setup'];

    navSections.forEach(id => {
        const section = document.getElementById(id);
        if (!section) return;

        const dot = document.createElement('div');
        dot.className = 'section-dot';
        dot.setAttribute('data-section', id);
        dot.setAttribute('data-label', id);
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', `Go to ${id} section`);
        dot.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth' }));
        dot.addEventListener('keydown', e => {
            if (e.key === 'Enter') section.scrollIntoView({ behavior: 'smooth' });
        });
        container.appendChild(dot);
    });

    const updateActive = () => {
        let current = '';
        navSections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom >= 200) current = id;
            }
        });
        if (window.scrollY < 200) current = 'about';

        document.querySelectorAll('.section-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === current);
        });
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
}

// ============================================
// Data Rendering
// ============================================
function renderSocials() {
    const container = document.getElementById('social-links');
    if (!container) return;

    container.innerHTML = Object.entries(portfolioData.socials).map(([name, { url, icon, label }]) => {
        const svg = customIcons[icon] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>`;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${label}">${svg}</a>`;
    }).join('');
}

function renderSkills() {
    const container = document.getElementById('skill-cloud');
    if (!container) return;

    container.innerHTML = portfolioData.skills.map(skill =>
        `<span class="skill-tag" data-skill="${skill}" tabindex="0" role="button" aria-pressed="false">${skill}</span>`
    ).join('');

    container.querySelectorAll('.skill-tag').forEach(tag => {
        const handler = () => filterBySkill(tag.dataset.skill, tag);
        tag.addEventListener('click', handler);
        tag.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
    });
}

function renderProjects() {
    const container = document.getElementById('project-list');
    if (!container) return;

    container.innerHTML = portfolioData.projects.map((p, i) => `
        <div data-technologies="${p.technologies.join(',')}" 
             class="clickable-card scroll-reveal" 
             tabindex="0" 
             role="button"
             style="transition-delay: ${i * 80}ms"
             aria-label="Open ${p.name} details">
            <h5>${p.name}</h5>
            <p>${p.description}</p>
        </div>
    `).join('');

    container.querySelectorAll('.clickable-card').forEach((card, i) => {
        const open = () => openModal('project', portfolioData.projects[i].id);
        card.addEventListener('click', open);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        scrollObserver.observe(card);
    });
}

function renderSetup() {
    const container = document.getElementById('setup-list');
    if (!container) return;

    container.innerHTML = Object.entries(portfolioData.setup).map(([category, items]) => `
        <div class="setup-category">
            <h4>${category}</h4>
            <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
    `).join('');
}

function renderVideos() {
    const container = document.getElementById('video-grid');
    if (!container) return;

    container.innerHTML = portfolioData.youtubeVideos.map(video => `
        <div class="video-card scroll-reveal">
            <h4>${video.title}</h4>
            <iframe src="https://www.youtube.com/embed/${video.id}" 
                    title="${video.title}" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    loading="lazy"></iframe>
        </div>
    `).join('');

    container.querySelectorAll('.scroll-reveal').forEach(el => scrollObserver.observe(el));
}

function renderPhotos() {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) return;

    allPhotos = portfolioData.photoGallery;

    gallery.innerHTML = allPhotos.map((photo, index) => `
        <div class="gallery-item scroll-reveal" 
             onclick="app.openLightbox('photos/${encodeURIComponent(photo)}?v=1.0.0', ${index})"
             tabindex="0"
             role="button"
             aria-label="View photo ${index + 1}"
             style="transition-delay: ${index * 50}ms">
            <img src="photos/${encodeURIComponent(photo)}?v=1.0.0" 
                 alt="${photo}" 
                 loading="lazy">
        </div>
    `).join('');

    gallery.querySelectorAll('.scroll-reveal').forEach(el => scrollObserver.observe(el));
}

function renderContact() {
    const emailEl = document.getElementById('email-address');
    if (emailEl) emailEl.textContent = portfolioData.email;

    const btn = document.getElementById('copy-email-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(portfolioData.email);
            const copyText = document.getElementById('copy-text');
            const copyIcon = btn.querySelector('.copy-icon');
            const checkIcon = btn.querySelector('.check-icon');

            copyText.textContent = 'Copied!';
            copyIcon.classList.add('hidden');
            checkIcon.classList.remove('hidden');

            setTimeout(() => {
                copyText.textContent = 'Copy';
                copyIcon.classList.remove('hidden');
                checkIcon.classList.add('hidden');
            }, 2000);
        } catch (err) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = portfolioData.email;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    });
}

// ============================================
// Skill Filtering
// ============================================
function filterBySkill(skill, element) {
    const cards = document.querySelectorAll('#project-list > div, #repo-list > .repo-card');

    if (activeSkill === skill) {
        activeSkill = null;
        document.querySelectorAll('.skill-tag.active').forEach(el => {
            el.classList.remove('active');
            el.setAttribute('aria-pressed', 'false');
        });
        cards.forEach(card => card.classList.remove('dimmed'));
    } else {
        activeSkill = skill;
        document.querySelectorAll('.skill-tag.active').forEach(el => {
            el.classList.remove('active');
            el.setAttribute('aria-pressed', 'false');
        });
        element.classList.add('active');
        element.setAttribute('aria-pressed', 'true');

        cards.forEach(card => {
            const techs = (card.dataset.technologies || card.dataset.language || '').split(',');
            if (techs.map(t => t.toLowerCase()).includes(skill.toLowerCase())) {
                card.classList.remove('dimmed');
            } else {
                card.classList.add('dimmed');
            }
        });
    }
}

// ============================================
// GitHub Repos
// ============================================
async function fetchGitHubRepos() {
    const container = document.getElementById('repo-list');
    if (!container) return;

    try {
        const res = await fetch(`https://api.github.com/users/${portfolioData.githubUsername}/repos?sort=pushed&per_page=30`);
        if (!res.ok) {
            if (res.status === 403) throw new Error('GitHub API rate limit exceeded. Try again later.');
            if (res.status === 404) throw new Error('GitHub user not found.');
            throw new Error(`HTTP ${res.status}`);
        }

        const repos = await res.json();
        if (!Array.isArray(repos)) throw new Error('Invalid response');

        const display = repos.filter(r => !r.fork).slice(0, 6);
        if (display.length === 0) {
            container.innerHTML = `<p class="text-text-dark text-sm">No public repositories found.</p>`;
            return;
        }

        container.innerHTML = display.map(repo => `
            <div data-language="${repo.language || ''}" class="repo-card scroll-reveal">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
                <p class="text-sm text-text-dark mt-1">${repo.description || 'No description provided.'}</p>
                <div class="repo-meta">
                    <span><span class="lang-dot" style="background-color: ${languageColors[repo.language] || languageColors.default}"></span>${repo.language || 'N/A'}</span>
                    <span>⭐ ${repo.stargazers_count || 0}</span>
                    <span>⑂ ${repo.forks_count || 0}</span>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.scroll-reveal').forEach(el => scrollObserver.observe(el));
    } catch (err) {
        console.error('GitHub fetch failed:', err);
        container.innerHTML = `<p class="text-red-400 text-sm">${err.message}</p>`;
    }
}

// ============================================
// Lanyard (Discord + Spotify)
// ============================================
function updateStatusWidget(data) {
    if (!data) return;

    const avatar = document.getElementById('discord-avatar');
    const username = document.getElementById('discord-username');
    const dot = document.getElementById('discord-status-dot');
    const statusText = document.getElementById('discord-status-text');
    const spotifySection = document.getElementById('spotify-section');

    if (data.discord_user) {
        const u = data.discord_user;
        const display = u.discriminator && u.discriminator !== '0'
            ? `${u.username}#${u.discriminator}`
            : u.username;
        username.textContent = display;

        if (u.avatar) {
            avatar.src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`;
        }
    }

    if (data.listening_to_spotify && data.spotify) {
        document.getElementById('spotify-song').textContent = data.spotify.song || '';
        document.getElementById('spotify-artist').textContent = data.spotify.artist ? `by ${data.spotify.artist}` : '';
        spotifySection.classList.remove('hidden');
    } else {
        spotifySection.classList.add('hidden');
    }

    const statusMap = {
        online: { text: 'Online', color: 'bg-green-400' },
        idle: { text: 'Idle', color: 'bg-amber-400' },
        dnd: { text: 'Do Not Disturb', color: 'bg-red-400' },
        offline: { text: 'Offline', color: 'bg-gray-500' }
    };
    const s = statusMap[data.discord_status] || statusMap.offline;
    dot.className = `status-dot ${s.color}`;
    statusText.textContent = s.text;
}

function updateWeatherWidget(data) {
    const widget = document.getElementById('weather-widget');
    if (!widget || !data || data.temperature === undefined) return;

    const temp = Math.round(data.temperature);
    const isDay = data.is_day;
    const code = data.weathercode;

    // Simple weather icon mapping
    let icon = '☀️';
    if (!isDay) icon = '🌙';
    else if (code > 2) icon = '☁️';
    else if (code > 50) icon = '🌧️';

    widget.innerHTML = `${icon} ${temp}°C in Stockholm`;
}

async function initExternalData() {
    // Fetch Lanyard and weather in parallel
    const [lanyardRes, weatherRes] = await Promise.allSettled([
        fetch(`https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`).then(r => r.json()),
        fetch('https://api.open-meteo.com/v1/forecast?latitude=59.33&longitude=18.06&current_weather=true').then(r => r.json())
    ]);

    if (lanyardRes.status === 'fulfilled' && lanyardRes.value?.data) {
        updateStatusWidget(lanyardRes.value.data);
    } else {
        document.getElementById('discord-status-text').textContent = 'Lanyard unavailable';
    }

    if (weatherRes.status === 'fulfilled' && weatherRes.value?.current_weather) {
        updateWeatherWidget(weatherRes.value.current_weather);
    }

    // Poll Lanyard every 15s
    setInterval(async () => {
        try {
            const res = await fetch(`https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`);
            if (res.ok) {
                const { data } = await res.json();
                if (data) updateStatusWidget(data);
            }
        } catch (e) { /* silent */ }
    }, 15000);
}

// ============================================
// Modal
// ============================================
function openModal(type, id) {
    let data;
    if (type === 'project') data = portfolioData.projects.find(p => p.id === id);
    if (!data) return;

    const container = document.getElementById('modal-container');
    const screenshots = data.screenshots.length > 0
        ? `<div class="grid grid-cols-2 gap-2 mt-4">${data.screenshots.map(s => `<img src="${s}" class="rounded-md border border-[var(--border-color)]" alt="Screenshot" loading="lazy">`).join('')}</div>`
        : '';

    container.innerHTML = `
        <div id="modal-overlay" class="modal-overlay" role="dialog" aria-modal="true" onclick="app.closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close-btn" onclick="app.closeModal()" aria-label="Close modal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h3 class="text-2xl font-bold text-white mb-2 font-mono">${data.name}</h3>
                <div class="flex flex-wrap gap-2 my-4">${data.technologies.map(t => `<span class="skill-tag px-2 py-1 text-xs">${t}</span>`).join('')}</div>
                <p class="text-text-dark text-sm mb-4 leading-relaxed">${data.longDescription}</p>
                ${screenshots}
                ${data.url ? `<a href="${data.url}" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 bg-glow-primary hover:bg-glow-secondary text-black font-semibold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95">Visit Project →</a>` : ''}
            </div>
        </div>
    `;

    requestAnimationFrame(() => {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.add('visible');
        overlay.querySelector('.modal-content').focus();
    });
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 300);
    }
}

// ============================================
// Lightbox
// ============================================
function openLightbox(src, index) {
    const overlay = document.getElementById('lightbox-overlay');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    currentPhotoIndex = index;
    img.src = src;
    img.alt = allPhotos[index] || '';
    caption.textContent = allPhotos[index] || '';

    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(direction) {
    currentPhotoIndex += direction;
    if (currentPhotoIndex < 0) currentPhotoIndex = allPhotos.length - 1;
    if (currentPhotoIndex >= allPhotos.length) currentPhotoIndex = 0;
    openLightbox(`photos/${encodeURIComponent(allPhotos[currentPhotoIndex])}?v=1.0.0`, currentPhotoIndex);
}

// ============================================
// CLI Terminal
// ============================================
function initCLI() {
    const container = document.getElementById('cli-container');
    const output = document.getElementById('cli-output');
    const input = document.getElementById('cli-input');
    let history = [];
    let historyIndex = -1;

    const neofetch = () => {
        const theme = localStorage.getItem('portfolioTheme') || 'blue';
        const uptime = Math.floor((Date.now() - cliStartTime) / 60000);
        return `
<span style="color:var(--glow-primary)">       _,.                    </span><span style="color:var(--text-light)">kotten@undo.it</span>
<span style="color:var(--glow-primary)">     ,L'' ''-.,               </span><span style="color:var(--text-light)">--------------</span>
<span style="color:var(--glow-primary)">   ,L'         ''-.,          </span><span style="color:var(--text-light)"><b>OS:</b> HavenOS (Web)</span>
<span style="color:var(--glow-primary)">  /               \\           </span><span style="color:var(--text-light)"><b>Host:</b> ${navigator.vendor || 'N/A'}</span>
<span style="color:var(--glow-primary)"> /                 \\          </span><span style="color:var(--text-light)"><b>Kernel:</b> ${navigator.platform}</span>
<span style="color:var(--glow-primary)">/|      ,.:.       |\\         </span><span style="color:var(--text-light)"><b>Uptime:</b> ${uptime}m</span>
<span style="color:var(--glow-primary)">L|     ,'   \`.     |J         </span><span style="color:var(--text-light)"><b>Resolution:</b> ${screen.width}x${screen.height}</span>
<span style="color:var(--glow-primary)">|L    /       \\    J|         </span><span style="color:var(--text-light)"><b>Theme:</b> ${theme}</span>
<span style="color:var(--glow-primary)">LJ   :         :   LJ         </span><span style="color:var(--text-light)"><b>CPU:</b> ${navigator.hardwareConcurrency || 'N/A'} Cores</span>
<span style="color:var(--glow-primary)"> J   |         |   F          </span><span style="color:var(--text-light)"><b>GPU:</b> Browser Emulated</span>
<span style="color:var(--glow-primary)">  L  \\       /  J             </span><span style="color:var(--text-light)"><b>Memory:</b> ${navigator.deviceMemory || 'N/A'} GB</span>
<span style="color:var(--glow-primary)">   \\  \`-.,,-'  /            </span>
<span style="color:var(--glow-primary)">    \`-.,_.,_'               </span>`;
    };

    const commands = {
        help: () => "Available commands: help, neofetch, whoami, skills, projects, socials, contact, clear, exit, theme, palette",
        whoami: () => "Kotten — network engineer and back-end developer from Sweden.",
        skills: () => portfolioData.skills.join(', '),
        projects: () => portfolioData.projects.map(p => `• ${p.name}: ${p.description}`).join('\n'),
        socials: () => Object.entries(portfolioData.socials).map(([n, { url }]) => `${n}: ${url}`).join('\n'),
        contact: () => `Email: ${portfolioData.email}`,
        neofetch: () => ({ html: true, text: neofetch() }),
        theme: (args) => {
            if (!args?.length) return "Usage: theme <name> or theme list";
            if (args[0] === 'list') return `Available: ${Object.keys(colorThemes).join(', ')}`;
            if (colorThemes[args[0]]) { applyTheme(args[0]); return `Theme set to ${args[0]}.`; }
            return `Unknown theme: ${args[0]}. Use 'theme list'.`;
        },
        palette: () => { openCommandPalette(); return 'Opening command palette...'; },
        clear: () => { output.innerHTML = ''; return ''; },
        exit: () => { toggleCLI(false); return ''; },
    };

    const typeEffect = (el, text, speed = 3) => {
        return new Promise(resolve => {
            let i = 0;
            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                    output.scrollTop = output.scrollHeight;
                } else {
                    resolve();
                }
            }
            type();
        });
    };

    const toggleCLI = show => {
        container.classList.toggle('visible', show);
        container.setAttribute('aria-hidden', String(!show));
        if (show) {
            if (!output.innerHTML.trim()) {
                const div = document.createElement('div');
                div.textContent = "Welcome. Type 'help' for commands.";
                output.appendChild(div);
            }
            input.focus();
        }
    };

    input.addEventListener('keydown', async e => {
        const cmdStr = input.value.trim();

        if (e.key === 'Enter' && cmdStr) {
            const [cmd, ...args] = cmdStr.split(/\s+/);
            const cmdLower = cmd.toLowerCase();

            const prompt = document.createElement('div');
            prompt.innerHTML = `<span style="color:var(--glow-primary)">user@kotten:~$ </span><span>${escapeHtml(cmdStr)}</span>`;
            output.appendChild(prompt);

            history.unshift(cmdStr);
            historyIndex = -1;

            const resultDiv = document.createElement('div');
            output.appendChild(resultDiv);

            const handler = commands[cmdLower];
            let result;
            if (handler) {
                result = handler(args);
            } else {
                result = { html: true, text: `<span style="color:#ef4444">Command not found: ${escapeHtml(cmdLower)}</span>` };
            }

            if (result && result.text) {
                if (result.html) {
                    resultDiv.innerHTML = result.text;
                } else {
                    await typeEffect(resultDiv, result.text);
                }
            }

            input.value = '';
            output.scrollTop = output.scrollHeight;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
            } else {
                historyIndex = -1;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const partial = cmdStr.split(' ')[0].toLowerCase();
            const matches = Object.keys(commands).filter(c => c.startsWith(partial));
            if (matches.length === 1) {
                input.value = matches[0] + ' ';
            } else if (matches.length > 1) {
                const div = document.createElement('div');
                div.textContent = matches.join('  ');
                output.appendChild(div);
                output.scrollTop = output.scrollHeight;
            }
        }
    });

    // Global shortcuts
    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey &&
            document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' &&
            !document.getElementById('command-palette')?.classList.contains('visible')) {
            e.preventDefault();
            toggleCLI(true);
        } else if (e.key === 'Escape') {
            if (container.classList.contains('visible')) {
                toggleCLI(false);
            } else {
                closeLightbox();
                closeModal();
                closeCommandPalette();
            }
        }
    });
}

// ============================================
// Command Palette
// ============================================
const paletteCommands = [
    { id: 'about', label: 'Go to About', icon: 'user', action: () => scrollTo('about') },
    { id: 'projects', label: 'Go to Projects', icon: 'folder', action: () => scrollTo('projects') },
    { id: 'repositories', label: 'Go to Repositories', icon: 'git-branch', action: () => scrollTo('repositories') },
    { id: 'videos', label: 'Go to Videos', icon: 'video', action: () => scrollTo('videos') },
    { id: 'photos', label: 'Go to Photos', icon: 'image', action: () => scrollTo('photos') },
    { id: 'setup', label: 'Go to Setup', icon: 'monitor', action: () => scrollTo('setup') },
    { id: 'contact', label: 'Go to Contact', icon: 'mail', action: () => scrollTo('contact') },
    { id: 'theme-blue', label: 'Set theme: Blue', icon: 'droplet', action: () => applyTheme('blue') },
    { id: 'theme-green', label: 'Set theme: Green', icon: 'droplet', action: () => applyTheme('green') },
    { id: 'theme-purple', label: 'Set theme: Purple', icon: 'droplet', action: () => applyTheme('purple') },
    { id: 'theme-red', label: 'Set theme: Red', icon: 'droplet', action: () => applyTheme('red') },
    { id: 'theme-amber', label: 'Set theme: Amber', icon: 'droplet', action: () => applyTheme('amber') },
    { id: 'theme-cyan', label: 'Set theme: Cyan', icon: 'droplet', action: () => applyTheme('cyan') },
    { id: 'cli', label: 'Open Terminal', icon: 'terminal', action: () => { document.getElementById('cli-container')?.classList.add('visible'); document.getElementById('cli-input')?.focus(); } },
    { id: 'github', label: 'Open GitHub', icon: 'github', action: () => window.open('https://github.com/KottenFAC', '_blank') },
    { id: 'steam', label: 'Open Steam', icon: 'steam', action: () => window.open('https://steamcommunity.com/id/KottenFAC/', '_blank') },
    { id: 'discord', label: 'Open Discord', icon: 'discord', action: () => window.open('https://discord.com/invite/hFV2zJe7Fc', '_blank') },
];

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    closeCommandPalette();
}

function openCommandPalette() {
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('palette-input');
    palette.classList.add('visible');
    palette.setAttribute('aria-hidden', 'false');
    input.value = '';
    input.focus();
    paletteSelectedIndex = 0;
    renderPaletteResults('');
}

function closeCommandPalette() {
    const palette = document.getElementById('command-palette');
    palette.classList.remove('visible');
    palette.setAttribute('aria-hidden', 'true');
}

function renderPaletteResults(query) {
    const results = document.getElementById('palette-results');
    const q = query.toLowerCase().trim();

    const filtered = q
        ? paletteCommands.filter(c => c.label.toLowerCase().includes(q))
        : paletteCommands;

    if (filtered.length === 0) {
        results.innerHTML = '<div class="palette-empty">No results found</div>';
        return;
    }

    results.innerHTML = filtered.map((cmd, i) => `
        <div class="palette-item ${i === paletteSelectedIndex ? 'selected' : ''}" data-index="${i}" onclick="app.runPaletteCommand(${i}, '${cmd.id}')">
            <svg class="palette-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${getIconPath(cmd.icon)}
            </svg>
            <span>${highlightMatch(cmd.label, q)}</span>
        </div>
    `).join('');
}

function getIconPath(name) {
    const paths = {
        user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
        folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
        'git-branch': '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
        video: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>',
        image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
        monitor: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
        mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
        droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
        terminal: '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>',
        github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
        steam: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>',
        discord: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',
    };
    return paths[name] || '<circle cx="12" cy="12" r="10"></circle>';
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(var(--glow-rgb),0.3);color:var(--text-light);border-radius:2px;padding:0 2px;">$1</mark>');
}

function initCommandPalette() {
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('palette-input');

    input.addEventListener('input', () => {
        paletteSelectedIndex = 0;
        renderPaletteResults(input.value);
    });

    input.addEventListener('keydown', e => {
        const items = palette.querySelectorAll('.palette-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            paletteSelectedIndex = Math.min(paletteSelectedIndex + 1, items.length - 1);
            renderPaletteResults(input.value);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            paletteSelectedIndex = Math.max(paletteSelectedIndex - 1, 0);
            renderPaletteResults(input.value);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = items[paletteSelectedIndex];
            if (selected) {
                const id = selected.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                const cmd = paletteCommands.find(c => c.id === id);
                if (cmd) { cmd.action(); closeCommandPalette(); }
            }
        } else if (e.key === 'Escape') {
            closeCommandPalette();
        }
    });

    // Global shortcut
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openCommandPalette();
        }
    });
}

// ============================================
// Utilities
// ============================================
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// Initialization
// ============================================
async function init() {
    // Start loader animation immediately
    const loaderPromise = initLoader();

    // Initialize UI components
    initThemePicker();
    initCanvasBg();
    initScrollReveal();
    initScrollProgress();
    initNavigation();
    initSectionDots();
    initCLI();
    initCommandPalette();

    // Render static content
    renderSocials();
    renderSkills();
    renderProjects();
    renderSetup();
    renderVideos();
    renderPhotos();
    renderContact();

    // Fetch external data
    const dataPromise = initExternalData();
    const reposPromise = fetchGitHubRepos();

    // Wait for everything
    await Promise.all([loaderPromise, dataPromise, reposPromise]);
}

// Expose to window for onclick handlers
window.app = {
    openLightbox,
    closeLightbox,
    navigateLightbox,
    openModal,
    closeModal,
    openCommandPalette,
    closeCommandPalette,
    runPaletteCommand: (index, id) => {
        const cmd = paletteCommands.find(c => c.id === id);
        if (cmd) { cmd.action(); closeCommandPalette(); }
    }
};

// Start
document.addEventListener('DOMContentLoaded', init);
