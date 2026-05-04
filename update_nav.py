import os
import re

html_files = [
    'dashboard.html', 'ai-analysis.html', 'auth-logs.html', 
    'profile.html'
]

nav_top = """
    <nav class="nav">
        <div class="nav-inner">
            <div class="nav-logo">
                <i class="fa-solid fa-shield-halved"></i> Security Web
            </div>
            <div class="nav-links">
                <a href="dashboard.html" class="nav-link" id="nav-dashboard"><i class="fa-solid fa-house"></i> Dashboard</a>
                <a href="auth-logs.html" class="nav-link" id="nav-logs"><i class="fa-solid fa-clock-rotate-left"></i> Logs</a>
                <a href="ai-analysis.html" class="nav-link" id="nav-ai"><i class="fa-solid fa-brain"></i> Analyse IA</a>
                <a href="profile.html" class="nav-link" id="nav-profile"><i class="fa-solid fa-user-pen"></i> Profil</a>
            </div>
            <div class="nav-user" style="display:flex;align-items:center;gap:1rem;">
                <span class="nav-email" id="navUserEmail"></span>
                <button onclick="logout()" class="btn btn-ghost btn-sm" style="color:var(--red);"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
            </div>
        </div>
    </nav>
"""

nav_bottom = """
    <nav class="bottom-nav">
        <div class="bottom-nav-inner">
            <a href="dashboard.html" class="bottom-nav-item" id="bnav-dashboard"><i class="fa-solid fa-house"></i><span>Accueil</span></a>
            <a href="auth-logs.html" class="bottom-nav-item" id="bnav-logs"><i class="fa-solid fa-clock-rotate-left"></i><span>Logs</span></a>
            <a href="ai-analysis.html" class="bottom-nav-item" id="bnav-ai"><i class="fa-solid fa-brain"></i><span>IA</span></a>
            <a href="profile.html" class="bottom-nav-item" id="bnav-profile"><i class="fa-solid fa-user"></i><span>Profil</span></a>
        </div>
    </nav>
"""

for f in html_files:
    path = os.path.join(r'c:\Users\User\OneDrive\Desktop\Projet securité\frontend', f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Remove existing navs
        content = re.sub(r'<nav class="nav">.*?</nav>', '', content, flags=re.DOTALL)
        content = re.sub(r'<nav class="bottom-nav">.*?</nav>', '', content, flags=re.DOTALL)
        
        # Inject nav_top after <body>
        content = content.replace('<body>', f'<body>\n{nav_top}')
        # Inject nav_bottom before </body>
        content = content.replace('</body>', f'{nav_bottom}\n</body>')
        
        # Make the current nav link active
        if 'dashboard.html' in f:
            content = content.replace('id="nav-dashboard"', 'id="nav-dashboard" class="nav-link active"')
            content = content.replace('id="bnav-dashboard"', 'id="bnav-dashboard" class="bottom-nav-item active"')
        elif 'auth-logs.html' in f:
            content = content.replace('id="nav-logs"', 'id="nav-logs" class="nav-link active"')
            content = content.replace('id="bnav-logs"', 'id="bnav-logs" class="bottom-nav-item active"')
        elif 'ai-analysis.html' in f:
            content = content.replace('id="nav-ai"', 'id="nav-ai" class="nav-link active"')
            content = content.replace('id="bnav-ai"', 'id="bnav-ai" class="bottom-nav-item active"')
        elif 'profile.html' in f:
            content = content.replace('id="nav-profile"', 'id="nav-profile" class="nav-link active"')
            content = content.replace('id="bnav-profile"', 'id="bnav-profile" class="bottom-nav-item active"')
            
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Updated {f}')
