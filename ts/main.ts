// Navegação entre páginas
document.addEventListener('DOMContentLoaded', function() {
  // Highlight da página ativa no menu
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.navList a');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navList.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navList.addEventListener('click', function(e) {
      if (e.target && (e.target as HTMLElement).tagName === 'A') {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
      }
    });
  }

  // Dropdown menu toggle
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const dropdown = this.parentElement;
      const menu = dropdown.querySelector('.dropdown-menu');
      
      // Close other dropdowns
      document.querySelectorAll('.dropdown').forEach(drop => {
        if (drop !== dropdown) {
          drop.classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      dropdown.classList.toggle('active');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!(e.target as HTMLElement).closest('.dropdown')) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });

  // Registrar Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado com sucesso:', registration);
      })
      .catch(error => {
        console.log('Falha ao registrar SW:', error);
      });
  }

  // Solicitar permissão para notificações
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Permissão para notificações concedida');
      }
    });
  }

  // Inicializar PWA
  initializePWA();
  
  // Inicializar funcionalidades específicas
  initializeGallery();
  initializeScrollProgress();
});

// Animação de entrada para elementos
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
  const animateElements = document.querySelectorAll('.projectCard, .skillCategory, .statItem, .blogPost, .certCard, .metricCard, .galleryItem, .toolCard');
  animateElements.forEach(el => {
    observer.observe(el);
  });
});

// Inicializar PWA
function initializePWA() {
  // Adicionar manifest
  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = '/manifest.json';
  document.head.appendChild(manifestLink);

  // Meta tags para PWA
  const metaTheme = document.createElement('meta');
  metaTheme.name = 'theme-color';
  metaTheme.content = '#1a1a1a';
  document.head.appendChild(metaTheme);

  const metaApple = document.createElement('meta');
  metaApple.name = 'apple-mobile-web-app-capable';
  metaApple.content = 'yes';
  document.head.appendChild(metaApple);

  const metaAppleStatusBar = document.createElement('meta');
  metaAppleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
  metaAppleStatusBar.content = 'default';
  document.head.appendChild(metaAppleStatusBar);
}

// Galeria com filtros
function initializeGallery() {
  const filterBtns = document.querySelectorAll('.filterBtn');
  const galleryItems = document.querySelectorAll('.galleryItem');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover active de todos os botões
      filterBtns.forEach(b => b.classList.remove('active'));
      // Adicionar active ao botão clicado
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          (item as HTMLElement).style.display = 'block';
          (item as HTMLElement).style.animation = 'fadeInUp 0.6s ease-out';
        } else {
          (item as HTMLElement).style.display = 'none';
        }
      });
    });
  });
}


// Barra de progresso de scroll
function initializeScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// API do GitHub
async function loadGitHubData() {
  try {
    // Carregar dados do usuário
    const userResponse = await fetch('https://api.github.com/users/Gabriell12321');
    const userData = await userResponse.json();
    
    // Carregar repositórios
    const reposResponse = await fetch('https://api.github.com/users/Gabriell12321/repos?sort=updated&per_page=5');
    const reposData = await reposResponse.json();
    
    // Atualizar estatísticas
    const reposElement = document.getElementById('repos');
    const followersElement = document.getElementById('followers');
    const starsElement = document.getElementById('stars');
    
    if (reposElement) reposElement.textContent = userData.public_repos;
    if (followersElement) followersElement.textContent = userData.followers;
    if (starsElement) starsElement.textContent = userData.public_repos; // Aproximação
    
    // Atualizar repositórios na seção social
    displayGitHubRepos(reposData);
    
  } catch (error) {
    console.log('Erro ao carregar dados do GitHub:', error);
    showGitHubError();
  }
}

// Exibir repositórios do GitHub
function displayGitHubRepos(repos: any[]) {
  const reposContainer = document.getElementById('githubRepos');
  if (!reposContainer) return;
  
  if (repos.length === 0) {
    reposContainer.innerHTML = '<div class="loading">Nenhum repositório encontrado</div>';
    return;
  }
  
  const reposHTML = repos.map(repo => `
    <div class="repoItem">
      <div class="repoName">
        <a href="${repo.html_url}" target="_blank" style="color: #1a1a1a; text-decoration: none;">
          ${repo.name}
        </a>
      </div>
      <div class="repoDescription">${repo.description || 'Sem descrição'}</div>
      <div class="repoStats">
        <div class="repoStat">
          <span>⭐</span>
          <span>${repo.stargazers_count}</span>
        </div>
        <div class="repoStat">
          <span>🍴</span>
          <span>${repo.forks_count}</span>
        </div>
        <div class="repoStat">
          <span>📅</span>
          <span>${new Date(repo.updated_at).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  `).join('');
  
  reposContainer.innerHTML = reposHTML;
}

// Mostrar erro do GitHub
function showGitHubError() {
  const reposContainer = document.getElementById('githubRepos');
  if (reposContainer) {
    reposContainer.innerHTML = '<div class="loading">Erro ao carregar repositórios</div>';
  }
}

// Simular posts do LinkedIn (API restrita)
function loadLinkedInPosts() {
  const linkedinPosts = [
    {
      text: "Desenvolvedor apaixonado por tecnologia e soluções inovadoras. Sempre em busca de novos desafios e oportunidades de crescimento.",
      date: "Publicado recentemente"
    },
    {
      text: "Trabalhando com TypeScript, Python e Rust para criar soluções robustas e escaláveis. A tecnologia é minha paixão!",
      date: "2 dias atrás"
    },
    {
      text: "Estudando Engenharia de Software na Estácio. Cada dia é uma nova oportunidade de aprender e evoluir como desenvolvedor.",
      date: "1 semana atrás"
    }
  ];
  
  displayLinkedInPosts(linkedinPosts);
}

// Exibir posts do LinkedIn
function displayLinkedInPosts(posts: any[]) {
  const linkedinContainer = document.querySelector('.linkedinContent');
  if (!linkedinContainer) return;
  
  const postsHTML = posts.map(post => `
    <div class="linkedinPost">
      <p class="postText">${post.text}</p>
      <span class="postDate">${post.date}</span>
    </div>
  `).join('');
  
  linkedinContainer.innerHTML = postsHTML;
}

// Sistema de conquistas
function initializeAchievements() {
  const achievements = [
    { id: 'first-project', condition: () => true, title: 'Primeiro Projeto', description: 'Completou seu primeiro projeto' },
    { id: 'github-star', condition: () => Math.random() > 0.7, title: 'Estrela no GitHub', description: 'Recebeu uma estrela' },
    { id: 'blog-post', condition: () => Math.random() > 0.8, title: 'Blogueiro', description: 'Escreveu um post no blog' }
  ];

  achievements.forEach(achievement => {
    if (achievement.condition()) {
      showAchievement(achievement);
    }
  });
}

function showAchievement(achievement) {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-content">
      <div class="achievement-icon">🏆</div>
      <div class="achievement-text">
        <h4>${achievement.title}</h4>
        <p>${achievement.description}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Chat Bot
function initializeChatBot() {
  const chatBot = document.getElementById('chatBot') as HTMLElement;
  const chatToggle = document.getElementById('chatToggle');
  
  if (chatToggle && chatBot) {
    chatToggle.addEventListener('click', () => {
      chatBot.classList.toggle('active');
    });
  }

  const closeChat = document.querySelector('.closeChat');
  if (closeChat && chatBot) {
    closeChat.addEventListener('click', () => {
      chatBot.classList.remove('active');
    });
  }
}

// Carregar dados quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
  loadGitHubData();
  loadLinkedInPosts();
  initializeAchievements();
  initializeChatBot();
});
