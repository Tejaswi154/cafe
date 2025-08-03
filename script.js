// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Form submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
                contactForm.reset();
            } else {
                alert(`Error: ${data.error || 'Failed to send message.'}`);
            }
        } catch (error) {
            alert('Error: Could not connect to the server.');
        }
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            const response = await fetch('http://localhost:5000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(data.message);
                newsletterForm.reset();
            } else {
                alert(`Error: ${data.error || 'Failed to subscribe.'}`);
            }
        } catch (error) {
            alert('Error: Could not connect to the server.');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Menu filtering
const menuTabs = document.querySelectorAll('.tab-button');
const menuCards = document.querySelectorAll('.menu-card');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        menuTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Get category from data attribute
        const category = tab.getAttribute('data-category');
        
        // Filter menu items
        menuCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Back to top button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add animation class to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.menu-card, .gallery-item, .testimonial-card, .about-text, .about-image');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.menu-card, .gallery-item, .testimonial-card, .about-text, .about-image');
    
    animatedElements.forEach(element => {
        if (element.classList.contains('menu-card')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
    });
    
    // Trigger initial check
    animateOnScroll();
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Initialize the first testimonial as active
document.addEventListener('DOMContentLoaded', () => {
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        firstTab.classList.add('active');
    }
});
