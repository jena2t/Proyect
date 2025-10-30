document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const themeToggle = document.getElementById('themeToggle');
    
    // Cambiar página al hacer clic en un elemento del menú
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            
            // Remover clase active de todos los elementos del menú
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // Añadir clase active al elemento clickeado
            this.classList.add('active');
            
            // Ocultar todas las páginas
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Mostrar la página correspondiente
            document.getElementById(`${pageId}-page`).classList.add('active');
            
            // Cerrar menú móvil si está abierto
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Toggle menú móvil
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Toggle tema oscuro/claro
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.querySelector('.theme-label').textContent = 'Modo Claro';
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.querySelector('.theme-label').textContent = 'Modo Oscuro';
        }
    });
    
    // Efectos 3D en hover para elementos interactivos
    const interactiveElements = document.querySelectorAll('.menu-item, .stat-card-large, .product-card, .game-btn, .ui-btn, .day-item, .location-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateZ(15px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.2)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Animación de partículas para el fondo
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamaño aleatorio
        const size = Math.random() * 8 + 2;
        
        // Establecer propiedades
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Añadir al body
        document.body.appendChild(particle);
        
        // Remover después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000);
    }
    
    // Crear partículas periódicamente
    setInterval(createParticle, 1000);
    
    // Cerrar menú móvil al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !mobileMenuBtn.contains(event.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
    
    // Efecto de parallax en el fondo
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        
        document.body.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
    });
    
    // Simular cambio de días en el pronóstico del tiempo
    const dayItems = document.querySelectorAll('.day-item');
    dayItems.forEach(day => {
        day.addEventListener('click', function() {
            dayItems.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Actualizar progreso de proyectos
    function updateProgress() {
        const activeProjects = document.querySelectorAll('.menu-item').length;
        const totalProjects = 30;
        const progress = (activeProjects / totalProjects) * 100;
        
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = `Progreso: ${activeProjects} de ${totalProjects} proyectos`;
        document.querySelector('.projects-count').textContent = `${activeProjects}/${totalProjects}`;
    }
    
    // Inicializar
    updateProgress();
    
    // Añadir estilos para partículas
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: fixed;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: float 6s infinite ease-in-out;
            pointer-events: none;
            z-index: -1;
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
    `;
    document.head.appendChild(style);
});
