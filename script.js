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
      <a 
        href="https://www.google.com/maps/place/Reiback+Seguros+Campinas/@-22.9049853,-47.0983728,17z/data=!4m16!1m9!3m8!1s0x94c8d160203d5939:0x8ccded001fca26d1!2sReiback+Seguros+Campinas!8m2!3d-22.9049903!4d-47.0957925!9m1!1b1!16s%2Fg%2F11ngt3p3nx!3m5!1s0x94c8d160203d5939:0x8ccded001fca26d1!8m2!3d-22.9049903!4d-47.0957925!16s%2Fg%2F11ngt3p3nx?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        class="review-google-badge"
      >
        <i class="fab fa-google"></i>
        <span>Avaliação do Google</span>
      </a>
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
    this.isTransitioning = false;

    this.init();
  }

  getItemsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  totalPages() {
    // Retornar o número de páginas baseado nos reviews originais
    // Mas vamos trabalhar com os duplicados internamente
    return Math.ceil(this.reviews.length / this.itemsPerView);
  }

  getTotalItems() {
    // Retornar o total de items duplicados
    return this.reviews.length * 2;
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

    // Auto-play com 1 segundo de pausa em cada card
    this.startAutoPlay(1000);

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
    // Duplicar reviews para criar loop infinito contínuo
    const duplicatedReviews = [...this.reviews, ...this.reviews];
    this.track.innerHTML = duplicatedReviews
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

    // Atualizar dots (baseado nos reviews originais)
    const dots = this.dotsContainer.querySelectorAll(".carousel-dot");
    const dotIndex = this.currentPage % this.totalPages();
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === dotIndex);
    });

    // Atualizar botões (sempre habilitados para loop infinito)
    this.prevBtn.disabled = false;
    this.nextBtn.disabled = false;
  }

  prev() {
    if (this.isTransitioning) return;

    this.currentPage--;

    // Se voltou antes do início, ir para o final da primeira cópia
    if (this.currentPage < 0) {
      this.isTransitioning = true;
      // Remover transição temporariamente
      const originalTransition = this.track.style.transition;
      this.track.style.transition = "none";
      this.currentPage = this.totalPages() - 1;
      this.updateCarousel();

      // Forçar reflow e restaurar transição
      requestAnimationFrame(() => {
        this.track.style.transition = originalTransition || "";
        this.isTransitioning = false;
      });
    } else {
      this.updateCarousel();
    }
  }

  next() {
    if (this.isTransitioning) return;

    this.currentPage++;

    // Se chegou no final da primeira cópia, resetar sem transição visível
    if (this.currentPage >= this.totalPages()) {
      this.isTransitioning = true;
      // Remover transição temporariamente
      const originalTransition = this.track.style.transition;
      this.track.style.transition = "none";
      this.currentPage = 0;
      this.updateCarousel();

      // Forçar reflow e restaurar transição
      requestAnimationFrame(() => {
        this.track.style.transition = originalTransition || "";
        this.isTransitioning = false;
      });
    } else {
      this.updateCarousel();
    }
  }

  goTo(index) {
    if (index >= 0 && index < this.totalPages()) {
      this.currentPage = index;
      this.updateCarousel();
    }
  }

  startAutoPlay(interval = 1000) {
    this.autoPlayInterval = setInterval(() => {
      this.next(); // Usa next() que já tem lógica de loop infinito
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

// Reviews de clientes
const reviews = [
  {
    name: "Kelly Cristine Aguilera",
    rating: 5,
    text: "Atendimento de excelência!!! A minha família e amigos amam e não trocamos por nada,sempre indicamos!!\nQualidade é a alma do negócio!!!e a Reiback conhece bem isso!!!\nDeus abençoe!!!!",
    date: "Há um ano atrás",
    initial: "K",
  },
  {
    name: "Jose Luis Paiva",
    rating: 5,
    text: "Super indico, íntegro transparente e verdadeiro com as informações, pós venda excelente fiz não m arrependo farei sempre q precisar sou cliente de anos parabéns pelo trabalho",
    date: "Há um ano atrás",
    initial: "J",
  },
  {
    name: "Fernanda dos Santos",
    rating: 5,
    text: "Atendimento de ótima qualidade.",
    date: "Há um ano atrás",
    initial: "F",
  },
  {
    name: "Feer Maciel",
    rating: 5,
    text: "Melhor atendimento, muito atenciosos, precisei de um assistência  e fui muito bem orientada e o atendimento super rápido!",
    date: "Há um ano atrás",
    initial: "F",
  },
  {
    name: "Gislaine Menelli",
    rating: 5,
    text: "Ótimos profissionais! Oferecem serviços de qualidade em um ambiente organizado! Super indico !!!\nCafezinho top  também\n☕️",
    date: "Há um ano atrás",
    initial: "G",
  },
  {
    name: "Alexandre Mancilla",
    rating: 5,
    text: "Atendimento, profissionalismo, serviços de qualidade, excelente suporte. Sou cliente há anos!",
    date: "Há um ano atrás",
    initial: "A",
  },
];

// Carrossel de Logos com pausa
class LogosCarousel {
  constructor() {
    this.track = document.querySelector(".logos-carousel-track");
    this.items = document.querySelectorAll(".logos-carousel-item");
    this.container = document.querySelector(".logos-carousel-section");
    this.isPaused = false;
    this.intervalId = null;
    this.pauseDuration = 1000; // 1 segundo de pausa
    this.transitionDuration = 500; // 0.5 segundos de transição

    if (this.track && this.items.length > 0) {
      // Começar em um índice que já mostre logos visíveis (ex: 3 ou 4 logos)
      // Isso evita espaço em branco à esquerda quando a página carrega
      this.currentIndex = Math.min(3, this.items.length - 1);
      this.init();
    }
  }

  init() {
    // Centralizar primeiro logo
    this.updateCarousel();

    // Pausar quando mouse estiver sobre
    this.container.addEventListener("mouseenter", () => {
      this.pause();
    });

    this.container.addEventListener("mouseleave", () => {
      this.resume();
    });

    // Iniciar autoplay
    this.start();
  }

  updateCarousel() {
    if (!this.track || this.items.length === 0) return;

    // Remover classe active de todos
    this.items.forEach((item) => item.classList.remove("active"));

    // Adicionar classe active no item atual
    if (this.items[this.currentIndex]) {
      this.items[this.currentIndex].classList.add("active");
    }

    // Aguardar um frame para o DOM atualizar (para pegar o tamanho correto após adicionar active)
    requestAnimationFrame(() => {
      // Calcular posição para centralizar o logo ativo
      const containerWidth = this.container.offsetWidth;
      const gap = window.innerWidth <= 768 ? 32 : 48; // 2rem mobile, 3rem desktop

      // Calcular posição acumulada até o item atual
      let totalWidth = 0;
      for (let i = 0; i < this.currentIndex; i++) {
        const item = this.items[i];
        const itemWidth =
          item.offsetWidth || (window.innerWidth <= 768 ? 120 : 150);
        totalWidth += itemWidth + gap;
      }

      // Adicionar metade da largura do item ativo
      const activeItem = this.items[this.currentIndex];
      const activeWidth =
        activeItem.offsetWidth || (window.innerWidth <= 768 ? 150 : 180);
      totalWidth += activeWidth / 2;

      // Centralizar
      const scrollPosition = totalWidth - containerWidth / 2;

      // Aplicar transform
      this.track.style.transform = `translateX(${-scrollPosition}px)`;
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateCarousel();
  }

  start() {
    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, this.pauseDuration + this.transitionDuration);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Inicializar carrossel quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar carrossel com reviews
  if (reviews && reviews.length > 0) {
    new ReviewsCarousel(reviews, "reviewsTrack");
  } else {
    console.error("❌ Nenhuma review disponível");
  }

  // Inicializar carrossel de logos
  new LogosCarousel();
});
