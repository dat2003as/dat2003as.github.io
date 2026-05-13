document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const sections = document.querySelectorAll('.section, .hero');
    const scrollProgress = document.getElementById('scrollProgress');
    const mouseGlow = document.getElementById('mouseGlow');
    const backToTop = document.getElementById('backToTop');

    // -- Scroll progress bar + nav shadow + active link + back-to-top
    const navAnchors = navLinks.querySelectorAll('a');
    function onScroll() {
        nav.classList.toggle('nav--scrolled', window.scrollY > 10);

        // Scroll progress
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';

        // Back to top
        backToTop.classList.toggle('back-to-top--visible', window.scrollY > 400);

        // Active nav link
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // -- Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // -- Mouse glow follower
    document.addEventListener('mousemove', e => {
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
        mouseGlow.classList.add('mouse-glow--visible');
    });
    document.addEventListener('mouseleave', () => {
        mouseGlow.classList.remove('mouse-glow--visible');
    });

    // -- Particles in hero
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                ctx.fill();

                // Connect nearby particles with lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // -- Mobile menu
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav__links--open');
        const spans = navToggle.querySelectorAll('span');
        const open = navLinks.classList.contains('nav__links--open');
        spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
        spans[1].style.opacity = open ? '0' : '1';
        spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('nav__links--open');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });

    // -- Scroll animations with stagger + multiple animation types
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const cls = e.target.dataset.animate || 'fade-in';
                e.target.classList.add(cls + '--visible');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    // Skill cards: staggered fade-in
    document.querySelectorAll('.skill-card').forEach((el, i) => {
        el.classList.add('fade-in', 'stagger-' + Math.min(i + 1, 6));
        revealObserver.observe(el);
    });

    // Timeline items: slide from left
    document.querySelectorAll('.timeline__item').forEach((el, i) => {
        el.classList.add('fade-in', 'stagger-' + Math.min(i + 1, 6));
        el.dataset.animate = 'fade-in';
        revealObserver.observe(el);
    });

    // Projects: alternate slide direction
    document.querySelectorAll('.project').forEach((el, i) => {
        const dir = i % 2 === 0 ? 'slide-left' : 'slide-right';
        el.classList.add(dir);
        el.dataset.animate = dir;
        revealObserver.observe(el);
    });

    // Contact cards: staggered scale-in
    document.querySelectorAll('.contact-card').forEach((el, i) => {
        el.classList.add('scale-in', 'stagger-' + Math.min(i + 1, 6));
        el.dataset.animate = 'scale-in';
        revealObserver.observe(el);
    });

    // Award cards: fade-in staggered
    document.querySelectorAll('.award-card').forEach((el, i) => {
        el.classList.add('fade-in', 'stagger-' + Math.min(i + 1, 6));
        revealObserver.observe(el);
    });

    // Awards photo: scale-in
    document.querySelectorAll('.awards__photo').forEach(el => {
        el.classList.add('scale-in');
        el.dataset.animate = 'scale-in';
        revealObserver.observe(el);
    });

    // Section titles: reveal underline
    const titleObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                titleObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.section__title').forEach(el => titleObserver.observe(el));

    // -- Tilt effect on card hover
    document.querySelectorAll('.skill-card, .contact-card, .award-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;
            card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // -- Typing effect for hero title
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid rgba(255,255,255,.7)';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                heroTitle.textContent += text[i];
                i++;
                setTimeout(typeChar, 60);
            } else {
                setTimeout(() => { heroTitle.style.borderRight = 'none'; }, 1500);
            }
        }
        setTimeout(typeChar, 800);
    }

    // -- Counter animation for stats in project highlights
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('strong').forEach(el => {
                    const match = el.textContent.match(/^(\d+)/);
                    if (match) {
                        const target = parseInt(match[1]);
                        const suffix = el.textContent.replace(/^\d+/, '');
                        let current = 0;
                        const step = Math.ceil(target / 30);
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            el.textContent = current + suffix;
                        }, 30);
                    }
                });
                counterObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.project__highlights').forEach(el => counterObserver.observe(el));

    // -- Project gallery thumbnails
    document.querySelectorAll('.project__thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const project = thumb.closest('.project');
            const mediaContainer = project.querySelector('.project__featured-media');
            const type = thumb.dataset.type;
            const src = thumb.dataset.src;

            project.querySelectorAll('.project__thumb').forEach(t =>
                t.classList.remove('project__thumb--active')
            );
            thumb.classList.add('project__thumb--active');

            mediaContainer.style.opacity = '0';
            mediaContainer.style.transform = 'scale(.96)';
            setTimeout(() => {
                if (type === 'video') {
                    mediaContainer.innerHTML =
                        `<video controls muted preload="metadata"><source src="${src}" type="video/mp4"></video>`;
                } else {
                    mediaContainer.innerHTML =
                        `<img src="${src}" alt="" class="project__img">`;
                }
                requestAnimationFrame(() => {
                    mediaContainer.style.opacity = '1';
                    mediaContainer.style.transform = 'scale(1)';
                });
            }, 250);
        });
    });

    // -- Lightbox for images
    document.addEventListener('click', e => {
        if (e.target.classList.contains('project__img')) {
            lightboxImg.src = e.target.src;
            lightbox.classList.add('lightbox--open');
            document.body.style.overflow = 'hidden';
        }
    });
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('lightbox--open');
        document.body.style.overflow = '';
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
            lightbox.classList.remove('lightbox--open');
            document.body.style.overflow = '';
        }
    });
});
