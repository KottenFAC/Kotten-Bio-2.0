// data.js

const LANYARD_USER_ID = '330073858423914506'; // User ID for Lanyard API

const portfolioData = {
    githubUsername: 'KottenFAC',
    email: 'kottenfac@proton.me',
    skills: ['C++', 'C#', 'Reverse Engineering', 'Windows Internals', 'Network Analysis', 'JavaScript', 'Node.js', 'React', 'PHP', 'Lua'],
    projects: [
        { id: 'daoc-tools', name: 'DAoC Tools', description: 'Utilities for Dark Age of Camelot.', url: 'https://haven.ftp.sh/', longDescription: 'A suite of tools designed to enhance the gameplay experience for Dark Age of Camelot. This includes packet analysis tools, UI modifications, and automation scripts built with C++ and Lua.', technologies: ['C++', 'Lua', 'Reverse Engineering'], screenshots: ['https://placehold.co/1200x800/10121A/4A80F0?text=Tool+Interface', 'https://placehold.co/1200x800/10121A/4A80F0?text=Packet+Data'] },
        { id: 'haven', name: 'Haven', description: 'Custom Windows software solutions.', url: 'https://haven.nullexistence.net/', longDescription: 'Haven is a collection of bespoke Windows software focusing on system-level programming and security. Projects range from custom drivers to application security analysis tools.', technologies: ['C++', 'Windows Internals', 'Assembly'], screenshots: [] },
        { id: 'pointplay', name: 'PointPlay', description: 'CS 1.6 HNS community website.', url: 'https://pointplay.spelar.se/', longDescription: 'A web platform for the Counter-Strike 1.6 Hide and Seek community. Features player statistics, match history, and a forum. Built with a PHP backend and a modern JavaScript frontend.', technologies: ['PHP', 'JavaScript', 'MySQL', 'HTML/CSS'], screenshots: ['https://placehold.co/1200x800/10121A/4A80F0?text=Player+Stats', 'https://placehold.co/1200x800/10121A/4A80F0?text=Forum'] }
    ],
    socials: {
        GitHub: { url: 'https://github.com/KottenFAC', icon: 'github', label: 'My GitHub Profile' },
        Steam: { url: 'https://steamcommunity.com/id/KottenFAC/', icon: 'steam', label: 'My Steam Profile' },
        Discord: { url: 'https://discord.com/invite/hFV2zJe7Fc', icon: 'discord', label: 'Join my Discord Server' },
        Gamesense: { url: 'https://gamesense.pub/forums/profile.php?id=7624', icon: 'gamesense', label: 'My Gamesense Profile' },
    },
    setup: {
        "Hardware & Office": ["LG 27GP850 (Main Monitor)", "AOC C24G1 (Second Monitor)", "Custom Built PC (AMD Ryzen 7 5700x, RTX 4060)", "Endgame Gear KB65HE Keyboard", "HITSCAN Hyperlight (Ghostglides Edgerunner Cyclone PTFE DOTS)", "X-raypad Origin Pro soft XL Mousepad", "Sennheiser HD 560S", "Genesis Radium 300 Studio XLR Mic", "M-Audio Solo Track"],
        "Development": ["Visual Studio 2022", "VS Code", "x64dbg", "IDA Pro", "Wireshark", "Cheat Engine", "Spotify (Essential)"],
        "Software & Productivity": ["Windows 11", "Linux Mint (Server)", "Ubuntu 20.04 (Second Server)", "Proton Suite"],
        "Cheat software": ["Gamesense.pub", "Plaguecheat.cc"]
    },
    youtubeVideos: [
        { id: 'TA_9arUbIvw', title: 'cs2 hvh ft skeet.cc #1 / gamesense.pub' },
        { id: 'cPWil2cjOxs', title: 'cs2 hvh ft skeet.cc #2 / gamesense.pub' }
    ]
};

const languageColors = {
    'C++': '#f34b7d', 
    'Go': '#00ADD8', 
    'JavaScript': '#f1e05a', 
    'C': '#555555', 
    'Python': '#3572A5', 
    'C#': '#178600', 
    'HTML': '#e34c26', 
    'PHP': '#4F5D95', 
    'Lua': '#000080', 
    'default': '#a9b1d6'
};

const colorThemes = {
    'blue': { primary: '#4A80F0', secondary: '#87b1ff', rgb: '74, 128, 240' },
    'green': { primary: '#34D399', secondary: '#90EE90', rgb: '52, 211, 153' },
    'purple': { primary: '#8B5CF6', secondary: '#C3A3FF', rgb: '139, 92, 246' },
    'red': { primary: '#EF4444', secondary: '#FCA5A5', rgb: '239, 68, 68' }
};

const customIcons = {
    steam: `<img src="static/icons/steam.svg" alt="Steam Icon" class="w-5 h-5" style="filter: invert(100%);" />`,
    discord: `<img src="static/icons/discord.svg" alt="Discord Icon" class="w-5 h-5" style="filter: invert(100%);" />`,
    github: `<img src="static/icons/github.svg" alt="GitHub Icon" class="w-5 h-5" style="filter: invert(100%);" />`,
    gamesense: `<img src="static/icons/gs.svg" alt="Gamesense Icon" class="w-5 h-5" style="filter: invert(100%);" />`
};
