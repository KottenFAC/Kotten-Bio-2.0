// main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Loader and Data Fetching Function ---
    async function initLoaderAndData() {
        const loader = document.getElementById('loader');
        const mainWrapper = document.getElementById('main-wrapper');

        // --- Boot Sequence Animation ---
        const runBootSequence = async () => {
            const loaderOutput = document.getElementById('loader-output');
            if (!loaderOutput) return;

            const bootSequence = [
                "Booting HavenOS v1.3.37...",
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
                p.style.animationDelay = `${i * 150}ms`;
                loaderOutput.appendChild(p);
            }
            
            return new Promise(resolve => setTimeout(resolve, bootSequence.length * 150 + 500));
        };

        const bootPromise = runBootSequence();
        const lanyardPromise = fetch(`https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`).then(res => res.json());
        const weatherPromise = fetch("https://api.open-meteo.com/v1/forecast?latitude=59.33&longitude=18.06&current_weather=true").then(res => res.json());

        const [lanyardResult, weatherResult, _bootResult] = await Promise.allSettled([lanyardPromise, weatherPromise, bootPromise]);

        if(lanyardResult.status === 'fulfilled' && lanyardResult.value.data) updateStatusWidget(lanyardResult.value.data);
        else document.getElementById('discord-status-text').textContent = "Lanyard API unavailable.";
        
        if(weatherResult.status === 'fulfilled' && weatherResult.value.current_weather) updateWeatherWidget(weatherResult.value.current_weather);
        else document.getElementById('weather-widget').textContent = "Weather unavailable.";

        setInterval(async () => {
            try {
                const res = await fetch(`https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`);
                if (res.ok) {
                    const { data } = await res.json();
                    if (data) updateStatusWidget(data);
                }
            } catch (error) { console.error("Lanyard poll failed:", error); }
        }, 15000);

        loader.classList.add('hidden');
        mainWrapper.classList.add('loaded');
    }

    function initInteractiveBg() {
        const bg = document.getElementById('interactive-bg');
        if (window.matchMedia('(pointer: fine)').matches) {
            // Original radial gradient effect
            document.addEventListener('mousemove', e => {
                requestAnimationFrame(() => {
                    bg.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(var(--glow-rgb), 0.08), transparent 80%)`;
                });
            });

            // Enhanced particle effects - Light trails
            document.addEventListener('mousemove', (e) => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;

                // Create light trails
                const trail = document.createElement('div');
                trail.style.position = 'fixed';
                trail.style.left = `${e.clientX}px`;
                trail.style.top = `${e.clientY}px`;
                trail.style.width = '4px';
                trail.style.height = '4px';
                trail.style.background = `radial-gradient(circle, rgba(var(--glow-rgb), 0.8), transparent)`;
                trail.style.transform = 'translate(-50%, -50%)';
                trail.style.pointerEvents = 'none';
                trail.style.zIndex = '-1';
                trail.style.filter = 'blur(2px)';
                trail.style.opacity = '0.5';

                document.body.appendChild(trail);

                // Animate and remove trail
                setTimeout(() => {
                    trail.style.transition = 'all 1s ease-out';
                    trail.style.opacity = '0';
                    trail.style.transform = `translate(-50%, -50%) scale(${Math.random() * 3 + 1})`;
                    setTimeout(() => trail.remove(), 1000);
                }, 10);
            });
        }

        // Signal interference effects - spawn bars periodically
        function spawnSignalBar() {
            const bar = document.createElement('div');
            bar.style.position = 'fixed';
            bar.style.left = `${Math.random() * 100}%`;
            bar.style.top = `${Math.random() * 100}%`;
            bar.style.width = '2px';
            bar.style.height = `${Math.random() * 50 + 10}px`;
            bar.style.background = `linear-gradient(to bottom, transparent, rgba(var(--glow-rgb), 0.8), transparent)`;
            bar.style.opacity = '0';
            bar.style.pointerEvents = 'none';
            bar.style.zIndex = '999';
            bar.style.animation = `signalPulse ${Math.random() * 2 + 1}s infinite`;

            document.body.appendChild(bar);

            // Animate signal bar
            setTimeout(() => {
                bar.style.opacity = '1';
                setTimeout(() => {
                    bar.style.opacity = '0';
                    setTimeout(() => bar.remove(), 500);
                }, 2000);
            }, 10);
        }

        // Spawn initial bars
        for (let i = 0; i < 5; i++) {
            setTimeout(spawnSignalBar, i * 300);
        }

        // Continue spawning bars periodically - sometimes spawn multiple
        setInterval(() => {
            const numBars = Math.random() < 0.3 ? 2 : 1; // 30% chance to spawn 2 bars
            for (let i = 0; i < numBars; i++) {
                setTimeout(spawnSignalBar, i * 200);
            }
        }, 4000); // Spawn every 4 seconds instead of 8
    }

    function initScrollReveal() {
        scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { rootMargin: "0px 0px -100px 0px" });

        document.querySelectorAll('.scroll-reveal').forEach(el => scrollObserver.observe(el));
    }

    function initNavObserver() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('main section');
        const updateActiveLink = () => {
            let currentSectionId = '';

            // Find the section that is currently most visible at the top of the viewport
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) { // Section crosses the 150px mark from top
                    currentSectionId = section.id;
                }
            });

            // Fallback to about section if near top of page
            if (window.scrollY < 200) currentSectionId = 'about';

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
            });
        };
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    function initDataRenders() {
        // Socials
        const socialContainer = document.getElementById('social-links');
        if(socialContainer) socialContainer.innerHTML = Object.values(portfolioData.socials).map(({url, icon, label}) => `<a href="${url}" target="_blank" class="social-link text-text-dark focus:outline-none focus:ring-2 focus:ring-[var(--glow-accent)] rounded-full" aria-label="${label}">${customIcons[icon] || `<i data-feather="${icon}" class="w-5 h-5"></i>`}</a>`).join('');
        
        document.getElementById('skill-cloud').innerHTML = portfolioData.skills.map(skill => `<span class="skill-tag px-3 py-1 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--glow-accent)]" onclick="filterBySkill('${skill}', this)">${skill}</span>`).join('');
        
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = portfolioData.projects.map((p, index) => `
            <div data-technologies="${p.technologies.join(',')}"
                 onclick="openModal('project', '${p.id}')"
                 class="clickable-card p-4 rounded-lg group scroll-reveal focus:outline-none focus:ring-2 focus:ring-[var(--glow-accent)]"
                 tabindex="0"
                 style="transition-delay: ${index * 100}ms">
                <h5 class="font-semibold text-text-light group-hover:text-[var(--glow-primary)] transition-colors">${p.name}</h5>
                <p class="text-sm text-text-dark mt-1">${p.description}</p>
            </div>`
        ).join('');
        projectList.querySelectorAll('.scroll-reveal').forEach(el => scrollObserver.observe(el));

        document.getElementById('setup-list').innerHTML = Object.entries(portfolioData.setup).map(([category, items]) => `<div><h4 class="text-lg font-semibold text-white mb-2">${category}</h4><ul class="list-disc list-inside text-text-dark space-y-1 text-sm">${items.map(item => `<li>${item}</li>`).join('')}</ul></div>`).join('');
        document.getElementById('email-address').textContent = portfolioData.email;
        const copyBtn = document.getElementById('copy-email-btn');
        if (copyBtn) copyBtn.addEventListener('click', () => { document.execCommand('copy', false, portfolioData.email); const copyText = document.getElementById('copy-text'); copyText.textContent = 'Copied!'; copyBtn.querySelector('i').outerHTML = `<i data-feather="check" class="w-4 h-4"></i>`; feather.replace(); setTimeout(() => { copyText.textContent = 'Copy'; copyBtn.querySelector('i').outerHTML = `<i data-feather="copy" class="w-4 h-4"></i>`; feather.replace(); }, 2000); });
        
        renderYouTubeVideos();
        renderPhotoGallery();
        fetchGitHubRepos();
        feather.replace();
    }

    function renderYouTubeVideos() {
        const videoSection = document.getElementById('videos');
        if (!videoSection) return;

        const videoContent = portfolioData.youtubeVideos.map(video => `
            <div>
                <h4 class="text-lg font-semibold text-white mb-2">${video.title}</h4>
                <div class="aspect-video w-full">
                    <iframe class="w-full h-full rounded-lg shadow-lg" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        `).join('');

        videoSection.querySelector('.grid').innerHTML = videoContent;
    }

    let currentPhotoIndex = 0;
    let allPhotos = [];

    function renderPhotoGallery() {
        const gallery = document.getElementById('photo-gallery');
        if (!gallery) return;

        allPhotos = portfolioData.photoGallery; // Store all photos for lightbox navigation

        const photosHtml = allPhotos.map((photo, index) => `
            <div class="gallery-item" onclick="openLightbox('photos/${photo}?v=1.0.0', ${index})">
                <img src="photos/${photo}?v=1.0.0" alt="${photo}" class="w-full h-full object-cover rounded-lg shadow-lg">
            </div>
        `).join('');

        gallery.innerHTML = photosHtml;
    }

    function openLightbox(src, index) {
        const lightboxOverlay = document.getElementById('lightbox-overlay');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        if (!lightboxOverlay || !lightboxImg) return;

        currentPhotoIndex = index;
        lightboxImg.src = src;
        lightboxImg.alt = allPhotos[index];
        lightboxCaption.textContent = allPhotos[index];
        lightboxOverlay.classList.add('visible');
        document.body.classList.add('overflow-hidden'); // Prevent scrolling
    }

    function closeLightbox() {
        const lightboxOverlay = document.getElementById('lightbox-overlay');
        if (lightboxOverlay) {
            lightboxOverlay.classList.remove('visible');
            document.body.classList.remove('overflow-hidden');
        }
    }

    function navigateLightbox(direction) {
        currentPhotoIndex += direction;
        if (currentPhotoIndex < 0) {
            currentPhotoIndex = allPhotos.length - 1;
        } else if (currentPhotoIndex >= allPhotos.length) {
            currentPhotoIndex = 0;
        }
        openLightbox(`photos/${allPhotos[currentPhotoIndex]}?v=1.0.0`, currentPhotoIndex);
    }

    async function fetchGitHubRepos() {
        const repoList = document.getElementById('repo-list');
        try {
            const response = await fetch(`https://api.github.com/users/${portfolioData.githubUsername}/repos?sort=pushed&per_page=30`);
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('GitHub API rate limit exceeded. Try again in an hour.');
                } else if (response.status === 404) {
                    throw new Error('GitHub user not found.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            let repos = await response.json();

            // Ensure repos is an array
            if (!Array.isArray(repos)) {
                throw new Error('Invalid response from GitHub API');
            }

            const displayRepos = repos.filter(repo => !repo.fork).slice(0, 6);

            if (displayRepos.length === 0) {
                repoList.innerHTML = `<p class="text-text-dark text-sm">No public repositories found.</p>`;
                return;
            }

            repoList.innerHTML = displayRepos.map((repo, index) => `
                <div data-language="${repo.language || ''}"
                     class="clickable-card p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--glow-accent)]"
                     tabindex="0">
                    <a href="${repo.html_url}" target="_blank" class="font-semibold text-text-light hover:text-[var(--glow-primary)] transition-colors">${repo.name}</a>
                    <p class="text-sm text-text-dark mt-1 mb-3">${repo.description || 'No description provided.'}</p>
                    <div class="flex items-center gap-4 text-xs text-text-dark">
                        <span class="flex items-center gap-1.5">
                            <span class="h-3 w-3 rounded-full" style="background-color: ${languageColors[repo.language] || languageColors.default};"></span>
                            ${repo.language || 'N/A'}
                        </span>
                        <span class="flex items-center gap-1"><i data-feather="star" class="w-3 h-3"></i>${repo.stargazers_count || 0}</span>
                        <span class="flex items-center gap-1"><i data-feather="git-branch" class="w-3 h-3"></i>${repo.forks_count || 0}</span>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('GitHub API fetch failed:', error);
            repoList.innerHTML = `<p class="text-red-400 text-sm">${error.message}</p>`;
        } finally {
            feather.replace({width: '0.75rem', height: '0.75rem'});
        }
    }
    
    /**
     * Updates the status widget with data from Lanyard (Spotify and Discord).
     * @param {object} data - The data object from the Lanyard API.
     */
    function updateStatusWidget(data) {
        if (!data) return;

        const discordAvatar = document.getElementById('discord-avatar');
        const discordUsername = document.getElementById('discord-username');
        const spotifyInfo = document.getElementById('spotify-info');
        const statusDot = document.getElementById('discord-status-dot');
        const statusText = document.getElementById('discord-status-text');

        // Always show Discord user info
        if (data.discord_user) {
            // Set Discord username
            const username = data.discord_user.username;
            const discriminator = data.discord_user.discriminator;
            const displayName = discriminator && discriminator !== '0' ? `${username}#${discriminator}` : username;
            discordUsername.textContent = displayName;

            // Set Discord avatar
            if (data.discord_user.avatar) {
                const avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`;
                discordAvatar.src = avatarUrl;
            }
        }

        // Handle Spotify info - show in dedicated section below profile
        const spotifySection = document.getElementById('spotify-section');
        if (data.listening_to_spotify) {
            document.getElementById('spotify-song').textContent = data.spotify.song;
            document.getElementById('spotify-artist').textContent = `by ${data.spotify.artist}`;
            spotifySection.classList.remove('hidden');
        } else {
            spotifySection.classList.add('hidden');
        }

        // Update Discord status
        let status, colorClass;
        switch(data.discord_status) {
            case 'online': status = 'Online'; colorClass = 'bg-green-400'; break;
            case 'idle': status = 'Idle'; colorClass = 'bg-amber-400'; break;
            case 'dnd': status = 'Do Not Disturb'; colorClass = 'bg-red-400'; break;
            default: status = 'Offline'; colorClass = 'bg-gray-500'; break;
        }
        statusDot.className = `status-dot ${colorClass}`;
        statusText.textContent = status;
    }

    /**
     * Updates the weather widget with current weather data.
     * @param {object} data - The current weather data.
     */
    function updateWeatherWidget(data) {
        const widget = document.getElementById('weather-widget');
        if (data && data.temperature !== undefined) {
            const temp = Math.round(data.temperature);
            const icon = data.is_day ? (data.weathercode > 1 ? 'cloud' : 'sun') : 'moon';
            widget.innerHTML = `<i data-feather="${icon}" class="w-4 h-4 mr-2"></i> ${temp}°C in Stockholm`;
            feather.replace({width: '1rem', height: '1rem'});
        }
    }
    
    /**
     * Initializes the theme picker, allowing users to change the website's color theme.
     */
    function initThemePicker() {
        const pickerContainer = document.getElementById('theme-picker');
        pickerContainer.innerHTML = Object.entries(colorThemes).map(([name, theme]) => 
            `<div class="color-swatch" style="background-color: ${theme.primary}" data-theme-name="${name}" onclick="applyTheme('${name}')" title="${name}"></div>`
        ).join('');
        const savedThemeName = localStorage.getItem('portfolioTheme') || 'blue';
        applyTheme(savedThemeName);
    }

    /**
     * Initializes the command-line interface (CLI) functionality.
     */
    function initCLI() {
        const container = document.getElementById('cli-container'), output = document.getElementById('cli-output'), input = document.getElementById('cli-input');
        let cliHistory = []; let historyIndex = -1;
        let startTime = Date.now();

        const neofetchOutput = `
<span style="color:var(--glow-primary)">       _,.                    </span><span style="color:var(--text-light)">kotten@undo.it</span>
<span style="color:var(--glow-primary)">     ,L'' ''-.,               </span><span style="color:var(--text-light)">--------------</span>
<span style="color:var(--glow-primary)">   ,L'         ''-.,          </span><span style="color:var(--text-light)"><b>OS:</b>HavenOS (Web)</span>
<span style="color:var(--glow-primary)">  /               \\           </span><span style="color:var(--text-light)"><b>Host:</b> ${navigator.vendor || 'N/A'}</span>
<span style="color:var(--glow-primary)"> /                 \\          </span><span style="color:var(--text-light)"><b>Kernel:</b> ${navigator.platform}</span>
<span style="color:var(--glow-primary)">/|      ,.:.       |\\         </span><span style="color:var(--text-light)"><b>Uptime:</b> <span id="cli-uptime">0m</span></span>
<span style="color:var(--glow-primary)">L|     ,'   \`.     |J         </span><span style="color:var(--text-light)"><b>Resolution:</b> ${screen.width}x${screen.height}</span>
<span style="color:var(--glow-primary)">|L    /       \\    J|         </span><span style="color:var(--text-light)"><b>Theme:</b> <span id="cli-theme">blue</span></span>
<span style="color:var(--glow-primary)">LJ   :         :   LJ         </span><span style="color:var(--text-light)"><b>CPU:</b> ${navigator.hardwareConcurrency || 'N/A'} Cores</span>
<span style="color:var(--glow-primary)"> J   |         |   F          </span><span style="color:var(--text-light)"><b>GPU:</b> Browser Emulated</span>
<span style="color:var(--glow-primary)">  L  \\       /  J             </span><span style="color:var(--text-light)"><b>Memory:</b> ${navigator.deviceMemory || 'N/A'} GB</span>
<span style="color:var(--glow-primary)">   \\  \`-.,,-'  /            </span>
<span style="color:var(--glow-primary)">    \`-.,_.,_-'               </span>
`;
        
        const commands = {
            help: () => ({ text: "Available: help, neofetch, whoami, skills, projects, socials, contact, clear, exit, theme" }),
            whoami: () => ({ text: "Kotten, a network engineer and back-end developer from Sweden." }),
            skills: () => ({ text: portfolioData.skills.join(', ') }),
            projects: () => ({ text: portfolioData.projects.map(p => `- ${p.name}: ${p.description}`).join('\n') }),
            socials: () => ({ text: Object.entries(portfolioData.socials).map(([name, { url }]) => `${name}: ${url}`).join('\n') }),
            contact: () => ({ text: `Email: ${portfolioData.email}` }),
            neofetch: () => {
                const uptime = Math.floor((Date.now() - startTime) / 60000);
                const currentThemeName = localStorage.getItem('portfolioTheme') || 'blue';
                let finalOutput = neofetchOutput.replace('0m', `${uptime}m`);
                finalOutput = finalOutput.replace('blue', currentThemeName);
                return { text: finalOutput, isHtml: true };
            },
            theme: (args) => {
                if (!args || args.length === 0) return { text: "Usage: theme <set|list>\nExample: theme set green" };
                const [subcommand, value] = args;
                if (subcommand === 'list') {
                    return { text: `Available themes: ${Object.keys(colorThemes).join(', ')}` };
                }
                if (subcommand === 'set' && value && colorThemes[value]) {
                    applyTheme(value); // Pass theme name directly
                    return { text: `Theme set to ${value}.` };
                }
                return { text: `Invalid theme: ${value}. Use 'theme list' to see options.` };
            },
            clear: () => { output.innerHTML = ''; return { text: '' }; },
            exit: () => { toggleCLI(false); return { text: '' }; },
        };

        /**
         * Simulates a typing effect in the CLI output.
         * @param {HTMLElement} element - The element to type into.
         * @param {string} text - The text to type.
         * @param {number} speed - Typing speed in milliseconds per character.
         */
        const typeEffect = (element, text, speed = 5) => {
            let i = 0;
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                    output.scrollTop = output.scrollHeight;
                }
            }
            type();
        };

        /**
         * Toggles the visibility of the CLI container.
         * @param {boolean} show - True to show, false to hide.
         */
        const toggleCLI = show => { 
            container.style.display = show ? 'flex' : 'none'; 
            if (show) { 
                if(!output.innerHTML.trim()) typeEffect(output.appendChild(document.createElement('div')), "Welcome. Type 'help' for commands.");
                input.focus(); 
            } 
        };
        
        input.addEventListener('keydown', e => {
            const cmdStr = input.value.trim();
            if (e.key === 'Enter' && cmdStr) {
                const [cmd, ...args] = cmdStr.split(/\s+/);
                const cmdLower = cmd.toLowerCase();
                const prompt = document.createElement('div');
                prompt.innerHTML = `<span style="color:var(--glow-primary)">user@kotten:~$ </span><span>${cmdStr}</span>`;
                output.appendChild(prompt);

                cliHistory.unshift(cmdStr); 
                historyIndex = -1;
                
                const resultDiv = document.createElement('div');
                output.appendChild(resultDiv);
                
                let result;
                if (commands[cmdLower]) {
                    result = commands[cmdLower](args);
                } else {
                    result = { text: `<span class="text-red-400">Command not found: ${cmdLower}</span>`, isHtml: true };
                }
                
                if (result && result.text) {
                    if (result.isHtml) {
                        resultDiv.innerHTML = result.text;
                    } else {
                        typeEffect(resultDiv, result.text);
                    }
                }

                input.value = '';
                output.scrollTop = output.scrollHeight;
            } else if (e.key === 'ArrowUp') {
                if (historyIndex < cliHistory.length - 1) { historyIndex++; input.value = cliHistory[historyIndex]; }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex > 0) { historyIndex--; input.value = cliHistory[historyIndex]; } else { historyIndex = -1; input.value = ''; }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const partialCmd = cmdStr.split(' ')[0].toLowerCase();
                const potentialCmds = Object.keys(commands).filter(c => c.startsWith(partialCmd));
                if (potentialCmds.length === 1) {
                    input.value = potentialCmds[0] + ' ';
                } else if (potentialCmds.length > 1) {
                     const resultDiv = document.createElement('div');
                     output.appendChild(resultDiv);
                     typeEffect(resultDiv, potentialCmds.join('   '));
                     output.scrollTop = output.scrollHeight;
                }
            }
        });

        // Global keydown listener for CLI toggle and modal/lightbox closing
        document.addEventListener('keydown', e => { 
            if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') { 
                e.preventDefault(); 
                toggleCLI(true); 
            } else if (e.key === 'Escape') { 
                if (container.style.display === 'flex') {
                    toggleCLI(false); 
                } else if (document.getElementById('lightbox-overlay') && document.getElementById('lightbox-overlay').classList.contains('visible')) {
                    closeLightbox();
                } else if (document.getElementById('modal-overlay') && document.getElementById('modal-overlay').classList.contains('visible')) {
                    closeModal();
                }
            } else if (document.getElementById('lightbox-overlay') && document.getElementById('lightbox-overlay').classList.contains('visible')) {
                if (e.key === 'ArrowLeft') {
                    navigateLightbox(-1);
                } else if (e.key === 'ArrowRight') {
                    navigateLightbox(1);
                }
            }
        });
    }
    
    function initScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }

    function initSectionDots() {
        const dotsContainer = document.getElementById('section-dots');

        // Only create dots for sections that have navbar links
        const navSections = ['about', 'projects', 'repositories', 'videos', 'photos', 'setup'];

        navSections.forEach((sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                const dot = document.createElement('div');
                dot.className = 'section-dot';
                dot.setAttribute('data-section', sectionId);
                dot.addEventListener('click', () => {
                    section.scrollIntoView({ behavior: 'smooth' });
                });
                dotsContainer.appendChild(dot);
            }
        });

        // Use the same logic as the navbar for consistency
        const updateActiveDot = () => {
            let currentSectionId = '';

            // Find the section that is currently most visible at the top of the viewport
            navSections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) { // Section crosses the 150px mark from top
                        currentSectionId = sectionId;
                    }
                }
            });

            // Fallback to about section if near top of page
            if (window.scrollY < 200) currentSectionId = 'about';

            document.querySelectorAll('.section-dot').forEach(dot => {
                dot.classList.toggle('active', dot.getAttribute('data-section') === currentSectionId);
            });
        };

        window.addEventListener('scroll', updateActiveDot);
        updateActiveDot();
    }



    // Expose functions to global scope for onclick events
    window.openLightbox = openLightbox;
    window.closeLightbox = closeLightbox;
    window.navigateLightbox = navigateLightbox;

    function initParallaxEffects() {
        const parallaxBg = document.getElementById('parallax-bg');

        const updateParallax = () => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.5;
            parallaxBg.style.transform = `translateY(${rate}px)`;
        };

        window.addEventListener('scroll', updateParallax);
    }

    // ** Run Initializers **
    initLoaderAndData();
    initInteractiveBg();
    initScrollReveal();
    initNavObserver();
    initScrollProgress();
    initSectionDots();
    initParallaxEffects();
    initDataRenders();
    initThemePicker();
    initCLI();
    
    // Replaces Feather icons after all content is rendered
    feather.replace();
});
