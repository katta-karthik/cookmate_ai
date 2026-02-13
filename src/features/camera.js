/* ============================================
   COOKMATE AI - CAMERA & DETECTION MODULE
   ============================================ */

CookMate.Camera = {
    video: null,
    canvas: null,
    ctx: null,
    stream: null,

    // Initialize camera elements
    init: function () {
        this.video = document.getElementById('webcam');
        this.canvas = document.getElementById('detectionCanvas');

        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d', { alpha: true });
        }

        console.log('✅ Camera module initialized');
    },

    // Toggle camera on/off
    toggle: async function () {
        if (CookMate.State.cameraActive) {
            this.stop();
        } else {
            await this.start();
        }
    },

    // Start camera stream
    start: async function () {
        try {
            if (!this.video) this.video = document.getElementById('webcam');

            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            this.video.srcObject = this.stream;
            CookMate.State.cameraActive = true;

            // UI updates
            this.updateUI(true);

            console.log('🎥 Camera started');
            return true;
        } catch (error) {
            console.error('Camera start error:', error);
            CookMate.UI.showNotification('Could not access camera.', 'error');
            return false;
        }
    },

    // Stop camera stream
    stop: function () {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.video) {
            this.video.srcObject = null;
        }

        CookMate.State.cameraActive = false;
        this.updateUI(false);

        console.log('🎥 Camera stopped');
    },

    // Update camera UI
    updateUI: function (isActive) {
        const btn = document.getElementById('cameraBtn');
        const placeholder = document.getElementById('cameraPlaceholder');
        const status = document.getElementById('cameraStatus');
        const capture = document.getElementById('captureControls');
        const preview = document.getElementById('imagePreviewContainer');

        if (isActive) {
            if (btn) btn.textContent = 'Stop Camera';
            if (placeholder) placeholder.classList.add('hidden');
            if (status) {
                status.classList.remove('bg-slate-500');
                status.classList.add('bg-green-500');
            }
            if (capture && (!preview || preview.classList.contains('hidden'))) {
                capture.classList.remove('hidden');
            }
        } else {
            if (btn) btn.textContent = 'Start Camera';
            if (placeholder) placeholder.classList.remove('hidden');
            if (status) {
                status.classList.remove('bg-green-500');
                status.classList.add('bg-slate-500');
            }
            if (capture) capture.classList.add('hidden');
        }
    },

    // Show image preview
    showPreview: function (imageSource) {
        const previewContainer = document.getElementById('imagePreviewContainer');
        const previewImg = document.getElementById('capturedImagePreview');
        const captureControls = document.getElementById('captureControls');

        if (previewImg) {
            if (imageSource instanceof HTMLCanvasElement) {
                previewImg.src = imageSource.toDataURL('image/jpeg');
            } else {
                previewImg.src = imageSource;
            }
        }

        if (previewContainer) previewContainer.classList.remove('hidden');
        if (captureControls) captureControls.classList.add('hidden');

        // Save source for later detection
        this.pendingImage = imageSource;
    },

    // Reset preview and show camera again
    resetPreview: function () {
        const previewContainer = document.getElementById('imagePreviewContainer');
        const captureControls = document.getElementById('captureControls');

        if (previewContainer) previewContainer.classList.add('hidden');
        if (captureControls && CookMate.State.cameraActive) {
            captureControls.classList.remove('hidden');
        }

        this.pendingImage = null;
    },

    // Run AI detection on the pending image
    runDetection: async function () {
        if (!this.pendingImage) return;

        const detectBtn = document.getElementById('detectBtn');
        const originalText = detectBtn.innerHTML;

        detectBtn.disabled = true;
        detectBtn.innerHTML = '<span>⏳</span> Analyzing...';
        CookMate.UI.showNotification('AI is identifying your ingredients...', 'info');

        try {
            const results = await CookMate.Detection.analyze(this.pendingImage);
            if (results) {
                this.resetPreview();
            }
        } catch (error) {
            console.error('Detection error:', error);
            CookMate.UI.showNotification('Detection failed. Please check your AI connection.', 'error');
        } finally {
            detectBtn.disabled = false;
            detectBtn.innerHTML = originalText;
        }
    },

    // Capture frame and show preview
    capture: function () {
        if (!CookMate.State.cameraActive) return;

        // Use a hidden canvas to grab the frame
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0);

        // Visual feedback (flash)
        this.video.style.filter = 'brightness(2) contrast(1.2)';
        setTimeout(() => this.video.style.filter = '', 100);

        this.showPreview(canvas);
    },

    // Handle file upload and show preview
    handleUpload: function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.showPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Reset input for next time
        event.target.value = '';
    }
};

// NOTE: Detection module has been moved to js/model/detection.js
// NOTE: Analyzer module has been moved to js/model/analyzer.js
// This ensures all AI/ML related code is in one place

console.log('✅ Camera module loaded');
