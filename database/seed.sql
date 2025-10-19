-- Dados iniciais para o portfólio
-- Baseado nas informações do GitHub e LinkedIn

-- Inserir projetos do GitHub
INSERT OR IGNORE INTO projects (name, description, github_url, tech_stack) VALUES
('Meus Certificados', 'Plataforma para exibição de certificados profissionais', 'https://github.com/Gabriell12321/Meus-Certificados', 'HTML'),
('Jardim Cotoncio', 'Website para projeto Agrinho 2023', 'https://github.com/Gabriell12321/Jardimcotoncio-Projeto-AGRINHO2023', 'HTML'),
('Portfólio Pessoal', 'Website pessoal desenvolvido com SCSS', 'https://github.com/Gabriell12321/gabriel.github.io', 'SCSS'),
('Bot Automatizado', 'Automação desenvolvida em JavaScript', 'https://github.com/Gabriell12321/BOT', 'JavaScript'),
('IA Project', 'Projeto de inteligência artificial', 'https://github.com/Gabriell12321/IA', 'Python');

-- Inserir skills baseadas no perfil
INSERT OR IGNORE INTO skills (name, category, level) VALUES
-- Frontend
('TypeScript', 'Frontend', 4),
('React', 'Frontend', 4),
('CSS', 'Frontend', 4),
('HTML', 'Frontend', 5),
('SCSS', 'Frontend', 3),

-- Backend
('Python', 'Backend', 4),
('FastAPI', 'Backend', 3),
('Rust', 'Backend', 3),
('Go', 'Backend', 3),
('JavaScript', 'Backend', 4),

-- Dados
('SQLite', 'Database', 4),
('Julia', 'Data Science', 3),

-- Mobile
('Kotlin', 'Mobile', 3);
