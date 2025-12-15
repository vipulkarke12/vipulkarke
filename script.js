document.addEventListener('DOMContentLoaded', () => {

    // Typing Animation
    const texts = ["DevOps Engineer", "Cloud Engineer"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;

    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        if (document.querySelector('.typing-text')) {
            document.querySelector('.typing-text').textContent = letter;
        }

        let typeSpeed = 100;
        if (isDeleting) typeSpeed = 50;

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    })();

    // Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
            if (typeof threeJSApp !== 'undefined' && threeJSApp) threeJSApp.updateTheme(true);
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
            if (typeof threeJSApp !== 'undefined' && threeJSApp) threeJSApp.updateTheme(false);
        }
    });

    // Projects Section Scroll Animation
    const projectsSection = document.querySelector('#projects');
    const projectCards = document.querySelectorAll('.project-card');

    if (projectsSection && projectCards.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    projectCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('slide-up');
                        }, index * 150);
                    });
                    projectObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        projectObserver.observe(projectsSection);
    }

    // Certifications Section Scroll Animation
    const certificationsSection = document.querySelector('#certifications');
    const certCards = document.querySelectorAll('.cert-card');

    if (certificationsSection && certCards.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const certObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    certCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('slide-up');
                        }, index * 150);
                    });
                    certObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        certObserver.observe(certificationsSection);
    }

    // Hobbies Carousel
    const slides = document.querySelectorAll('.hobby-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Smooth Scroll for Anchor Links (Optional enhanced behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Three.js Background Animation - Orbital Spheres
    const initThreeJS = () => {
        const container = document.getElementById('canvas-container');
        if (!container) return null; // Exit if no container (e.g., on photography page)

        // Scene setup
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Orbital system
        const sphereCount = 700; // Increased for denser background
        const group = new THREE.Group();
        scene.add(group);

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', onDocumentMouseMove, false);

        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        }

        const spheres = [];
        const orbitalData = [];
        const materials = []; // Store materials to update them later

        // Create spheres with orbital properties
        for (let i = 0; i < sphereCount; i++) {
            // Varied sphere sizes (like stars of different brightness)
            const size = Math.random() * 2 + 0.5; // 0.5 to 2.5

            // Higher segments for rounder spheres
            const geometry = new THREE.SphereGeometry(size, 16, 16);

            // Initial Color Check
            const isDark = document.body.classList.contains('dark-mode');
            const initialColor = isDark ? 0xaaaaaa : 0xd946a6; // Grey for Dark, Pink for Light

            const material = new THREE.MeshBasicMaterial({
                color: initialColor,
                transparent: true,
                opacity: 0.6 + Math.random() * 0.4
            });
            materials.push(material);

            const sphere = new THREE.Mesh(geometry, material);

            // Orbital properties
            const radius = Math.random() * 400 + 100; // Distance from center
            const speed = (Math.random() * 0.003 + 0.002) * (1 / radius) * 100; // Faster orbital speed
            const angle = Math.random() * Math.PI * 2; // Starting angle
            const inclination = (Math.random() - 0.5) * Math.PI; // Orbital tilt
            const azimuth = Math.random() * Math.PI * 2; // Rotation around Y axis

            orbitalData.push({
                radius: radius,
                speed: speed,
                angle: angle,
                inclination: inclination,
                azimuth: azimuth
            });

            // Initial position
            sphere.position.x = Math.cos(angle) * radius * Math.cos(inclination);
            sphere.position.y = Math.sin(inclination) * radius;
            sphere.position.z = Math.sin(angle) * radius * Math.cos(inclination);

            spheres.push(sphere);
            group.add(sphere);
        }

        // Resize handler
        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            targetX = mouseX * 0.0005;
            targetY = mouseY * 0.0005;

            // Base rotation (continuous) + mouse influence (direction)
            group.rotation.y += 0.003 + (0.05 * (targetX - group.rotation.y));
            group.rotation.x += 0.05 * (targetY - group.rotation.x);

            // Update orbital positions
            for (let i = 0; i < sphereCount; i++) {
                const data = orbitalData[i];

                // Increment angle based on speed (orbital motion)
                data.angle += data.speed;

                // Calculate new position in 3D orbit
                const x = Math.cos(data.angle + data.azimuth) * data.radius * Math.cos(data.inclination);
                const y = Math.sin(data.inclination) * data.radius;
                const z = Math.sin(data.angle + data.azimuth) * data.radius * Math.cos(data.inclination);

                spheres[i].position.set(x, y, z);

                // Slight rotation of each sphere for added effect
                spheres[i].rotation.x += 0.01;
                spheres[i].rotation.y += 0.01;
            }

            renderer.render(scene, camera);
        }

        animate();

        // Return interface to update theme
        return {
            updateTheme: (isDarkMode) => {
                const newColor = isDarkMode ? 0xaaaaaa : 0xd946a6;
                materials.forEach(mat => mat.color.setHex(newColor));
            }
        };
    };

    const threeJSApp = initThreeJS();



    // Photography Lightbox Logic
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    // Select all photo cards (the '.group' divs) inside the grid
    // We attach the listener to the CARD, because the gradient overlay sits on top of the image
    const galleryContainer = document.getElementById('gallery-grid');
    const photoCards = galleryContainer ? galleryContainer.querySelectorAll('.group') : [];

    console.log("Lightbox Init: Modal found?", !!lightboxModal);
    console.log("Lightbox Init: Cards found?", photoCards.length);

    if (lightboxModal && photoCards.length > 0) {
        // Open Lightbox
        photoCards.forEach((card) => {
            const img = card.querySelector('img');
            if (img) {
                // Make the whole card clickable
                card.style.cursor = 'zoom-in';

                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log("Card clicked! Opening image:", img.src);
                    lightboxImage.src = img.src;
                    lightboxModal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                });
            }
        });

        // Close Lightbox function
        const closeLightbox = () => {
            console.log("Closing lightbox");
            lightboxModal.classList.add('hidden');
            lightboxImage.src = '';
            document.body.style.overflow = '';
        };

        // Close on Button Click
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        // Close on Background Click
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // Close on Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightboxModal.classList.contains('hidden')) {
                closeLightbox();
            }
        });
    }

    // Photography Card Background Slideshow
    const photoSlides = document.querySelectorAll('.photo-bg-slide');
    if (photoSlides.length > 0) {
        let currentPhotoIndex = 0;

        setInterval(() => {
            // Hide current
            photoSlides[currentPhotoIndex].classList.remove('opacity-60', 'group-hover:opacity-40');
            photoSlides[currentPhotoIndex].classList.add('opacity-0');

            // Move to next
            currentPhotoIndex = (currentPhotoIndex + 1) % photoSlides.length;

            // Show next
            photoSlides[currentPhotoIndex].classList.remove('opacity-0');
            photoSlides[currentPhotoIndex].classList.add('opacity-60', 'group-hover:opacity-40');
        }, 3000); // 3 seconds
    }
});
