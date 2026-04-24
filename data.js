// ============================================
// Data & Configuration
// ============================================

export const LANYARD_USER_ID = '330073858423914506';

export const portfolioData = {
    githubUsername: 'KottenFAC',
    email: 'kottenfac@proton.me',
    skills: ['C++', 'C#', 'Reverse Engineering', 'Windows Internals', 'Network Analysis', 'JavaScript', 'Node.js', 'React', 'PHP', 'Lua'],
    projects: [
        {
            id: 'daoc-tools',
            name: 'DAoC Tools',
            description: 'Utilities for Dark Age of Camelot.',
            url: 'https://haven.ftp.sh/',
            longDescription: 'A suite of tools designed to enhance the gameplay experience for Dark Age of Camelot. This includes packet analysis tools, UI modifications, and automation scripts built with C++ and Lua.',
            technologies: ['C++', 'Lua', 'Reverse Engineering'],
            screenshots: ['https://placehold.co/1200x800/10121A/4A80F0?text=Tool+Interface', 'https://placehold.co/1200x800/10121A/4A80F0?text=Packet+Data']
        },
        {
            id: 'haven',
            name: 'Haven',
            description: 'Custom Windows software solutions.',
            url: 'https://haven.nullexistence.net/',
            longDescription: 'Haven is a collection of bespoke Windows software focusing on system-level programming and security. Projects range from custom drivers to application security analysis tools.',
            technologies: ['C++', 'Windows Internals', 'Assembly'],
            screenshots: []
        },
        {
            id: 'pointplay',
            name: 'PointPlay',
            description: 'CS 1.6 HNS community website.',
            url: 'https://pointplay.spelar.se/',
            longDescription: 'A web platform for the Counter-Strike 1.6 Hide and Seek community. Features player statistics, match history, and a forum. Built with a PHP backend and a modern JavaScript frontend.',
            technologies: ['PHP', 'JavaScript', 'MySQL', 'HTML/CSS'],
            screenshots: ['https://placehold.co/1200x800/10121A/4A80F0?text=Player+Stats', 'https://placehold.co/1200x800/10121A/4A80F0?text=Forum']
        }
    ],
    socials: {
        GitHub: { url: 'https://github.com/KottenFAC', icon: 'github', label: 'My GitHub Profile' },
        Steam: { url: 'https://steamcommunity.com/id/KottenFAC/', icon: 'steam', label: 'My Steam Profile' },
        Discord: { url: 'https://discord.com/invite/hFV2zJe7Fc', icon: 'discord', label: 'Join my Discord Server' },
        Gamesense: { url: 'https://gamesense.pub/forums/profile.php?id=7624', icon: 'gamesense', label: 'My Gamesense Profile' },
    },
    setup: {
        "Hardware & Office": [
            "LG 27GP850 (Main Monitor)",
            "AOC C24G1 (Second Monitor)",
            "Custom Built PC (AMD Ryzen 7 5700x, RTX 4060)",
            "Endgame Gear KB65HE Keyboard",
            "HITSCAN Hyperlight (Ghostglides Edgerunner Cyclone PTFE DOTS)",
            "Artisan FX Zero Soft",
            "Sennheiser HD 560S",
            "Genesis Radium 300 Studio XLR Mic",
            "M-Audio Solo Track"
        ],
        "Development": [
            "Visual Studio 2022",
            "VS Code",
            "Binary Ninja",
            "x64dbg",
            "IDA Pro",
            "Wireshark",
            "Cheat Engine",
            "Spotify (Essential)"
        ],
        "Software & Productivity": [
            "Windows 11",
            "Linux Mint (Server)",
            "Ubuntu 20.04 (Second Server)",
            "Proton Suite"
        ],
        "Cheat software": [
            "Gamesense.pub"
        ]
    },
    youtubeVideos: [
        { id: 'TA_9arUbIvw', title: 'cs2 hvh ft skeet.cc #1 / gamesense.pub' },
        { id: 'cPWil2cjOxs', title: 'cs2 hvh ft skeet.cc #2 / gamesense.pub' }
    ],
    photoGallery: [
        "Arma3_x64 2025-08-22 17-45-58_327.png",
        "Arma3_x64 2025-08-22 19-15-54_387.png",
        "Arma3_x64 2025-08-22 19-17-57_269.png",
        "Arma3_x64 2025-08-22 23-14-45_113.png",
        "Arma3_x64 2025-08-22 23-17-54_359.png",
        "Arma3_x64 2025-08-23 13-50-21_691.png",
        "Arma3_x64 2025-08-23 14-56-00_255.png",
        "Arma3_x64 2025-08-23 14-58-44_871.png",
        "Arma3_x64 2025-08-23 14-59-37_998.png"
    ]
};

export const languageColors = {
    'C++': '#f34b7d',
    'Go': '#00ADD8',
    'JavaScript': '#f1e05a',
    'C': '#555555',
    'Python': '#3572A5',
    'C#': '#178600',
    'HTML': '#e34c26',
    'PHP': '#4F5D95',
    'Lua': '#000080',
    'TypeScript': '#3178c6',
    'Rust': '#dea584',
    'default': '#a9b1d6'
};

export const colorThemes = {
    'blue': { primary: '#4A80F0', secondary: '#87b1ff', rgb: '74, 128, 240' },
    'green': { primary: '#34D399', secondary: '#90EE90', rgb: '52, 211, 153' },
    'purple': { primary: '#8B5CF6', secondary: '#C3A3FF', rgb: '139, 92, 246' },
    'red': { primary: '#EF4444', secondary: '#FCA5A5', rgb: '239, 68, 68' },
    'amber': { primary: '#F59E0B', secondary: '#FCD34D', rgb: '245, 158, 11' },
    'cyan': { primary: '#06B6D4', secondary: '#67E8F9', rgb: '6, 182, 212' }
};

export const customIcons = {
    steam: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.602 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.877-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012zM20.201 7.14c0-1.027-.836-1.861-1.861-1.861s-1.861.834-1.861 1.861c0 1.025.836 1.861 1.861 1.861s1.861-.836 1.861-1.861z"/></svg>`,
    discord: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    gamesense: `<span class="gamesense-icon" aria-hidden="true"></span>`
};
