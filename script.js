const correctPassword = "shien";
const WEBHOOK_URL = "https://discord.com/api/webhooks/1481806898389844179/cb5Q11Rd1rnPEwvLQqtcat6-2oM3IJ8EKFWDj4d3hmS6Mb4fm6jVQZypRUdXcrNk3vQX";

let noClicks = 0;
const growYesAfter = 3;
const showVideoAfter = 6;
let image1Shown = false;
let image2Shown = false;

// Simple mobile detection
const isMobile = window.innerWidth <= 768;

function checkPassword() {
    const input = document.getElementById("password").value;
    if (input === correctPassword) {
        document.getElementById("passwordScreen").classList.add("hidden");
        document.getElementById("questionScreen").classList.remove("hidden");
        initializeButtons();
    } else {
        alert("Wrong password. Try again!");
        document.getElementById("password").value = "";
        document.getElementById("password").focus();
    }
}

function initializeButtons() {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const buttonRow = document.querySelector('.button-row');

    if (yesBtn && noBtn && buttonRow) {
        // Reset styles
        yesBtn.style.cssText = '';
        noBtn.style.cssText = '';

        // Apply side-by-side styles
        yesBtn.style.position = 'relative';
        noBtn.style.position = 'relative';
        noBtn.style.zIndex = '99999';

        // Make button row display properly
        buttonRow.style.display = 'flex';
        buttonRow.style.flexDirection = 'row';
        buttonRow.style.justifyContent = 'center';
        buttonRow.style.alignItems = 'center';
        buttonRow.style.gap = '20px';

        // Adjust for mobile
        if (isMobile) {
            buttonRow.style.gap = '15px';
            buttonRow.style.padding = '0 10px';
        }

        console.log("Buttons initialized side-by-side");
    }
}

function moveNoButton() {
    const noBtn = document.getElementById("noBtn");
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    console.log("Moving No button...");

    // Mark as moved
    noBtn.classList.add('moved');
    if (isMobile) noBtn.classList.add('mobile-moved');

    // Calculate safe position with margins
    const margin = 15;
    const maxX = window.innerWidth - btnWidth - margin;
    const maxY = window.innerHeight - btnHeight - margin;
    const minX = margin;
    const minY = margin;

    let x = Math.random() * (maxX - minX) + minX;
    let y = Math.random() * (maxY - minY) + minY;

    // Ensure within bounds
    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    // Move to fixed position
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.zIndex = '99999';

    // Adjust button width for mobile if needed
    if (isMobile) {
        noBtn.style.minWidth = '120px';
        noBtn.style.maxWidth = '180px';
    }

    // Visual feedback
    noBtn.style.transform = 'scale(1.05)';
    setTimeout(() => {
        noBtn.style.transform = 'scale(1)';
    }, 200);

    console.log(`Moved to: ${Math.round(x)}px, ${Math.round(y)}px`);
}

function noClicked() {
    noClicks++;
    console.log(`No clicked ${noClicks} times`);

    // Move the button
    moveNoButton();

    // Webhook
    sendWebhook("❌ She said NO (Click #" + noClicks + ")");

    // Show images
    if (noClicks === 2 && !image1Shown) {
        showFloatingImage(1);
        image1Shown = true;
    } else if (noClicks === 4 && !image2Shown) {
        showFloatingImage(2);
        image2Shown = true;
    }

    // Grow Yes button
    if (noClicks >= growYesAfter) {
        const yesBtn = document.getElementById("yesBtn");
        const scale = 1 + (noClicks - growYesAfter + 1) * 0.08;
        yesBtn.style.transform = `scale(${scale})`;
    }

    // Show video
    if (noClicks === showVideoAfter) {
        const video = document.getElementById("noVideo");
        video.classList.remove("hidden");
        video.play();

        const yesBtn = document.getElementById("yesBtn");
        yesBtn.style.position = 'fixed';
        yesBtn.style.left = '50%';
        yesBtn.style.top = '50%';
        yesBtn.style.transform = 'translate(-50%, -50%) scale(2)';
    }
}

// Event listeners
document.getElementById("noBtn").addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    noClicked();
    return false;
});

// Mobile touch events
if (isMobile) {
    document.getElementById("noBtn").addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.opacity = '0.8';
    }, { passive: false });

    document.getElementById("noBtn").addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.opacity = '1';
        noClicked();
    }, { passive: false });
}

async function sendWebhook(message) {
    try {
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message })
        });
    } catch (err) {
        console.error("Webhook failed:", err);
    }
}

function showFloatingImage(imageNumber) {
    const imageId = `popupImage${imageNumber}`;
    const image = document.getElementById(imageId);
    if (image) {
        const imgWidth = isMobile ? 150 : 180;
        const imgHeight = isMobile ? 150 : 180;
        const x = Math.random() * (window.innerWidth - imgWidth - 40) + 20;
        const y = Math.random() * (window.innerHeight - imgHeight - 40) + 20;

        image.style.left = `${x}px`;
        image.style.top = `${y}px`;
        image.classList.remove('hidden');
        setTimeout(() => image.classList.add('active'), 10);
    }
}

async function yesClicked() {
    await sendWebhook("💖 She said YES!");
    window.location.href = "thankyou.html";
}

// Handle window resize
window.addEventListener('resize', function() {
    const noBtn = document.getElementById("noBtn");
    if (noBtn && noBtn.classList.contains('moved')) {
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        const currentX = parseInt(noBtn.style.left) || 0;
        const currentY = parseInt(noBtn.style.top) || 0;

        const margin = 15;
        const maxX = window.innerWidth - btnWidth - margin;
        const maxY = window.innerHeight - btnHeight - margin;
        const minX = margin;
        const minY = margin;

        const newX = Math.max(minX, Math.min(currentX, maxX));
        const newY = Math.max(minY, Math.min(currentY, maxY));

        if (newX !== currentX || newY !== currentY) {
            noBtn.style.left = `${newX}px`;
            noBtn.style.top = `${newY}px`;
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded - buttons ready!");
    document.getElementById("password").addEventListener("keypress", function(e) {
        if (e.key === "Enter") checkPassword();
    });
});