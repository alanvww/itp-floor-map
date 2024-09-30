// script.js

let currentZoom = 1;
const zoomStep = 0.1;
const maxZoom = 5;
const minZoom = 0.5;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;
let lastTap = 0;
let pinchStartDistance = 0;
let dragStartTime = 0;
const clickThreshold = 200; // milliseconds

function setupZoomPanControls() {
    const svgContainer = document.getElementById('svg-container');
    const svg = svgContainer.querySelector('svg');
    const infoContainer = document.getElementById('info-container');
    
    // Create zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.id = 'zoom-controls';
    zoomControls.innerHTML = `
        <button class="zoom-button" id="zoom-in">+</button>
        <button class="zoom-button" id="zoom-out">-</button>
        <button class="zoom-button" id="zoom-reset">Reset</button>
    `;
    svgContainer.appendChild(zoomControls);

    // Add event listeners
    document.getElementById('zoom-in').addEventListener('click', () => zoomAtPoint(currentZoom + zoomStep, svgContainer.clientWidth / 2, svgContainer.clientHeight / 2));
    document.getElementById('zoom-out').addEventListener('click', () => zoomAtPoint(currentZoom - zoomStep, svgContainer.clientWidth / 2, svgContainer.clientHeight / 2));
    document.getElementById('zoom-reset').addEventListener('click', resetZoom);

    // Mouse events
    svg.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);
    svg.addEventListener('wheel', handleWheel, { passive: false });

    // Touch events
    svg.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Prevent default behaviors
    svg.addEventListener('dragstart', (e) => e.preventDefault());

    function preventDefaultTouch(e) {
        if (!e.target.closest('.zoom-button') && !e.target.closest('#info-container')) {
            e.preventDefault();
        }
    }

    function handleTouchStart(e) {
        if (e.target.closest('#info-container')) return;
        preventDefaultTouch(e);
        if (e.touches.length === 1) {
            const now = new Date().getTime();
            const timeSince = now - lastTap;
            if (timeSince < 300 && timeSince > 0) {
                zoomAtPoint(currentZoom + zoomStep, e.touches[0].clientX, e.touches[0].clientY);
            } else {
                startDrag(e.touches[0]);
            }
            lastTap = now;
        } else if (e.touches.length === 2) {
            pinchStartDistance = getPinchDistance(e.touches);
        }
    }

    function handleTouchMove(e) {
        if (e.target.closest('#info-container')) return;
        preventDefaultTouch(e);
        if (e.touches.length === 1 && isDragging) {
            drag(e.touches[0]);
        } else if (e.touches.length === 2) {
            const currentDistance = getPinchDistance(e.touches);
            const scale = currentDistance / pinchStartDistance;
            zoomAtPoint(currentZoom * scale, 
                (e.touches[0].clientX + e.touches[1].clientX) / 2, 
                (e.touches[0].clientY + e.touches[1].clientY) / 2);
            pinchStartDistance = currentDistance;
        }
    }

    function handleTouchEnd(e) {
        if (e.target.closest('#info-container')) return;
        preventDefaultTouch(e);
        endDrag(e);
    }

    function startDrag(e) {
        if (e.target.closest('.zoom-button') || e.target.closest('#info-container')) return;
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        dragStartTime = new Date().getTime();
        svg.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        const currentTime = new Date().getTime();
        const dragDuration = currentTime - dragStartTime;

        if (dragDuration > clickThreshold) {
            const x = e.clientX || e.touches[0].clientX;
            const y = e.clientY || e.touches[0].clientY;
            const dx = (x - startX) / currentZoom;
            const dy = (y - startY) / currentZoom;
            translateX += dx;
            translateY += dy;
            startX = x;
            startY = y;
            updateSvgTransform();
        }
    }

    function endDrag(e) {
        if (isDragging) {
            const dragDuration = new Date().getTime() - dragStartTime;
            if (dragDuration <= clickThreshold) {
                // This was a click, not a drag
                const clickedElement = e.target.closest('.hover-group');
                if (clickedElement && window.updateInfo) {
                    window.updateInfo(clickedElement.id);
                }
            }
        }
        isDragging = false;
        svg.style.cursor = 'grab';
    }

    function handleWheel(e) {
        if (e.target.closest('#info-container')) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
        const rect = svgContainer.getBoundingClientRect();
        zoomAtPoint(currentZoom + delta, e.clientX - rect.left, e.clientY - rect.top);
    }

    function zoomAtPoint(newZoom, x, y) {
        newZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
        const scale = newZoom / currentZoom;
        translateX = x - (x - translateX) * scale;
        translateY = y - (y - translateY) * scale;
        currentZoom = newZoom;
        updateSvgTransform();
    }

    function resetZoom() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateSvgTransform();
    }

    function updateSvgTransform() {
        svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    }

    function getPinchDistance(touches) {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }
}

// Call this function after your SVG is loaded
document.addEventListener('DOMContentLoaded', setupZoomPanControls);