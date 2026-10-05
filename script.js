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

// ── Quest path animation (chạy 1 lần khi section achievements vào view) ──



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
    
    // quest path drawing
    animateQuestPath();
});

sidebar.classList.add("on-dark");


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
    { amp: 20, period: 0.015, speed: 0.00009, yRatio: 0.78, alpha: 0.05 },
    { amp: 35, period: 0.007, speed: 0.00004, yRatio: 0.85, alpha: 0.06 },
    { amp: 16, period: 0.019, speed: 0.00011, yRatio: 0.91, alpha: 0.04 },
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

// ── Modal ──
function openModal(btn) {
    const modal = document.getElementById("projectModal");
    document.getElementById("modalTitle").textContent   = btn.dataset.modalTitle;
    document.getElementById("modalDesc").textContent    = btn.dataset.modalDesc;
    document.getElementById("modalTech").textContent    = btn.dataset.modalTech;
    document.getElementById("modalGithub").href         = btn.dataset.modalGithub;
    document.getElementById("modalLive").href           = btn.dataset.modalLive;
    modal.classList.add("active");
    // Re-render lucide icons inside modal
    lucide.createIcons();
}

function closeModal() {
    document.getElementById("projectModal").classList.remove("active");
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById("projectModal")) closeModal();
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
});

// ── About Info Modal ──
const aboutModalData = {
    age: {
        title: "🎂 Hành Trình Tuổi Thơ",
        render: () => `
        <div class="abt-timeline">
            <div class="abt-tl-item">
                <p class="abt-tl-age">6 tuổi</p>
                <p class="abt-tl-label">Tiểu học</p>
                <p class="abt-tl-sub">Trường tiểu học Vân Diên, Nam Đàn, Nghệ An</p>
            </div>
            <div class="abt-tl-item">
                <p class="abt-tl-age">12 tuổi</p>
                <p class="abt-tl-label">Trung học Cơ sở</p>
                <p class="abt-tl-sub">Trường THCS Đặng Chánh Kỷ, Nam Đàn, Nghệ An</p>
            </div>
            <div class="abt-tl-item">
                <p class="abt-tl-age">15 tuổi</p>
                <p class="abt-tl-label">Trung học Phổ thông</p>
                <p class="abt-tl-sub">Trường THPT Nam Đàn I, Nam Đàn, Nghệ An</p>
            </div>
            <div class="abt-tl-item">
                <p class="abt-tl-age">18 tuổi</p>
                <p class="abt-tl-label">Đại học Bách Khoa Hà Nội</p>
                <p class="abt-tl-sub">Chuyên ngành Khoa học máy tính · IT1 · 2025</p>
            </div>
        </div>`
    },
    student: {
        title: "🎓 Thành Tích Học Tập",
        render: () => `
        <div class="abt-stat-grid">
            <div class="abt-stat-card">
                <p class="abt-stat-label">Kỳ thi đánh giá tư duy 2025</p>
                <p class="abt-stat-val">83.35</p>
                <p class="abt-stat-desc">TSA</p>
            </div>
            <div class="abt-stat-card">
                <p class="abt-stat-label">Điểm THPT</p>
                <p class="abt-stat-val">27.25</p>
                <p class="abt-stat-desc">Khối A00</p>
            </div>
            <div class="abt-stat-card">
                <p class="abt-stat-label">Ngành</p>
                <p class="abt-stat-val" style="font-size:1rem;">IT1</p>
                <p class="abt-stat-desc">Khoa học máy tính</p>
            </div>
            <div class="abt-stat-card">
                <p class="abt-stat-label">Lớp</p>
                <p class="abt-stat-val" style="font-size:1rem;">IT1-07</p>
                <p class="abt-stat-desc">ĐHBKHN · K70</p>
            </div>
        </div>`
    },
    location: {
        title: "📍 Quê Hương & Nơi Học",
        render: () => `
        <div class="abt-info-list">
            <div class="abt-info-row">
                <i data-lucide="home"></i>
                <p class="abt-info-text"><strong>Quê quán:</strong> Trường Sơn, Vạn An, Nghệ An</p>
            </div>
            <div class="abt-info-row">
                <i data-lucide="building-2"></i>
                <p class="abt-info-text"><strong>Hiện tại:</strong> Hà Nội — sinh viên ĐHBKHN</p>
            </div>
            <div class="abt-info-row">
                <i data-lucide="map"></i>
                <p class="abt-info-text"><strong>Khoảng cách:</strong> ~300km từ nhà lên Hà Nội</p>
            </div>
        </div>`
    },
    hobbies: {
        title: "❤️ Sở Thích & Đam Mê",
        render: () => `
        <div class="abt-info-list">
            <div class="abt-info-row">
                <i data-lucide="code-2"></i>
                <p class="abt-info-text"><strong>Lập trình:</strong> Xây dựng web, giải bài tập thuật toán, khám phá công nghệ mới.</p>
            </div>
            <div class="abt-info-row">
                <i data-lucide="music"></i>
                <p class="abt-info-text"><strong>Âm nhạc:</strong> Nghe nhạc khi code, V-Pop, nhạc không lời.</p>
            </div>
            <div class="abt-info-row">
                <i data-lucide="gamepad-2"></i>
                <p class="abt-info-text"><strong>Game:</strong> Thích game chiến thuật và nhập vai, đặc biệt là các tựa indie.</p>
            </div>
        </div>`
    }
};

function openAboutModal(key) {
    const data    = aboutModalData[key];
    const overlay = document.getElementById("aboutModal");
    document.getElementById("aboutModalTitle").textContent   = data.title;
    document.getElementById("aboutModalContent").innerHTML   = data.render();
    overlay.classList.add("active");
    lucide.createIcons();
}

function closeAboutModal() {
    document.getElementById("aboutModal").classList.remove("active");
}

function handleAboutOverlay(e) {
    if (e.target === document.getElementById("aboutModal")) closeAboutModal();
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAboutModal();
});

// ── Achievement 3D Tilt ──
const achGrid = document.getElementById("achGrid");

if (achGrid) {
    achGrid.addEventListener("mousemove", e => {
        const cards = achGrid.querySelectorAll(".ach-card");
        cards.forEach(card => {
            const rect   = card.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = (e.clientX - cx) / (rect.width  / 2);
            const dy     = (e.clientY - cy) / (rect.height / 2);
            const rotY   =  dx * 10;
            const rotX   = -dy * 8;
            card.style.transform =
                `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
            card.style.animation = "none";
        });
    });

    achGrid.addEventListener("mouseleave", () => {
        achGrid.querySelectorAll(".ach-card").forEach((card, i) => {
            card.style.transform = "";
            card.style.animation = "";
            card.style.animationDelay = `${i * 0.18}s`;
        });
    });

    achGrid.addEventListener("click", e => {
        const card = e.target.closest(".ach-card");
        if (card) openAchModal(parseInt(card.dataset.id));
    });
}

// Scroll tilt nhẹ
container.addEventListener("scroll", () => {
    if (!achGrid) return;
    const achRect = achGrid.getBoundingClientRect();
    const ratio   = Math.max(-1, Math.min(1,
        (window.innerHeight / 2 - achRect.top - achRect.height / 2)
        / (window.innerHeight / 2)
    ));
    achGrid.querySelectorAll(".ach-card").forEach(card => {
        if (!card.matches(":hover")) {
            card.style.setProperty("--scroll-tilt",
                `rotateX(${ratio * 4}deg)`);
        }
    });
});

// ── Achievement Modal data ──
const achModalData = [
    {
        eyebrow:  "// 01 · HỌC SINH GIỎI",
        title:    "HSG Vật Lý\nTỉnh Nghệ An",
        accent:   "#00f3ff",
        stats: [
            { label: "Giải",  val: "Ba",       sub: "Lớp 9 · 2021" },
            { label: "Giải",  val: "Nhì",      sub: "Lớp 12 · 2024" },
        ],
        timeline: [
            { tag: "Lớp 9 · 2021",  label: "Giải Ba HSG Vật Lý Tỉnh",
              sub: "Trường THCS Đặng Chánh Kỷ" },
            { tag: "Lớp 12 · 2024", label: "Giải Nhì HSG Vật Lý Tỉnh",
              sub: "Trường THPT Nam Đàn I" },
        ]
    },
    {
        eyebrow:  "// 02 · KỲ THI TUYỂN SINH",
        title:    "Điểm Thi\n2025",
        accent:   "#00ff96",
        stats: [
            { label: "TSA",   val: "83.35", sub: "Đánh giá tư duy" },
            { label: "THPTQG",  val: "27.25", sub: "Khối A00" },
        ],
        timeline: [
            { tag: "TSA 2025",    label: "83.35 điểm",
              sub: "Kỳ thi đánh giá tư duy — ĐHBKHN" },
            { tag: "THPT QG 2025", label: "27.25 điểm — Khối A00",
              sub: "Toán 9 · Vật Lý 9.75 · Hóa Học 8.5" },
            { tag: "Kết quả",      label: "Trúng tuyển ĐHBKHN",
              sub: "Ngành Khoa học Máy tính · IT1" },
        ]
    },
    {
        eyebrow:  "// 03 · HỌC TẬP ĐẠI HỌC",
        title:    "CPA",
        accent:   "#ffb703",
        stats: [
            { label: "CPA",  val: "3.29", sub: "Trung bình" },
        ],
        timeline: [
            { tag: "HK 2024.1", label: "GPA: 3.20",
              sub: "Học kỳ đầu tiên tại ĐHBKHN" },
            { tag: "HK 2024.2", label: "GPA: 3.38",
              sub: "Cải thiện +0.18 so với kỳ trước" },
            { tag: "Tổng kết",  label: "CPA năm nhất: 3.29",
              sub: "Xếp loại Giỏi · IT1-07 · K70" },
        ]
    }
];

function openAchModal(idx) {
    const d       = achModalData[idx];
    const overlay = document.getElementById("achModal");
    const lines   = d.title.split("\n");

    const statsHTML = d.stats.map(s => `
        <div class="ach-mstat">
            <p class="ach-mstat-label">${s.label}</p>
            <p class="ach-mstat-val" style="color:${d.accent};
               text-shadow:0 0 12px ${d.accent}88;">${s.val}</p>
            <p class="ach-mstat-sub">${s.sub}</p>
        </div>`).join("");

    const tlHTML = d.timeline.map(t => `
        <div class="ach-mtl-item">
            <p class="ach-mtl-tag" style="color:${d.accent};">${t.tag}</p>
            <p class="ach-mtl-label">${t.label}</p>
            <p class="ach-mtl-sub">${t.sub}</p>
        </div>`).join("");

    document.getElementById("achModalContent").innerHTML = `
        <p class="ach-modal-eyebrow" style="color:${d.accent};">${d.eyebrow}</p>
        <h2 class="ach-modal-title">${lines.join("<br>")}</h2>
        <div class="ach-modal-accent" style="background:${d.accent};
             box-shadow:0 0 10px ${d.accent}88;"></div>
        <div class="ach-modal-stats">${statsHTML}</div>
        <div class="ach-modal-divider"></div>
        <div class="ach-modal-timeline">${tlHTML}</div>`;

    overlay.classList.add("active");
    lucide.createIcons();
}

function closeAchModal() {
    document.getElementById("achModal").classList.remove("active");
}

function handleAchOverlay(e) {
    if (e.target === document.getElementById("achModal")) closeAchModal();
}
