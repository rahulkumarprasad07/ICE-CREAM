
        // INTRO OVERLAY HANDLER
        document.addEventListener('DOMContentLoaded', () => {
            const intro = document.getElementById('intro');
            const introVideo = document.getElementById('intro-video');
            const skipBtn = document.getElementById('skip-intro');
            const mainSite = document.getElementById('main-site');

            function finishIntro() {
                if (intro.classList.contains('intro-hidden')) return;
                intro.classList.add('intro-hidden');
                mainSite.classList.add('site-visible');
                if (introVideo) {
                    introVideo.pause();
                }
            }

            if (skipBtn) {
                skipBtn.addEventListener('click', finishIntro);
            }

            if (introVideo) {
                introVideo.addEventListener('ended', finishIntro);
                introVideo.addEventListener('error', finishIntro);
            }

            // Fallback safety timeout in case video stalls
            setTimeout(() => {
                finishIntro();
            }, 8000);
        });

        // SAMPLE ICE CREAM PRODUCTS DATA
        const PRODUCTS = [
            {
                id: 1,
                name: "Belgian Dark Cacao",
                category: "chocolate",
                price: 4.99,
                rating: 4.9,
                description: "Rich, velvety 72% Belgian chocolate gelato churned with cacao nibs.",
                image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
                badge: "Best Seller"
            },
            {
                id: 2,
                name: "Strawberry Dream",
                category: "fruity",
                price: 4.49,
                rating: 4.8,
                description: "Organic farm-fresh strawberry puree folded with sweet cream.",
                image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80",
                badge: "Popular"
            },
            {
                id: 3,
                name: "Pistachio Paradise",
                category: "premium",
                price: 5.49,
                rating: 5.0,
                description: "Authentic Sicilian roasted pistachios crushed into a rich creamy base.",
                image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80",
                badge: "Chef's Pick"
            },
            {
                id: 4,
                name: "Madagascar Vanilla",
                category: "classic",
                price: 3.99,
                rating: 4.7,
                description: "Pure Bourbon vanilla bean specks infused in fresh local dairy milk.",
                image: "https://images.unsplash.com/photo-1576506295286-5cda482453a2?auto=format&fit=crop&w=600&q=80",
                badge: "Classic"
            },
            {
                id: 5,
                name: "Mango Magic Sorbet",
                category: "fruity",
                price: 4.79,
                rating: 4.9,
                description: "100% dairy-free Alphonso mango sorbet, bursting with tropical sunshine.",
                image: "https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=600&q=80",
                badge: "Vegan"
            },
            {
                id: 6,
                name: "Salted Caramel Crunch",
                category: "premium",
                price: 5.29,
                rating: 4.9,
                description: "Buttery golden caramel swirl with Himalayan pink salt & waffle crunch.",
                image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=600&q=80",
                badge: "Top Rated"
            }
        ];

        // STATE MANAGEMENT
        let cart = [];
        let activeCategory = 'all';
        let searchQuery = '';

        // DOM ELEMENTS
        const productGrid = document.getElementById('productGrid');
        const noResults = document.getElementById('noResults');
        const filterContainer = document.getElementById('filterContainer');
        const searchInput = document.getElementById('searchInput');
        
        const cartDrawer = document.getElementById('cartDrawer');
        const cartPanel = document.getElementById('cartPanel');
        const cartBackdrop = document.getElementById('cartBackdrop');
        const openCartBtn = document.getElementById('openCartBtn');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const cartBadge = document.getElementById('cartBadge');
        const cartItemsList = document.getElementById('cartItemsList');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        // INITIALIZE APP
        function init() {
            renderProducts();
            setupEventListeners();
            initSprinklesCanvas();
            initScrollReveal();
            lucide.createIcons();
        }

        // RENDER PRODUCTS
        function renderProducts() {
            const filtered = PRODUCTS.filter(product => {
                const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
                const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                      product.description.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            });

            if (filtered.length === 0) {
                productGrid.innerHTML = '';
                noResults.classList.remove('hidden');
                return;
            }

            noResults.classList.add('hidden');
            productGrid.innerHTML = filtered.map(product => `
                <div class="product-card glass-card rounded-3xl p-5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group reveal border border-scoop-pink/15">
                    <div>
                        <!-- IMAGE CONTAINER -->
                        <div class="relative w-full h-52 rounded-2xl overflow-hidden mb-4 bg-scoop-cream">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            ${product.badge ? `
                                <span class="absolute top-3 left-3 bg-scoop-pink text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                                    ${product.badge}
                                </span>
                            ` : ''}
                            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-scoop-dark flex items-center gap-1 shadow-sm">
                                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
                                <span>${product.rating}</span>
                            </div>
                        </div>

                        <!-- TEXT DETAILS -->
                        <h3 class="font-display text-xl font-bold text-scoop-brown group-hover:text-scoop-pink transition-colors">${product.name}</h3>
                        <p class="text-xs text-scoop-dark/70 mt-1 mb-4 leading-relaxed line-clamp-2">${product.description}</p>
                    </div>

                    <!-- CARD FOOTER -->
                    <div class="flex items-center justify-between pt-3 border-t border-scoop-brown/10">
                        <div>
                            <span class="text-xs text-scoop-dark/50 block font-semibold">Single Scoop</span>
                            <span class="font-display text-2xl font-bold text-scoop-brown">$${product.price.toFixed(2)}</span>
                        </div>
                        <button onclick="addToCart(${product.id}, event)" class="add-to-cart-btn p-3 bg-scoop-pink hover:bg-scoop-pink/90 text-white rounded-2xl shadow-lg shadow-scoop-pink/30 hover:scale-110 active:scale-90 transition-all flex items-center justify-center">
                            <i data-lucide="plus" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            lucide.createIcons();
            initScrollReveal();
        }

        // FILTER & SEARCH HANDLERS
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active', 'bg-scoop-pink', 'text-white', 'shadow-md');
                    btn.classList.add('bg-white', 'text-scoop-dark');
                });

                e.target.classList.add('active', 'bg-scoop-pink', 'text-white', 'shadow-md');
                e.target.classList.remove('bg-white', 'text-scoop-dark');

                activeCategory = e.target.dataset.category;
                renderProducts();
            }
        });

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });

        // CART LOGIC & ANIMATIONS
        window.addToCart = function(productId, event) {
            const product = PRODUCTS.find(p => p.id === productId);
            if (!product) return;

            const existing = cart.find(item => item.id === productId);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCartUI();
            triggerFlyToCartAnimation(event, product.image);
            showToast(`${product.name} added to bag!`);
        }

        function updateCartUI() {
            // Update Cart Badge
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            if (totalItems > 0) {
                cartBadge.classList.remove('scale-0');
                cartBadge.classList.add('scale-100');
            } else {
                cartBadge.classList.add('scale-0');
            }

            // Render Cart Drawer Items
            if (cart.length === 0) {
                cartItemsList.innerHTML = `
                    <div class="text-center py-12 space-y-3">
                        <div class="text-4xl">🍦</div>
                        <p class="font-bold text-scoop-brown">Your bag is empty!</p>
                        <p class="text-xs text-scoop-dark/60">Add some artisanal scoops to get started.</p>
                    </div>
                `;
            } else {
                cartItemsList.innerHTML = cart.map(item => `
                    <div class="flex items-center gap-4 bg-white p-3 rounded-2xl border border-scoop-pink/15 shadow-sm">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover">
                        <div class="flex-1">
                            <h4 class="font-bold text-sm text-scoop-brown">${item.name}</h4>
                            <p class="text-xs text-scoop-pink font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
                            <div class="flex items-center gap-2 mt-2">
                                <button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 rounded-lg bg-scoop-cream hover:bg-scoop-pink hover:text-white font-bold text-xs flex items-center justify-center transition-colors">-</button>
                                <span class="text-xs font-bold text-scoop-dark">${item.quantity}</span>
                                <button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 rounded-lg bg-scoop-cream hover:bg-scoop-pink hover:text-white font-bold text-xs flex items-center justify-center transition-colors">+</button>
                            </div>
                        </div>
                        <button onclick="removeFromCart(${item.id})" class="text-scoop-dark/40 hover:text-rose-500 p-2 transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                `).join('');
            }

            // Calculations
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            cartTotal.textContent = `$${subtotal.toFixed(2)}`;

            lucide.createIcons();
        }

        window.changeQty = function(id, delta) {
            const item = cart.find(i => i.id === id);
            if (!item) return;
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            updateCartUI();
        }

        window.removeFromCart = function(id) {
            cart = cart.filter(i => i.id !== id);
            updateCartUI();
        }

        // FLY-TO-CART ANIMATION EFFECT
        function triggerFlyToCartAnimation(event, imgUrl) {
            const btn = event.currentTarget;
            const btnRect = btn.getBoundingClientRect();
            const cartRect = openCartBtn.getBoundingClientRect();

            const flyer = document.createElement('img');
            flyer.src = imgUrl;
            flyer.className = 'flying-item';
            flyer.style.left = `${btnRect.left}px`;
            flyer.style.top = `${btnRect.top}px`;

            document.body.appendChild(flyer);

            setTimeout(() => {
                flyer.style.left = `${cartRect.left + 10}px`;
                flyer.style.top = `${cartRect.top + 10}px`;
                flyer.style.transform = 'scale(0.2) rotate(360deg)';
                flyer.style.opacity = '0.7';
            }, 20);

            setTimeout(() => {
                flyer.remove();
                openCartBtn.classList.add('scale-125');
                setTimeout(() => openCartBtn.classList.remove('scale-125'), 200);
            }, 850);
        }

        // TOAST NOTIFICATION
        function showToast(msg) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-message');
            toastMsg.textContent = msg;

            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // CART DRAWER OPEN / CLOSE
        function openCart() {
            cartDrawer.classList.remove('pointer-events-none', 'opacity-0');
            cartPanel.classList.remove('translate-x-full');
        }

        function closeCart() {
            cartDrawer.classList.add('pointer-events-none', 'opacity-0');
            cartPanel.classList.add('translate-x-full');
        }

        openCartBtn.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartBackdrop.addEventListener('click', closeCart);

        // CHECKOUT CONFETTI
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast("Your bag is empty!");
                return;
            }

            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF6B9D', '#FFF4E6', '#A8D5A2', '#8B5CF6', '#FFB38A']
            });

            cart = [];
            updateCartUI();
            closeCart();
            showToast("Order placed! Your ice cream is on its way 🎉");
        });

        // CANVAS BACKGROUND SPRINKLES
        function initSprinklesCanvas() {
            const canvas = document.getElementById('sprinklesCanvas');
            const ctx = canvas.getContext('2d');

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            const colors = ['#FF6B9D', '#A8D5A2', '#8B5CF6', '#FFB38A', '#5A3427'];
            const sprinkles = Array.from({ length: 45 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 8 + 4,
                angle: Math.random() * Math.PI * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 0.4 + 0.1,
                rotSpeed: (Math.random() - 0.5) * 0.02
            }));

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                sprinkles.forEach(s => {
                    s.y += s.speedY;
                    s.angle += s.rotSpeed;

                    if (s.y > canvas.height) s.y = -10;

                    ctx.save();
                    ctx.translate(s.x, s.y);
                    ctx.rotate(s.angle);
                    ctx.fillStyle = s.color;
                    ctx.beginPath();
                    ctx.roundRect(-s.size / 2, -2, s.size, 5, 3);
                    ctx.fill();
                    ctx.restore();
                });

                requestAnimationFrame(animate);
            }
            animate();
        }

        // SCROLL REVEAL OBSERVER
        function initScrollReveal() {
            const reveals = document.querySelectorAll('.reveal');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });

            reveals.forEach(el => observer.observe(el));
        }

        // MOBILE MENU TOGGLE
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // LAUNCH APP
        setupEventListeners = () => {}; // Helper stub
        init();
   // ==========================================
// AUTHENTICATION & MODAL LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('authModal');
    const authCard = document.getElementById('authCard');
    const openAuthBtn = document.getElementById('openAuthModalBtn');
    const closeAuthBtn = document.getElementById('closeAuthModalBtn');
    const authBackdrop = document.getElementById('authBackdrop');
    const authForm = document.getElementById('authForm');
    const authModalTitle = document.getElementById('authModalTitle');
    const authModalSubtitle = document.getElementById('authModalSubtitle');
    const nameFieldGroup = document.getElementById('nameFieldGroup');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authToggleBtn = document.getElementById('authToggleBtn');
    const authToggleText = document.getElementById('authToggleText');
    const authContainer = document.getElementById('authContainer');

    let isSignUp = false;

    // Retrieve saved user from localStorage if present
    let currentUser = JSON.parse(localStorage.getItem('scoop_user') || 'null');
    updateUserUI();

    // Modal Control Functions
    function openModal() {
        if (!authModal || !authCard) return;
        authModal.classList.remove('pointer-events-none', 'opacity-0');
        authModal.classList.add('opacity-100');
        authCard.classList.remove('scale-95');
        authCard.classList.add('scale-100');
    }

    function closeModal() {
        if (!authModal || !authCard) return;
        authModal.classList.add('pointer-events-none', 'opacity-0');
        authModal.classList.remove('opacity-100');
        authCard.classList.add('scale-95');
        authCard.classList.remove('scale-100');
    }

    // Event Listeners for Opening/Closing
    if (openAuthBtn) openAuthBtn.addEventListener('click', openModal);
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeModal);
    if (authBackdrop) authBackdrop.addEventListener('click', closeModal);

    // Toggle Mode Between Sign In and Sign Up
    if (authToggleBtn) {
        authToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isSignUp = !isSignUp;

            if (isSignUp) {
                authModalTitle.textContent = 'Join SCOOP!';
                authModalSubtitle.textContent = 'Create an account to start enjoying sweet rewards.';
                nameFieldGroup.classList.remove('hidden');
                authSubmitBtn.textContent = 'Create Account';
                authToggleText.textContent = 'Already have an account?';
                authToggleBtn.textContent = 'Sign In';
            } else {
                authModalTitle.textContent = 'Welcome Back!';
                authModalSubtitle.textContent = 'Sign in to save your favorite scoops and checkout faster.';
                nameFieldGroup.classList.add('hidden');
                authSubmitBtn.textContent = 'Sign In';
                authToggleText.textContent = "Don't have an account?";
                authToggleBtn.textContent = 'Create One';
            }
        });
    }

    // Form Submission Logic
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('authEmail').value.trim();
            const nameInput = document.getElementById('authName').value.trim();
            const name = isSignUp ? (nameInput || 'Scoop Fan') : email.split('@')[0];

            currentUser = { name, email };
            localStorage.setItem('scoop_user', JSON.stringify(currentUser));

            updateUserUI();
            closeModal();
            authForm.reset();
        });
    }

    // Render User Avatar or Sign In Button in Navbar
    function updateUserUI() {
        if (!authContainer) return;

        if (currentUser) {
            authContainer.innerHTML = `
                <div class="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-2xl border border-scoop-pink/20 shadow-sm">
                    <div class="w-7 h-7 rounded-xl bg-scoop-pink text-white font-bold flex items-center justify-center text-xs">
                        ${currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="text-xs font-bold text-scoop-brown hidden lg:inline">${currentUser.name}</span>
                    <button id="logoutBtn" class="text-scoop-dark/50 hover:text-scoop-pink p-1 ml-1 transition-colors" title="Logout">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                    </button>
                </div>
            `;

            // Attach Logout Event
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('scoop_user');
                    currentUser = null;
                    location.reload();
                });
            }
        } else {
            authContainer.innerHTML = `
                <button id="openAuthModalBtn" class="flex items-center gap-2 bg-white/90 hover:bg-scoop-cream px-4 py-2.5 rounded-2xl border border-scoop-pink/20 transition-all text-scoop-brown text-sm font-bold shadow-sm">
                    <i data-lucide="user" class="w-4 h-4 text-scoop-pink"></i>
                    <span>Sign In</span>
                </button>
            `;
            // Re-bind click event to newly created Sign In button
            document.getElementById('openAuthModalBtn')?.addEventListener('click', openModal);
        }

        // Re-initialize Lucide icons if loaded
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
});