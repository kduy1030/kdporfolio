// ── Sidebar scroll & highlight ──
const container    = document.querySelector(".container");
const links        = document.querySelectorAll(".sidebar-link");
const sidebar      = document.getElementById("sidebar");
const sections     = document.querySelectorAll(".section");
const darkSections = ["home", "about"];

links.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        container.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    });
});

// ── Skill bar animation (chạy 1 lần khi section skills vào view) ──
let skillsAnimated = false;

function animateSkills() {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById("skills");
    const sectionTop    = skillsSection.offsetTop;
    const sectionBot    = sectionTop + skillsSection.clientHeight;
    const scrollBot     = container.scrollTop + container.clientHeight;

    if (scrollBot > sectionTop + 100) {
        skillsAnimated = true;
        document.querySelectorAll(".skill-fill").forEach(bar => {
            const w = bar.getAttribute("data-width");
            setTimeout(() => { bar.style.width = w + "%"; }, 150);
        });
    }
}

container.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        if (container.scrollTop >= section.offsetTop - section.clientHeight / 2) {
            current = section.getAttribute("id");
        }
    });

    // active link
    links.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });

    // sidebar color
    sidebar.classList.toggle("on-dark",  darkSections.includes(current));
    sidebar.classList.toggle("on-light", !darkSections.includes(current));

    // parallax particles
    const heroH = document.getElementById("home").clientHeight;
    const ratio = Math.min(container.scrollTop / heroH, 1);
    canvas.style.transform = `translateY(${ratio * 60}px)`;

    // skill bars
    animateSkills();
});

sidebar.classList.add("on-dark");

// ── Avatar upload ──
const uploadInput = document.getElementById("upload-avatar");
const previewImg  = document.getElementById("preview");

if (uploadInput) {
    uploadInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => { previewImg.src = e.target.result; };
        reader.readAsDataURL(file);
    });
}

// ── Particles ──
const canvas = document.getElementById("particles");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const NUM = 65;
const particles = Array.from({ length: NUM }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r:  Math.random() * 2.2 + 0.6,
    a:  Math.random() * 0.55 + 0.1,
    pulse: Math.random() * Math.PI * 2,
}));

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // connecting lines
    for (let i = 0; i < NUM; i++) {
        for (let j = i + 1; j < NUM; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(122,170,206,${0.18 * (1 - dist/130)})`;
                ctx.lineWidth = 0.7;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // dots with pulse
    particles.forEach(p => {
        p.pulse += 0.02;
        const pr = p.r + Math.sin(p.pulse) * 0.5;

        // outer glow ring
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pr * 3.5);
        grad.addColorStop(0, `rgba(122,170,206,${p.a * 0.6})`);
        grad.addColorStop(1, `rgba(122,170,206,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, pr * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,240,247,${p.a})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;
    });

    requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Wave animation ──
const waveCanvas = document.getElementById("waves");
const wctx       = waveCanvas.getContext("2d");

function resizeWave() {
    waveCanvas.width  = waveCanvas.offsetWidth;
    waveCanvas.height = waveCanvas.offsetHeight;
}
resizeWave();
window.addEventListener("resize", resizeWave);

let wt = 0;

const waveDefs = [
    { amp: 28, period: 0.010, speed: 0.00006, yRatio: 0.72, alpha: 0.07 },
    { amp: 20, period: 0.015, speed: 0.0001, yRatio: 0.78, alpha: 0.05 },
    { amp: 35, period: 0.007, speed: 0.00004, yRatio: 0.85, alpha: 0.06 },
    { amp: 16, period: 0.019, speed: 0.00009, yRatio: 0.91, alpha: 0.04 },
];

function drawWaves() {
    wctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    const W = waveCanvas.width;
    const H = waveCanvas.height;

    waveDefs.forEach(w => {
        wctx.beginPath();
        const baseY = H * w.yRatio;
        wctx.moveTo(0, baseY);
        for (let x = 0; x <= W; x += 3) {
            const y = baseY + Math.sin(x * w.period + wt * w.speed * 60) * w.amp
                            + Math.sin(x * w.period * 1.6 + wt * w.speed * 40) * (w.amp * 0.4);
            wctx.lineTo(x, y);
        }
        wctx.lineTo(W, H);
        wctx.lineTo(0, H);
        wctx.closePath();
        wctx.fillStyle = `rgba(122,170,206,${w.alpha})`;
        wctx.fill();
    });

    wt++;
    requestAnimationFrame(drawWaves);
}
drawWaves();
