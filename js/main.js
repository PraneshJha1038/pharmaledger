
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.init();
    }

    init() {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        // Add event listener for theme toggle
        this.themeToggle?.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (this.themeIcon) {
            this.themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navbar Scroll Effect
class NavbarManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Mobile menu toggle
        this.mobileMenuToggle?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Smooth scrolling for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // use actual navbar height so offset matches fixed header
                    const navHeight = this.navbar ? this.navbar.offsetHeight : 80;
                    const offsetTop = targetElement.offsetTop - navHeight - 8; // small extra gap
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // if mobile menu is open, close it after click
                    if (this.navMenu?.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                }
            });
        });
    }

    handleScroll() {
        if (this.navbar) {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }
    }

    toggleMobileMenu() {
        this.navMenu?.classList.toggle('active');
        this.mobileMenuToggle?.classList.toggle('active');
    }
}

// Verification System
class VerificationManager {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.manualForm = document.getElementById('manual-verification');
        this.scannerButton = document.getElementById('start-scanner');
        this.qrVideo = document.getElementById('qr-video');
        this.verificationResult = document.getElementById('verification-result');
        this.init();
    }

    init() {
        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Manual verification form
        this.manualForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleManualVerification();
        });

        // QR Scanner
        this.scannerButton?.addEventListener('click', () => {
            this.startQRScanner();
        });
    }

    switchTab(tabId) {
        // Update buttons
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update content
        this.tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }

    async handleManualVerification() {
        const batchNumber = document.getElementById('batch-number').value;

        if (!batchNumber.trim()) {
            this.showError('Please enter a batch number');
            return;
        }

        // Show loading state
        const submitButton = this.manualForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            const result = await this.verifyBatch(batchNumber);
            this.showVerificationResult(result);
        } catch (error) {
            this.showError('Verification failed. Please try again.');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async verifyBatch(batchNumber) {
        // Demo verification logic (replace with actual API call)
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo data - replace with actual API call
                const demoValidBatches = ['DP001/2024', 'PH123/2024', 'MED456/2024', 'RX789/2024'];
                const isValid = demoValidBatches.includes(batchNumber.toUpperCase());

                resolve({
                    isAuthentic: isValid,
                    batchNumber: batchNumber,
                    productName: isValid ? 'Paracetamol 500mg' : 'Unknown Product',
                    manufacturer: isValid ? 'Demo Pharmaceuticals Ltd.' : 'Unknown',
                    status: isValid ? 'Authentic' : 'Counterfeit - Not Found in Database'
                });
            }, 2000);
        });
    }

    showVerificationResult(result) {
        const resultDiv = this.verificationResult;
        const statusEl = document.getElementById('result-status');
        const detailsEl = document.getElementById('result-details');
        const iconEl = resultDiv.querySelector('.result-icon i');

        if (result.isAuthentic) {
            statusEl.textContent = 'Medicine Verified ✓';
            detailsEl.textContent = `${result.productName} by ${result.manufacturer} is authentic and safe to use.`;
            iconEl.className = 'fas fa-check-circle';
            iconEl.style.color = 'var(--success)';
        } else {
            statusEl.textContent = 'Verification Failed ✗';
            detailsEl.textContent = 'This batch number was not found in our database. This may indicate a counterfeit product.';
            iconEl.className = 'fas fa-exclamation-triangle';
            iconEl.style.color = 'var(--danger)';
        }

        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async startQRScanner() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });

            this.qrVideo.srcObject = stream;
            this.qrVideo.style.display = 'block';
            this.qrVideo.play();

            document.querySelector('.scanner-placeholder').style.display = 'none';

            // Start QR detection (simplified - in production, use a QR code library)
            this.scanForQR();

        } catch (error) {
            console.error('Camera access denied:', error);
            this.showError('Camera access is required for QR scanning. Please enable camera permissions.');
        }
    }

    scanForQR() {
        // Simplified QR scanning (in production, use libraries like jsQR or QuaggaJS)
        const canvas = document.getElementById('qr-canvas');
        const ctx = canvas.getContext('2d');

        const scan = () => {
            if (this.qrVideo.readyState === this.qrVideo.HAVE_ENOUGH_DATA) {
                canvas.height = this.qrVideo.videoHeight;
                canvas.width = this.qrVideo.videoWidth;
                ctx.drawImage(this.qrVideo, 0, 0, canvas.width, canvas.height);

                // Here you would implement actual QR code detection
                // For demo purposes, we'll simulate finding a QR code after 5 seconds
                setTimeout(() => {
                    this.simulateQRDetection();
                }, 5000);

                return;
            }
            requestAnimationFrame(scan);
        };
        scan();
    }

    simulateQRDetection() {
        // Simulate QR code detection
        const demoQRData = 'PHARMALEDGER:DP001/2024:Paracetamol 500mg';
        const batchNumber = demoQRData.split(':')[1];

        // Stop camera
        const stream = this.qrVideo.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        this.qrVideo.style.display = 'none';
        document.querySelector('.scanner-placeholder').style.display = 'block';

        // Show result
        this.verifyBatch(batchNumber).then(result => {
            this.showVerificationResult(result);
        });
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.verification-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'verification-error';
            errorDiv.style.cssText = `
                background: #fee;
                border: 1px solid #fcc;
                color: #c66;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-top: 1rem;
            `;
            this.verificationResult.parentNode.insertBefore(errorDiv, this.verificationResult);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Statistics Counter Animation
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-target]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
}

// Scroll Progress Indicator
class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scroll-progress');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.updateProgress();
        });
    }

    updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;

        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.toggleVisibility();
        });

        this.button?.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    toggleVisibility() {
        if (window.pageYOffset > 300) {
            this.button?.classList.add('visible');
        } else {
            this.button?.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.init();
    }

    init() {
        this.contactForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm();
        });
    }

    async handleContactForm() {
        const formData = new FormData(this.contactForm);
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(formData);
            this.showSuccess('Message sent successfully! We will get back to you soon.');
            this.contactForm.reset();
        } catch (error) {
            this.showError('Failed to send message. Please try again.');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async submitForm(formData) {
        // Simulate API call (replace with actual endpoint)
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.style.cssText = `
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            background: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
            border: 1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'};
            color: ${type === 'success' ? '#065f46' : '#991b1b'};
        `;
        messageDiv.textContent = message;

        // Remove existing message
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        this.contactForm.appendChild(messageDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Animation on Scroll
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.feature-card, .step-item, .stakeholder-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        this.animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    }
}

// Utility Functions
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Smooth scroll to element
    scrollToElement(elementId, offset = 80) {
        const element = document.getElementById(elementId);
        if (element) {
            const offsetTop = element.offsetTop - offset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Performance Monitoring
const performance = {
    // Track page load time
    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    },

    // Track Core Web Vitals (simplified)
    trackCoreWebVitals() {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
            const firstInput = entryList.getEntries()[0];
            const fid = firstInput.processingStart - firstInput.startTime;
            console.log('FID:', fid);
        }).observe({ entryTypes: ['first-input'], buffered: true });
    }
};

// Initialize Application
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.themeManager = new ThemeManager();
            this.navbarManager = new NavbarManager();
            this.verificationManager = new VerificationManager();
            this.statsCounter = new StatsCounter();
            this.scrollProgress = new ScrollProgress();
            this.backToTop = new BackToTop();
            this.formHandler = new FormHandler();
            this.scrollAnimations = new ScrollAnimations();

            // Initialize performance tracking
            performance.trackPageLoad();

            // Initialize error handling
            this.initErrorHandling();

            console.log('PharmaLedger app initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    initErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });
    }
}

// Start the application
const app = new App();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, utils };
}

// Service Worker Registration (optional, for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed');
            });
    });
}
