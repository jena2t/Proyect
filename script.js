document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
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
    
    // Efectos 3D en hover para elementos interactivos
    const interactiveElements = document.querySelectorAll('.menu-item, .project-card, .stat-card, .weather-card');
    
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
    
    // Animación de partículas adicional
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
        
        // Añadir al contenedor de partículas
        const particlesContainer = document.querySelector('.particles-container');
        if (particlesContainer) {
            particlesContainer.appendChild(particle);
            
            // Remover después de la animación
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 6000);
        }
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
    
    // Actualizar hora en la tarjeta del clima (simulación)
    function updateWeatherTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Actualizar elemento si existe
        const timeElement = document.querySelector('.weather-time');
        if (!timeElement) {
            // Crear elemento si no existe
            const weatherDetails = document.querySelector('.weather-details');
            if (weatherDetails) {
                const timeElement = document.createElement('p');
                timeElement.classList.add('weather-time');
                timeElement.textContent = `Actualizado: ${timeString}`;
                weatherDetails.appendChild(timeElement);
            }
        } else {
            timeElement.textContent = `Actualizado: ${timeString}`;
        }
    }
    
    // Actualizar cada minuto
    setInterval(updateWeatherTime, 60000);
    updateWeatherTime(); // Llamada inicial
});
