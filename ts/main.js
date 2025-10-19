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
      if (e.target && e.target.tagName === 'A') {
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
    if (!e.target.closest('.dropdown')) {
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

  // Sistema de notificações removido

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
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar elementos com animação
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .fade-in-up');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
});

// PWA
function initializePWA() {
  // Verificar se já está instalado
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('PWA já instalado');
  }
  
  // Solicitar instalação
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar botão de instalação
    showInstallButton(deferredPrompt);
  });
}

function showInstallButton(deferredPrompt) {
  const installButton = document.createElement('button');
  installButton.textContent = 'Instalar App';
  installButton.className = 'installButton';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1a1a1a;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 1000;
    font-weight: 500;
  `;
  
  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA instalado');
      }
      deferredPrompt = null;
      installButton.remove();
    });
  });
  
  document.body.appendChild(installButton);
}

// Galeria
function initializeGallery() {
  const filterButtons = document.querySelectorAll('.galleryFilter');
  const galleryItems = document.querySelectorAll('.galleryItem');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remover active de todos os botões
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Adicionar active ao botão clicado
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
          item.style.display = 'none';
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
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// API do GitHub - Integração com Java
async function loadGitHubData() {
  console.log('Iniciando carregamento do GitHub...');
  
  try {
    // Tentar carregar via API Java primeiro
    try {
      console.log('Tentando carregar via API Java...');
      const javaResponse = await fetch('http://localhost:8080/api/github/stats');
      const javaData = await javaResponse.json();
      console.log('Dados do Java:', javaData);
      
      // Atualizar estatísticas
      const reposElement = document.getElementById('repos');
      const followersElement = document.getElementById('followers');
      const starsElement = document.getElementById('stars');
      
      if (reposElement) reposElement.textContent = javaData.publicRepos || 0;
      if (followersElement) followersElement.textContent = javaData.followers || 0;
      if (starsElement) starsElement.textContent = javaData.totalStars || 0;
      
      // Carregar repositórios via Java
      const reposResponse = await fetch('http://localhost:8080/api/github/repos');
      const reposData = await reposResponse.json();
      console.log('Repositórios carregados via Java:', reposData.length);
      
      displayGitHubRepos(reposData);
      return;
      
    } catch (javaError) {
      console.log('API Java não disponível, usando GitHub direto:', javaError);
    }
    
    // Fallback para GitHub direto
    console.log('Carregando dados do usuário...');
    const userResponse = await fetch('https://api.github.com/users/Gabriell12321');
    const userData = await userResponse.json();
    console.log('Dados do usuário:', userData);
    
    // Carregar repositórios
    console.log('Carregando repositórios...');
    const reposResponse = await fetch('https://api.github.com/users/Gabriell12321/repos?sort=updated&per_page=100');
    const reposData = await reposResponse.json();
    console.log('Repositórios carregados:', reposData.length);
    
    // Atualizar estatísticas
    const reposElement = document.getElementById('repos');
    const followersElement = document.getElementById('followers');
    const starsElement = document.getElementById('stars');
    
    if (reposElement) reposElement.textContent = userData.public_repos;
    if (followersElement) followersElement.textContent = userData.followers;
    if (starsElement) starsElement.textContent = userData.public_repos;
    
    // Atualizar repositórios na seção social
    console.log('Exibindo repositórios...');
    displayGitHubRepos(reposData);
    
  } catch (error) {
    console.error('Erro ao carregar dados do GitHub:', error);
    showGitHubError();
  }
}

// Exibir repositórios do GitHub com filtros
function displayGitHubRepos(repos) {
  console.log('Exibindo repositórios do GitHub...');
  
  const reposContainer = document.getElementById('githubRepos');
  if (!reposContainer) {
    console.error('Container githubRepos não encontrado');
    return;
  }
  
  console.log('Container encontrado:', reposContainer);
  
  if (repos.length === 0) {
    reposContainer.innerHTML = '<div class="loading">Nenhum repositório encontrado</div>';
    return;
  }
  
  console.log('Repositórios encontrados:', repos.length);
  
  // Criar filtros por tópicos e categorias
  const topics = [...new Set(repos.flatMap(repo => repo.topics || []))];
  const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
  
  console.log('Tópicos encontrados:', topics);
  console.log('Linguagens encontradas:', languages);
  
  // Criar interface de filtros
  const filtersHTML = `
    <div class="githubFilters">
      <div class="filterSection">
        <h4>Filtrar por Tópicos:</h4>
        <div class="filterButtons">
          <button class="filterBtn active" data-filter="all">Todos</button>
          ${topics.slice(0, 10).map(topic => `
            <button class="filterBtn" data-filter="topic:${topic}">${topic}</button>
          `).join('')}
        </div>
      </div>
      <div class="filterSection">
        <h4>Filtrar por Linguagem:</h4>
        <div class="filterButtons">
          <button class="filterBtn active" data-filter="all">Todas</button>
          ${languages.slice(0, 8).map(lang => `
            <button class="filterBtn" data-filter="language:${lang}">${lang}</button>
          `).join('')}
        </div>
      </div>
      <div class="filterSection">
        <h4>Ordenar por:</h4>
        <div class="filterButtons">
          <button class="filterBtn active" data-sort="updated">Atualização</button>
          <button class="filterBtn" data-sort="stars">Estrelas</button>
          <button class="filterBtn" data-sort="forks">Forks</button>
          <button class="filterBtn" data-sort="name">Nome</button>
        </div>
      </div>
    </div>
  `;
  
  // Adicionar filtros ao container
  reposContainer.innerHTML = filtersHTML + '<div class="reposList"></div>';
  
  console.log('Filtros adicionados ao container');
  
  // Renderizar repositórios
  renderRepos(repos);
  
  // Adicionar event listeners para filtros
  addFilterListeners(repos);
  
  console.log('GitHub configurado com sucesso');
}

// Renderizar lista de repositórios
function renderRepos(repos, filter = 'all', sort = 'updated') {
  console.log('Renderizando repositórios...', { filter, sort, reposCount: repos.length });
  
  const reposList = document.querySelector('.reposList');
  if (!reposList) {
    console.error('Lista de repositórios não encontrada');
    return;
  }
  
  let filteredRepos = [...repos];
  
  // Aplicar filtros
  if (filter !== 'all') {
    if (filter.startsWith('topic:')) {
      const topic = filter.replace('topic:', '');
      filteredRepos = repos.filter(repo => repo.topics && repo.topics.includes(topic));
    } else if (filter.startsWith('language:')) {
      const language = filter.replace('language:', '');
      filteredRepos = repos.filter(repo => repo.language === language);
    }
  }
  
  // Aplicar ordenação
  filteredRepos.sort((a, b) => {
    switch (sort) {
      case 'stars':
        return b.stargazers_count - a.stargazers_count;
      case 'forks':
        return b.forks_count - a.forks_count;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updated':
      default:
        return new Date(b.updated_at) - new Date(a.updated_at);
    }
  });
  
  // Renderizar HTML
  const reposHTML = filteredRepos.map(repo => {
    const topicsHTML = repo.topics && repo.topics.length > 0 ? 
      repo.topics.slice(0, 3).map(topic => `<span class="repoTopic">${topic}</span>`).join('') : '';
    
    return `
      <div class="repoItem">
        <div class="repoHeader">
          <div class="repoName">
            <a href="${repo.html_url}" target="_blank" style="color: #1a1a1a; text-decoration: none;">
              ${repo.name}
            </a>
          </div>
          <div class="repoLanguage">${repo.language || 'Sem linguagem'}</div>
        </div>
        <div class="repoDescription">${repo.description || 'Sem descrição'}</div>
        <div class="repoTopics">${topicsHTML}</div>
        <div class="repoStats">
          <div class="repoStat">
            <span>Stars: ${repo.stargazers_count}</span>
          </div>
          <div class="repoStat">
            <span>Forks: ${repo.forks_count}</span>
          </div>
          <div class="repoStat">
            <span>Atualizado: ${new Date(repo.updated_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  reposList.innerHTML = reposHTML;
}

// Adicionar event listeners para filtros
function addFilterListeners(repos) {
  console.log('Adicionando event listeners para filtros...');
  
  const filterButtons = document.querySelectorAll('.filterBtn');
  console.log('Botões de filtro encontrados:', filterButtons.length);
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Botão clicado:', button.textContent);
      
      // Remover classe active de todos os botões do mesmo grupo
      const group = button.closest('.filterSection');
      group.querySelectorAll('.filterBtn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Aplicar filtro
      const filter = button.dataset.filter || 'all';
      const sort = button.dataset.sort || 'updated';
      
      console.log('Aplicando filtro:', { filter, sort });
      
      if (filter) {
        renderRepos(repos, filter, sort);
      } else if (sort) {
        renderRepos(repos, 'all', sort);
      }
    });
  });
  
  console.log('Event listeners adicionados com sucesso');
}

// Mostrar erro do GitHub
function showGitHubError() {
  const reposContainer = document.getElementById('githubRepos');
  if (reposContainer) {
    reposContainer.innerHTML = '<div class="loading">Erro ao carregar repositórios</div>';
  }
}

// Função removida - agora integrada em loadLinkedInData()

// Função removida - agora integrada em loadLinkedInData()

// Sistema de conquistas removido

// Chat Bot
function initializeChatBot() {
  const chatBot = document.getElementById('chatBot');
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

// Carregar posts do LinkedIn
function loadLinkedInData() {
  console.log('Iniciando carregamento do LinkedIn...');
  
  // Posts do LinkedIn
  const posts = [
    "Desenvolvedor apaixonado por tecnologia e soluções inovadoras. Sempre em busca de novos desafios e oportunidades de crescimento.",
    "Trabalhando com TypeScript, Python e Rust para criar soluções robustas e escaláveis. A tecnologia é minha paixão!",
    "Estudando Engenharia de Software na Estácio. Cada dia é uma nova oportunidade de aprender e evoluir como desenvolvedor.",
    "Participando de hackathons e eventos de tecnologia para expandir minha rede e conhecimento. Networking é fundamental!",
    "Desenvolvendo projetos open source para contribuir com a comunidade. Código aberto é o futuro!"
  ];
  
  const dates = [
    "Publicado recentemente",
    "2 dias atrás", 
    "1 semana atrás",
    "2 semanas atrás",
    "3 semanas atrás"
  ];
  
  const container = document.querySelector('.linkedinContent');
  if (container) {
    const postsHTML = posts.map((post, index) => `
      <div class="linkedinPost" style="animation-delay: ${index * 0.1}s;">
        <p class="postText">${post}</p>
        <span class="postDate">${dates[index]}</span>
      </div>
    `).join('');
    
    container.innerHTML = postsHTML;
    console.log('Posts do LinkedIn carregados com sucesso');
  } else {
    console.error('Container do LinkedIn não encontrado');
  }
}

// Função de teste para carregar LinkedIn manualmente
function testLinkedIn() {
  console.log('=== TESTE LINKEDIN ===');
  console.log('Container:', document.querySelector('.linkedinContent'));
  console.log('HTML atual:', document.querySelector('.linkedinContent')?.innerHTML);
  console.log('=== FIM TESTE ===');
}

// Função de teste para GitHub
function testGitHub() {
  console.log('=== TESTE GITHUB ===');
  console.log('Container:', document.getElementById('githubRepos'));
  console.log('HTML atual:', document.getElementById('githubRepos')?.innerHTML);
  loadGitHubData();
  console.log('=== FIM TESTE ===');
}

// Disponibilizar funções globalmente para teste
window.testLinkedIn = testLinkedIn;
window.testGitHub = testGitHub;

// Função de debug para verificar elementos
function debugLinkedIn() {
  console.log('=== DEBUG LINKEDIN ===');
  console.log('Container LinkedIn:', document.querySelector('.linkedinContent'));
  console.log('Seção social:', document.querySelector('.socialSection'));
  console.log('Card LinkedIn:', document.querySelector('.socialCard'));
  console.log('========================');
}

// Carregar dados dos projetos via Java
async function loadJavaProjects() {
  try {
    console.log('Carregando projetos via Java...');
    const response = await fetch('http://localhost:8080/api/projects');
    const projects = await response.json();
    console.log('Projetos carregados via Java:', projects.length);
    
    // Exibir projetos na seção de projetos se existir
    displayJavaProjects(projects);
    
  } catch (error) {
    console.log('Erro ao carregar projetos Java:', error);
  }
}

// Carregar dados das skills via Java
async function loadJavaSkills() {
  try {
    console.log('Carregando skills via Java...');
    const response = await fetch('http://localhost:8080/api/skills');
    const skills = await response.json();
    console.log('Skills carregadas via Java:', skills.length);
    
    // Exibir skills na seção de skills se existir
    displayJavaSkills(skills);
    
  } catch (error) {
    console.log('Erro ao carregar skills Java:', error);
  }
}

// Carregar analytics via Java
async function loadJavaAnalytics() {
  try {
    console.log('Carregando analytics via Java...');
    const response = await fetch('http://localhost:8080/api/analytics/stats');
    const analytics = await response.json();
    console.log('Analytics carregados via Java:', analytics);
    
    // Exibir analytics no dashboard se existir
    displayJavaAnalytics(analytics);
    
  } catch (error) {
    console.log('Erro ao carregar analytics Java:', error);
  }
}

// Exibir projetos Java
function displayJavaProjects(projects) {
  const projectsContainer = document.querySelector('.projectsGrid') || document.querySelector('.projects');
  if (!projectsContainer) return;
  
  const projectsHTML = projects.map(project => `
    <div class="projectCard">
      <h4>${project.name}</h4>
      <p>${project.description || 'Sem descrição'}</p>
      <div class="projectTech">${project.techStack || 'Tecnologia não especificada'}</div>
      <div class="projectStats">
        <span>Stars: ${project.stars || 0}</span>
        <span>Forks: ${project.forks || 0}</span>
      </div>
      ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank">Ver no GitHub</a>` : ''}
    </div>
  `).join('');
  
  projectsContainer.innerHTML = projectsHTML;
}

// Exibir skills Java
function displayJavaSkills(skills) {
  const skillsContainer = document.querySelector('.skillsGrid') || document.querySelector('.skills');
  if (!skillsContainer) return;
  
  const skillsHTML = skills.map(skill => `
    <div class="skillItem">
      <div class="skillName">${skill.name}</div>
      <div class="skillLevel">
        <div class="skillBar" style="width: ${(skill.level / 10) * 100}%"></div>
      </div>
      <div class="skillCategory">${skill.category}</div>
    </div>
  `).join('');
  
  skillsContainer.innerHTML = skillsHTML;
}

// Exibir analytics Java
function displayJavaAnalytics(analytics) {
  console.log('Analytics disponíveis:', analytics);
  // Implementar exibição de analytics conforme necessário
}

// Carregar dados quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, iniciando carregamento de dados...');
  
  // Carregar dados imediatamente
  loadGitHubData();
  loadLinkedInData();
  loadDashboardData();
  
  // Carregar dados Java
  loadJavaProjects();
  loadJavaSkills();
  loadJavaAnalytics();
  
  initializeChatBot();
});

// Carregar também quando a página estiver totalmente carregada
window.addEventListener('load', function() {
  console.log('Página totalmente carregada, verificando LinkedIn...');
  
  // Verificar se o LinkedIn carregou
  const linkedinContainer = document.querySelector('.linkedinContent');
  if (linkedinContainer && linkedinContainer.innerHTML.includes('Carregando')) {
    console.log('LinkedIn ainda carregando, forçando...');
  }
});

// Carregar dados reais do dashboard
async function loadDashboardData() {
  console.log('Carregando dados reais do dashboard...');
  
  try {
    // Carregar dados do usuário GitHub
    const userResponse = await fetch('https://api.github.com/users/Gabriell12321');
    const userData = await userResponse.json();
    
    // Carregar eventos do GitHub (commits)
    const eventsResponse = await fetch('https://api.github.com/users/Gabriell12321/events?per_page=100');
    const eventsData = await eventsResponse.json();
    
    // Carregar repositórios
    const reposResponse = await fetch('https://api.github.com/users/Gabriell12321/repos?sort=updated&per_page=100');
    const reposData = await reposResponse.json();
    
    // Processar dados
    updateDashboardMetrics(userData, eventsData, reposData);
    
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    // Manter dados estáticos em caso de erro
  }
}

function updateDashboardMetrics(userData, eventsData, reposData) {
  console.log('Atualizando métricas do dashboard...');
  
  // Atualizar estatísticas do GitHub
  updateGitHubStats(userData);
  
  // Atualizar commits do mês
  updateMonthlyCommits(eventsData);
  
  // Atualizar linguagens
  updateLanguages(reposData);
  
  // Atualizar atividade semanal
  updateWeeklyActivity(eventsData);
  
  // Atualizar contribuições mensais
  updateMonthlyContributions(eventsData);
  
  // Atualizar stack tecnológico
  updateTechStack(reposData);
}

function updateGitHubStats(userData) {
  const githubStats = document.querySelector('.githubStats');
  if (githubStats) {
    const statNumbers = githubStats.querySelectorAll('.statNumber');
    if (statNumbers.length >= 3) {
      statNumbers[0].textContent = userData.public_repos || 0;
      statNumbers[1].textContent = userData.total_private_repos || 0;
      statNumbers[2].textContent = userData.followers || 0;
    }
  }
}

function updateMonthlyCommits(eventsData) {
  const metricValue = document.querySelector('.metricValue');
  if (metricValue) {
    // Contar commits do mês atual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyCommits = eventsData.filter(event => {
      const eventDate = new Date(event.created_at);
      return event.type === 'PushEvent' && 
             eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    }).length;
    
    metricValue.textContent = monthlyCommits;
  }
}

function updateLanguages(reposData) {
  const languageChart = document.querySelector('.languageChart');
  if (languageChart) {
    // Contar linguagens
    const languageCount = {};
    reposData.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });
    
    // Ordenar por frequência
    const sortedLanguages = Object.entries(languageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4);
    
    // Atualizar barras de linguagem
    const langItems = languageChart.querySelectorAll('.langItem');
    sortedLanguages.forEach(([lang, count], index) => {
      if (langItems[index]) {
        const langName = langItems[index].querySelector('.langName');
        const langFill = langItems[index].querySelector('.langFill');
        const langPercent = langItems[index].querySelector('.langPercent');
        
        if (langName) langName.textContent = lang;
        if (langFill) {
          const percentage = (count / reposData.length) * 100;
          langFill.style.width = `${percentage}%`;
        }
        if (langPercent) {
          const percentage = (count / reposData.length) * 100;
          langPercent.textContent = `${Math.round(percentage)}%`;
        }
      }
    });
  }
}

function updateWeeklyActivity(eventsData) {
  const weeklyChart = document.querySelector('.weeklyChart');
  if (weeklyChart) {
    // Contar atividade por dia da semana
    const weeklyCount = [0, 0, 0, 0, 0, 0, 0]; // Seg-Dom
    
    eventsData.forEach(event => {
      if (event.type === 'PushEvent') {
        const eventDate = new Date(event.created_at);
        const dayOfWeek = eventDate.getDay(); // 0=Dom, 1=Seg, etc.
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para Seg=0
        weeklyCount[adjustedDay]++;
      }
    });
    
    // Atualizar barras
    const weekDays = weeklyChart.querySelectorAll('.weekDay');
    const maxActivity = Math.max(...weeklyCount);
    
    weekDays.forEach((day, index) => {
      const dayFill = day.querySelector('.dayFill');
      if (dayFill && maxActivity > 0) {
        const percentage = (weeklyCount[index] / maxActivity) * 100;
        dayFill.style.height = `${percentage}%`;
      }
    });
  }
}

function updateMonthlyContributions(eventsData) {
  const monthlyChart = document.querySelector('.monthlyChart');
  if (monthlyChart) {
    // Contar contribuições por mês (últimos 6 meses)
    const monthlyCount = {};
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = monthDate.toLocaleDateString('pt-BR', { month: 'short' });
      monthlyCount[monthKey] = 0;
    }
    
    eventsData.forEach(event => {
      if (event.type === 'PushEvent') {
        const eventDate = new Date(event.created_at);
        const monthKey = eventDate.toLocaleDateString('pt-BR', { month: 'short' });
        if (monthlyCount.hasOwnProperty(monthKey)) {
          monthlyCount[monthKey]++;
        }
      }
    });
    
    // Atualizar barras mensais
    const monthBars = monthlyChart.querySelectorAll('.monthBar');
    const maxContributions = Math.max(...Object.values(monthlyCount));
    
    monthBars.forEach((bar, index) => {
      const monthName = bar.querySelector('.monthName');
      const monthFill = bar.querySelector('.monthFill');
      const monthValue = bar.querySelector('.monthValue');
      
      const monthKeys = Object.keys(monthlyCount);
      if (monthKeys[index]) {
        const month = monthKeys[index];
        const count = monthlyCount[month];
        
        if (monthName) monthName.textContent = month;
        if (monthFill && maxContributions > 0) {
          const percentage = (count / maxContributions) * 100;
          monthFill.style.width = `${percentage}%`;
        }
        if (monthValue) monthValue.textContent = count;
      }
    });
  }
}

function updateTechStack(reposData) {
  const techStack = document.querySelector('.techStack');
  if (techStack) {
    // Analisar tecnologias usadas
    const techAreas = {
      'Frontend': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'React', 'Vue', 'Angular'],
      'Backend': ['Python', 'Java', 'Node.js', 'Go', 'Rust', 'PHP', 'Ruby'],
      'Database': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite'],
      'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'CI/CD']
    };
    
    const techScores = {};
    Object.keys(techAreas).forEach(area => {
      techScores[area] = 0;
    });
    
    // Analisar repositórios
    reposData.forEach(repo => {
      if (repo.language) {
        Object.entries(techAreas).forEach(([area, technologies]) => {
          if (technologies.some(tech => 
            repo.language.toLowerCase().includes(tech.toLowerCase()) ||
            tech.toLowerCase().includes(repo.language.toLowerCase())
          )) {
            techScores[area]++;
          }
        });
      }
    });
    
    // Atualizar barras de progresso
    const techItems = techStack.querySelectorAll('.techItem');
    const maxScore = Math.max(...Object.values(techScores));
    
    techItems.forEach((item, index) => {
      const techName = item.querySelector('.techName');
      const techBar = item.querySelector('.techBar');
      const techPercent = item.querySelector('.techPercent');
      
      const areaNames = Object.keys(techScores);
      if (areaNames[index]) {
        const area = areaNames[index];
        const score = techScores[area];
        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
        
        if (techName) techName.textContent = area;
        if (techBar) techBar.style.width = `${percentage}%`;
        if (techPercent) techPercent.textContent = `${Math.round(percentage)}%`;
      }
    });
  }
}
