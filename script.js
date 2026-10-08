// ==========================================================================
// THIỆP CƯỚI KHÁNH LY & TIẾN DŨNG (25.10.2026)
// SCRIPT.JS - BẢN TỐI ƯU TOÀN DIỆN VÀ HOÀN CHỈNH
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. CÁ NHÂN HÓA KHÁCH MỜI TỪ URL (?guest=...&side=...)
    // ==========================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("guest");
    const sideParam = urlParams.get("side");

    const guestNameEl = document.getElementById("guestName");
    const rsvpNameEl = document.getElementById("rsvpName");

    if (guestParam) {
        const decodedGuest = decodeURIComponent(guestParam).trim();
        if (decodedGuest) {
            if (guestNameEl) guestNameEl.textContent = decodedGuest;
            if (rsvpNameEl) rsvpNameEl.value = decodedGuest;
        }
    }

    if (sideParam && ["bride", "groom", "both"].includes(sideParam.toLowerCase())) {
        const sideRadio = document.querySelector(
            `input[name="relationship"][value="${sideParam.toLowerCase()}"]`
        );
        if (sideRadio) sideRadio.checked = true;
    }

    // ==========================================================================
    // 2. BỘ ĐẾM NGƯỢC ĐẾN NGÀY CƯỚI (25/10/2026 07:00 SÁNG)
    // ==========================================================================
    // Giờ Lễ Cưới: 07:00 ngày 25/10/2026 (Giờ Việt Nam UTC+7)
    const weddingDate = new Date("2026-10-25T07:00:00+07:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCountdown() {
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        const now = Date.now();
        const distance = weddingDate - now;

        if (distance <= 0) {
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================================================
    // 3. HIỆU ỨNG CUỘN XUẤT HIỆN NỘI DUNG (SCROLL REVEAL)
    // ==========================================================================
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Dự phòng cho trình duyệt cũ
        revealElements.forEach(el => el.classList.add("active"));
    }

    // ==========================================================================
    // 4. TRÌNH PHÁT NHẠC NỀN & NÚT ĐĨA QUAY (AUDIO PLAYER)
    // ==========================================================================
    const weddingMusic = document.getElementById("weddingMusic");
    const musicButton = document.getElementById("musicButton");

    if (weddingMusic && musicButton) {
        weddingMusic.volume = 0.5;

        async function playMusic() {
            try {
                await weddingMusic.play();
                musicButton.classList.add("playing");
            } catch (err) {
                // Trình duyệt chặn autoplay khi chưa có tương tác người dùng
                musicButton.classList.remove("playing");
            }
        }

        function pauseMusic() {
            weddingMusic.pause();
            musicButton.classList.remove("playing");
        }

        // Thử phát tự động
        playMusic();

        // Nút bấm bật / tắt nhạc
        musicButton.addEventListener("click", (e) => {
            e.stopPropagation();
            if (weddingMusic.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });

        // Kích hoạt phát nhạc ở lần tương tác đầu tiên nếu bị trình duyệt chặn
        const triggerMusicOnFirstInteraction = () => {
            if (weddingMusic.paused) {
                playMusic();
            }
            window.removeEventListener("click", triggerMusicOnFirstInteraction);
            window.removeEventListener("touchstart", triggerMusicOnFirstInteraction);
            window.removeEventListener("scroll", triggerMusicOnFirstInteraction);
        };

        window.addEventListener("click", triggerMusicOnFirstInteraction, { once: true });
        window.addEventListener("touchstart", triggerMusicOnFirstInteraction, { once: true });
        window.addEventListener("scroll", triggerMusicOnFirstInteraction, { once: true });
    }

    // ==========================================================================
    // 5. TOAST THÔNG BÁO & SAO CHÉP (COPY TO CLIPBOARD)
    // ==========================================================================
    const toastNotice = document.getElementById("toastNotice");
    let toastTimeout = null;

    function showToast(message) {
        if (!toastNotice) return;
        toastNotice.textContent = message;
        toastNotice.classList.add("active");
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotice.classList.remove("active");
        }, 2600);
    }

    async function copyText(text, successMsg) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const tempInput = document.createElement("input");
                tempInput.value = text;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
            }
            showToast(successMsg);
        } catch (err) {
            showToast("Đã sao chép: " + text);
        }
    }

    // Nút sao chép số tài khoản ngân hàng
    const copyBankBtn = document.getElementById("copyBankBtn");
    if (copyBankBtn) {
        copyBankBtn.addEventListener("click", () => {
            copyText("0986534991", "Đã sao chép số tài khoản (0986534991) ♡");
        });
    }

    // Nút sao chép địa chỉ tiệc cưới
    const copyAddressBtn = document.getElementById("copyAddressBtn");
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener("click", () => {
            copyText("Khu Bằng Luân, xã Bằng Luân, tỉnh Phú Thọ", "Đã sao chép địa chỉ tiệc cưới ♡");
        });
    }

    // ==========================================================================
    // 6. LIGHTBOX POPUP XEM ẢNH FULL MÀN HÌNH (PHOTO GALLERY PREVIEW)
    // ==========================================================================
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    let currentPhotoIndex = 0;
    const photoList = galleryItems.map(item => {
        const img = item.querySelector("img");
        return {
            src: img ? img.getAttribute("src") : "",
            alt: img ? img.getAttribute("alt") : "Ảnh cưới Khánh Ly & Tiến Dũng"
        };
    });

    function openLightbox(index) {
        if (!lightboxModal || !lightboxImg || photoList.length === 0) return;
        currentPhotoIndex = (index + photoList.length) % photoList.length;
        const photo = photoList[currentPhotoIndex];
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.alt;
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photoList.length}`;
        }
        lightboxModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Khóa cuộn trang khi mở lightbox
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove("active");
        document.body.style.overflow = "";
    }

    function prevPhoto() {
        openLightbox(currentPhotoIndex - 1);
    }

    function nextPhoto() {
        openLightbox(currentPhotoIndex + 1);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); prevPhoto(); });
    if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); nextPhoto(); });

    if (lightboxModal) {
        lightboxModal.addEventListener("click", (e) => {
            if (e.target === lightboxModal || e.target.classList.contains("lightbox-content")) {
                closeLightbox();
            }
        });
    }

    // Phím tắt bàn phím cho Lightbox (ESC, Left, Right)
    window.addEventListener("keydown", (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prevPhoto();
        if (e.key === "ArrowRight") nextPhoto();
    });

    // ==========================================================================
    // 7. SỔ LƯU BÚT & RSVP - GỬI VỀ GOOGLE SHEETS
    // ==========================================================================
    const rsvpButton = document.getElementById("rsvpButton");
    const rsvpName = document.getElementById("rsvpName");
    const rsvpMessage = document.getElementById("rsvpMessage");
    const rsvpError = document.getElementById("rsvpError");
    const rsvpSuccess = document.getElementById("rsvpSuccess");

    const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxNYc1XN-lyalYg2D9zlKqSHW9YkKknWfNWf6yrbuznXwXXzZfml1xSWTHzxkEMIjH6YQ/exec";

    function showRsvpError(msg) {
        if (rsvpError) {
            rsvpError.textContent = msg;
            rsvpError.classList.add("active");
        }
    }

    function clearRsvpError() {
        if (rsvpError) {
            rsvpError.textContent = "";
            rsvpError.classList.remove("active");
        }
    }

    if (rsvpButton) {
        rsvpButton.addEventListener("click", async () => {
            clearRsvpError();

            const name = rsvpName ? rsvpName.value.trim() : "";
            const message = rsvpMessage ? rsvpMessage.value.trim() : "";
            const relationship = document.querySelector('input[name="relationship"]:checked');
            const attendance = document.querySelector('input[name="attendance"]:checked');

            // 1. Kiểm tra họ tên
            if (!name) {
                showRsvpError("♡ Bạn vui lòng nhập tên hoặc biệt danh trước khi gửi nhé.");
                if (rsvpName) rsvpName.focus();
                return;
            }

            // 2. Kiểm tra mối quan hệ
            if (!relationship) {
                showRsvpError("♡ Bạn vui lòng chọn bạn là khách của ai nhé.");
                return;
            }

            // 3. Kiểm tra xác nhận tham dự
            if (!attendance) {
                showRsvpError("♡ Bạn vui lòng xác nhận có thể tham dự chung vui cùng chúng mình không nhé.");
                return;
            }

            const payload = {
                name: name,
                relationship: relationship.value,
                attendance: attendance.value,
                message: message
            };

            // Trạng thái đang gửi
            rsvpButton.disabled = true;
            rsvpButton.innerHTML = "<span>ĐANG GỬI LỜI CHÚC...</span>";

            try {
                const response = await fetch(RSVP_ENDPOINT, {
                    method: "POST",
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || "Lỗi lưu RSVP");
                }

                // Gửi thành công
                rsvpButton.innerHTML = "<span>ĐÃ GỬI THÀNH CÔNG ♡</span>";
                if (rsvpSuccess) rsvpSuccess.classList.add("active");
                if (rsvpMessage) rsvpMessage.value = "";
                showToast("Cảm ơn bạn đã gửi lời chúc đến Khánh Ly & Tiến Dũng! ♡");

            } catch (err) {
                console.error("Lỗi gửi RSVP:", err);
                showRsvpError("♡ Chưa gửi được lời chúc. Bạn vui lòng thử lại giúp chúng mình nhé.");
                rsvpButton.disabled = false;
                rsvpButton.innerHTML = "<span>GỬI LỜI CHÚC ♡</span>";
            }
        });
    }

    // ==========================================================================
    // 8. NÚT CUỘN LÊN ĐẦU TRANG (BACK TO TOP)
    // ==========================================================================
    const backToTopBtn = document.getElementById("backToTopBtn");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 450) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }, { passive: true });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ==========================================================================
    // 9. HIỆU ỨNG CÁNH HOA ANH ĐÀO RƠI NHẸ NHÀNG (FALLING PETALS CANVAS)
    // ==========================================================================
    const canvas = document.getElementById("petalsCanvas");
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const petals = [];
        const petalCount = window.innerWidth < 600 ? 14 : 24;

        class Petal {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : -20;
                this.size = Math.random() * 8 + 7;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1.2 + 0.8;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 1.5;
                this.opacity = Math.random() * 0.45 + 0.25;
            }

            update() {
                this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.globalAlpha = this.opacity;

                // Vẽ hình cánh hoa mềm mại
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size / 2, this.size / 2, 0, this.size);
                ctx.bezierCurveTo(this.size / 2, this.size / 2, this.size / 2, -this.size / 2, 0, 0);
                ctx.fillStyle = "#e8a9b2"; // Hồng phớt cánh hoa đào
                ctx.fill();

                ctx.restore();
            }
        }

        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }

        let animationFrameId;
        function animate() {
            ctx.clearRect(0, 0, width, height);
            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        }

        // Tự động tạm dừng khi rời tab để tiết kiệm pin
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        });

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, { passive: true });

        animate();
    }
});