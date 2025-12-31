/**
 * Shaik Mohammad Rayyan - Portfolio Script
 * Pure Vanilla JavaScript + Three.js + GSAP
 */

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initInteractions();
    initParallax();
    initModal();
    initResume();
});

// 1. Lightweight Three.js Background
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x8a4fff,
        transparent: true,
        opacity: 0.5
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.001;
        
        // Soft camera movement based on mouse
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// 2. Hero Image Parallax Interaction
function initParallax() {
    const img = document.getElementById('parallax-img');
    const wrapper = document.querySelector('.hero-image-wrapper');

    if (window.innerWidth > 768) {
        wrapper.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = wrapper.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            gsap.to(img, {
                duration: 0.5,
                x: x * 30,
                y: y * 30,
                rotateY: x * 10,
                rotateX: -y * 10,
                ease: "power2.out"
            });
        });

        wrapper.addEventListener('mouseleave', () => {
            gsap.to(img, { duration: 0.8, x: 0, y: 0, rotateY: 0, rotateX: 0, ease: "elastic.out(1, 0.5)" });
        });
    }
}

// 3. GSAP Entry Animations
function initInteractions() {
    gsap.from(".main-title", { opacity: 0, y: 30, duration: 1, delay: 0.2 });
    gsap.from(".hero-img", { opacity: 0, scale: 0.9, duration: 1.2, ease: "power3.out" });
    gsap.from(".hero-btns", { opacity: 0, y: 20, duration: 1, delay: 0.5 });
}

// 4. Certification Modal Logic
function initModal() {
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-modal');
    const certBtns = document.querySelectorAll('.view-cert-btn');

    certBtns.forEach(btn => {
        btn.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.getAttribute('data-src');
            document.body.style.overflow = "hidden"; // Prevent scroll
        }
    });

    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    closeBtn.onclick = closeModal;
    window.onclick = (e) => { if (e.target == modal) closeModal(); };
    window.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); });
}

function initResume() {
    const resumeModal = document.getElementById('resume-modal');
    const showBtn = document.getElementById('show-resume');
    const closeBtn = document.querySelector('.close-resume');

    // Show Resume and Blur Background
    showBtn.addEventListener('click', () => {
        resumeModal.style.display = "block";
        document.body.style.overflow = "hidden"; // Stops the main page from scrolling
    });

    // Close Resume
    const closeAll = () => {
        resumeModal.style.display = "none";
        document.body.style.overflow = "auto"; // Returns scrolling to main page
    };

    closeBtn.addEventListener('click', closeAll);

    // Close if user clicks the dark background
    window.addEventListener('click', (e) => {
        if (e.target == resumeModal) closeAll();
    });
}