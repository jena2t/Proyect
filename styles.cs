* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

body {
    min-height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    background: linear-gradient(-45deg, #6a82fb, #fc5c7d, #45b649, #06beb6);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    display: flex;
    position: relative;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    z-index: -1;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.dashboard-container {
    display: flex;
    width: 100%;
    min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
    width: 250px;
    min-height: 100vh;
    background: rgba(255, 255, 255, 0.08);
    border-right: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(180%);
    padding: 20px 0;
    transform: perspective(1000px) rotateY(5deg);
    transition: all 0.3s ease;
    z-index: 10;
}

.sidebar-header {
    padding: 0 20px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
}

.sidebar-header h2 {
    color: white;
    font-weight: 600;
    font-size: 1.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.sidebar-menu {
    list-style: none;
}

.menu-item {
    position: relative;
    padding: 15px 20px;
    margin: 5px 10px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.8);
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateZ(10px);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    color: white;
}

.menu-item.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
}

.menu-icon {
    font-size: 1.2rem;
    margin-right: 15px;
    transition: transform 0.3s ease;
}

.menu-item:hover .menu-icon {
    transform: scale(1.2);
}

.menu-text {
    font-weight: 500;
}

.active-indicator {
    position: absolute;
    right: 15px;
    width: 6px;
    height: 6px;
    background: #4cc9f0;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
    box-shadow: 0 0 10px #4cc9f0;
}

.menu-item.active .active-indicator {
    opacity: 1;
}

/* Main Content Styles */
.main-content {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.page {
    display: none;
    width: 100%;
    max-width: 900px;
    animation: fadeIn 0.5s ease;
}

.page.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.main-title {
    font-size: 3.5rem;
    font-weight: 700;
    text-align: center;
    color: white;
    margin-bottom: 40px;
    text-shadow: 
        0 0 10px rgba(255, 255, 255, 0.5),
        0 0 20px rgba(255, 255, 255, 0.3),
        0 0 30px rgba(255, 255, 255, 0.2);
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
    line-height: 1.2;
}

/* Weather Card */
.weather-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(180%);
    border-radius: 20px;
    padding: 30px;
    width: 300px;
    box-shadow: 
        0 8px 25px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
    transform: perspective(1000px) rotateX(5deg);
    transition: transform 0.3s ease;
}

.weather-card:hover {
    transform: perspective(1000px) rotateX(5deg) translateZ(10px);
}

.weather-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
        to bottom right,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 50%
    );
    transform: rotate(30deg);
}

.weather-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.temperature {
    font-size: 3rem;
    font-weight: 700;
    color: white;
}

.weather-icon {
    font-size: 4rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.weather-details {
    color: rgba(255, 255, 255, 0.8);
}

.weather-details p {
    margin-bottom: 5px;
}

/* Particles Animation */
.particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: float 6s infinite ease-in-out;
}

.particle:nth-child(1) {
    width: 8px;
    height: 8px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.particle:nth-child(2) {
    width: 6px;
    height: 6px;
    top: 60%;
    left: 80%;
    animation-delay: 1s;
}

.particle:nth-child(3) {
    width: 10px;
    height: 10px;
    top: 40%;
    left: 40%;
    animation-delay: 2s;
}

.particle:nth-child(4) {
    width: 5px;
    height: 5px;
    top: 80%;
    left: 20%;
    animation-delay: 3s;
}

.particle:nth-child(5) {
    width: 7px;
    height: 7px;
    top: 30%;
    left: 70%;
    animation-delay: 4s;
}

@keyframes float {
    0%, 100% { 
        transform: translateY(0) translateX(0); 
        opacity: 0;
    }
    50% { 
        transform: translateY(-20px) translateX(10px); 
        opacity: 1;
    }
}

/* Page Titles */
.page-title {
    font-size: 2.5rem;
    font-weight: 600;
    text-align: center;
    color: white;
    margin-bottom: 30px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Projects Grid */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    width: 100%;
}

.project-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(180%);
    border-radius: 15px;
    padding: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.project-card:hover {
    transform: translateY(-5px) translateZ(10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
}

.project-card h3 {
    color: white;
    margin-bottom: 10px;
}

.project-card p {
    color: rgba(255, 255, 255, 0.7);
}

/* Stats Container */
.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    width: 100%;
}

.stat-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(180%);
    border-radius: 15px;
    padding: 25px;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.stat-card:hover {
    transform: translateY(-5px) translateZ(10px);
}

.stat-card h3 {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    margin-bottom: 10px;
}

.stat-value {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
}

/* Settings Container */
.settings-container {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(180%);
    border-radius: 15px;
    padding: 25px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item:last-child {
    border-bottom: none;
}

.setting-item label {
    color: white;
    font-weight: 500;
}

.setting-item select,
.setting-item input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 8px 12px;
    color: white;
    outline: none;
}

.setting-item select option {
    background: #2a2a2a;
    color: white;
}

/* Profile Container */
.profile-container {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(180%);
    border-radius: 15px;
    padding: 30px;
    width: 100%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.profile-avatar {
    font-size: 4rem;
    margin-bottom: 20px;
}

.profile-info h3 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.profile-info p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
}

/* Mobile Menu Button */
.mobile-menu-btn {
    display: none;
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 100;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    border-radius: 8px;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
    .main-title {
        font-size: 2.8rem;
    }
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: -100%;
        top: 0;
        height: 100%;
        width: 280px;
        transition: left 0.3s ease;
        transform: none;
        z-index: 90;
    }

    .sidebar.active {
        left: 0;
    }

    .main-content {
        padding: 80px 20px 20px;
    }

    .main-title {
        font-size: 2.2rem;
    }

    .mobile-menu-btn {
        display: block;
    }

    .weather-card {
        width: 100%;
        max-width: 300px;
    }

    .projects-grid {
        grid-template-columns: 1fr;
    }

    .stats-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .main-title {
        font-size: 1.8rem;
    }

    .page-title {
        font-size: 2rem;
    }

    .main-content {
        padding: 80px 15px 15px;
    }
}
