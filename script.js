// Menu mobile toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Fechar menu ao clicar em um link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Header transparente no scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  }
});

// Animação de entrada dos elementos
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Aplicar animação aos elementos
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".sobre-content, .institucional-card, .contato-content, .sobre-stats"
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Contador animado para estatísticas
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target + "+";
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start) + "+";
    }
  }, 16);
}

// Animar contadores quando visíveis
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numberElement = entry.target.querySelector(".stat-number");
        const text = numberElement.textContent;
        const target = parseInt(text.replace("+", ""));

        animateCounter(numberElement, target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat-item").forEach((item) => {
  counterObserver.observe(item);
});

// Efeito parallax sutil no hero
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Adicionar classe ativa ao link de navegação baseado na seção visível
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);

// Adicionar estilos para link ativo
const style = document.createElement("style");
style.textContent = `
    .nav-link.active {
        color: #3498db !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Smooth reveal para cards institucionais
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 200);
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".institucional-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(50px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  cardObserver.observe(card);
});

// Adicionar efeito de hover nos botões
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px)";
  });

  btn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// Adicionar loading sutil na página
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);

  // Atualiza ano do rodapé automaticamente
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});

// Função para scroll to top (opcional)
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Adicionar botão scroll to top se necessário
if (window.innerHeight > 800) {
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.className = "scroll-top-btn";
  scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    `;

  document.body.appendChild(scrollTopBtn);

  // Mostrar/ocultar botão baseado no scroll
  window.addEventListener("scroll", () => {
    const whatsapp = document.querySelector(".whatsapp-float");
    if (window.scrollY > 500) {
      scrollTopBtn.style.opacity = "1";
      if (whatsapp && !whatsapp.dataset.userMoved) {
        whatsapp.classList.add("shift-up");
      }
    } else {
      scrollTopBtn.style.opacity = "0";
      if (whatsapp && !whatsapp.dataset.userMoved) {
        whatsapp.classList.remove("shift-up");
      }
    }
  });

  scrollTopBtn.addEventListener("click", scrollToTop);

  // Hover effects
  scrollTopBtn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px)";
    this.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.4)";
  });

  scrollTopBtn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
  });
}

// Alternar estilo do botão WhatsApp no fundo do hero (azul)
function updateWhatsAppFloatingStyle() {
  const hero = document.querySelector(".hero");
  const whatsapp = document.querySelector(".whatsapp-float");
  if (!hero || !whatsapp) return;

  const heroRect = hero.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  // Consideramos que está "sobre o hero" quando há interseção visível razoável
  // Traz a troca um pouco antes: considera "sobre o hero" mais cedo
  const heroVisible =
    heroRect.top < viewportHeight * 0.8 && heroRect.bottom > 800;

  if (heroVisible) {
    whatsapp.classList.add("whatsapp-invert");
  } else {
    whatsapp.classList.remove("whatsapp-invert");
  }
}

window.addEventListener("scroll", updateWhatsAppFloatingStyle);
window.addEventListener("resize", updateWhatsAppFloatingStyle);
document.addEventListener("DOMContentLoaded", updateWhatsAppFloatingStyle);

async function fetchGoogleReviews() {
  // Detectar se está em desenvolvimento local
  const isLocalDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "";

  // Em desenvolvimento local, serverless function não está disponível
  // Retorna erro silencioso para usar reviews de exemplo
  if (isLocalDev) {
    return {
      reviews: null,
      error: "Desenvolvimento local - usando reviews de exemplo",
    };
  }

  try {
    // Em produção (Vercel): usa serverless function
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews&key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        reviews: null,
        error: errorData.error || `Erro HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    if (data.reviews && data.reviews.length > 0) {
      return { reviews: data.reviews, error: null };
    }

    return {
      reviews: null,
      error: data.error || "Nenhuma avaliação encontrada",
    };
  } catch (error) {
    return {
      reviews: null,
      error: error.message || "Erro de conexão",
    };
  }
}

// Função para renderizar estrelas
function renderStars(rating) {
  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<i class="fas fa-star star ${
      i <= rating ? "" : "empty"
    }"></i>`;
  }
  return starsHtml;
}

// Função para criar um card de avaliação
function createReviewCard(review, index) {
  return `
    <div class="review-card" data-index="${index}">
      <div class="review-header">
        <div class="review-avatar">${review.initial}</div>
        <div class="review-info">
          <div class="review-name">${review.name}</div>
          <div class="review-date">${review.date}</div>
        </div>
      </div>
      <div class="review-rating">
        ${renderStars(review.rating)}
      </div>
      <div class="review-text">${review.text}</div>
      <div class="review-google-badge">
        <i class="fab fa-google"></i>
        <span>Avaliação do Google</span>
      </div>
    </div>
  `;
}

// Classe do Carrossel de Avaliações
class ReviewsCarousel {
  constructor(reviews, containerId) {
    this.reviews = reviews;
    this.currentPage = 0;
    this.track = document.getElementById(containerId);
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.dotsContainer = document.getElementById("carouselDots");
    this.itemsPerView = this.getItemsPerView();

    this.init();
  }

  getItemsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  totalPages() {
    return Math.ceil(this.reviews.length / this.itemsPerView);
  }

  init() {
    // Renderizar cards
    this.renderCards();

    // Criar dots
    this.createDots();

    // Adicionar event listeners
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    // Navegação por dots
    this.dotsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("carousel-dot")) {
        const index = parseInt(e.target.dataset.index);
        this.goTo(index);
      }
    });

    // Responsividade: recalcula páginas ao mudar o viewport
    window.addEventListener("resize", () => {
      const newItems = this.getItemsPerView();
      if (newItems !== this.itemsPerView) {
        const firstVisibleIndex = this.currentPage * this.itemsPerView;
        this.itemsPerView = newItems;
        this.currentPage = Math.floor(firstVisibleIndex / this.itemsPerView);
        this.createDots();
        this.updateCarousel();
      }
    });

    // Auto-play (opcional - descomente se quiser)
    // this.startAutoPlay();

    // Navegação por teclado
    document.addEventListener("keydown", (e) => {
      if (
        document.querySelector(".avaliacoes").getBoundingClientRect().top <
          window.innerHeight &&
        document.querySelector(".avaliacoes").getBoundingClientRect().bottom > 0
      ) {
        if (e.key === "ArrowLeft") this.prev();
        if (e.key === "ArrowRight") this.next();
      }
    });

    // Touch/swipe support
    this.addTouchSupport();

    // Atualizar estado inicial
    this.updateCarousel();
  }

  renderCards() {
    this.track.innerHTML = this.reviews
      .map((review, index) => createReviewCard(review, index))
      .join("");
  }

  createDots() {
    const pages = this.totalPages();
    this.dotsContainer.innerHTML = Array.from({ length: pages })
      .map(
        (_, index) =>
          `<button class="carousel-dot ${
            index === this.currentPage ? "active" : ""
          }" data-index="${index}" aria-label="Ir para página ${
            index + 1
          }"></button>`
      )
      .join("");
  }

  updateCarousel() {
    const offset = -this.currentPage * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    // Atualizar dots
    const dots = this.dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentPage);
    });

    // Atualizar botões
    this.prevBtn.disabled = this.currentPage === 0;
    this.nextBtn.disabled = this.currentPage === this.totalPages() - 1;
  }

  prev() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateCarousel();
    }
  }

  next() {
    if (this.currentPage < this.totalPages() - 1) {
      this.currentPage++;
      this.updateCarousel();
    }
  }

  goTo(index) {
    if (index >= 0 && index < this.totalPages()) {
      this.currentPage = index;
      this.updateCarousel();
    }
  }

  startAutoPlay(interval = 5000) {
    this.autoPlayInterval = setInterval(() => {
      if (this.currentPage < this.totalPages() - 1) this.next();
      else this.goTo(0);
    }, interval);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  addTouchSupport() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.track.style.transition = "none";
    });

    this.track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      const container = this.track.parentElement;
      const offsetPercent =
        -this.currentPage * 100 + (diffX / container.offsetWidth) * 100;
      this.track.style.transform = `translateX(${offsetPercent}%)`;
    });

    this.track.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      this.track.style.transition =
        "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      const diffX = currentX - startX;
      const threshold = 50; // pixels

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0 && this.currentPage > 0) this.prev();
        else if (diffX < 0 && this.currentPage < this.totalPages() - 1)
          this.next();
        else this.updateCarousel();
      } else this.updateCarousel();
    });
  }
}

// Função para mostrar mensagem de erro do Google
function showGoogleErrorMessage() {
  const errorMessage = document.getElementById("googleErrorMessage");
  if (errorMessage) {
    errorMessage.style.display = "block";
  }
}

// Função para ocultar mensagem de erro do Google
function hideGoogleErrorMessage() {
  const errorMessage = document.getElementById("googleErrorMessage");
  if (errorMessage) {
    errorMessage.style.display = "none";
  }
}

// Reviews de exemplo (fallback)
const exampleReviews = [
  {
    name: "Maria Silva",
    rating: 5,
    text: "Excelente atendimento! A equipe da REIBACK foi muito profissional e me ajudou a encontrar o seguro perfeito para minha necessidade. Super recomendo!",
    date: "15 de Janeiro, 2025",
    initial: "M",
  },
  {
    name: "João Santos",
    rating: 5,
    text: "Atendimento impecável e rápido. Conseguiram as melhores condições do mercado para o seguro do meu veículo. Profissionais muito competentes!",
    date: "12 de Janeiro, 2025",
    initial: "J",
  },
  {
    name: "Ana Costa",
    rating: 5,
    text: "Muito satisfeita com o serviço! A REIBACK realmente entende as necessidades do cliente e oferece soluções personalizadas. Nota 10!",
    date: "10 de Janeiro, 2025",
    initial: "A",
  },
];

// Inicializar carrossel quando a página carregar
document.addEventListener("DOMContentLoaded", async () => {
  hideGoogleErrorMessage();

  const isLocalDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "";

  const googleData = await fetchGoogleReviews();
  const reviews = googleData.reviews || exampleReviews;

  // Mostrar mensagem de erro apenas em produção quando falhar
  // Em desenvolvimento local, não mostra erro (usa reviews de exemplo silenciosamente)
  if ((googleData.error || !googleData.reviews) && !isLocalDev) {
    showGoogleErrorMessage();
  }

  // Inicializar carrossel
  if (reviews && reviews.length > 0) {
    new ReviewsCarousel(reviews, "reviewsTrack");
  } else {
    console.error("❌ Nenhuma review disponível");
  }
});
