-- Add SEO settings to site_settings
INSERT INTO public.site_settings (key, value, description)
VALUES 
('seo_title', 'Portal da Enfermagem - Educação e Informação', 'Título SEO das páginas'),
('seo_description', 'O maior portal de educação continuada e notícias para profissionais de enfermagem.', 'Meta descrição SEO'),
('seo_keywords', 'enfermagem, cursos, saúde, hospitalar, uti, coren', 'Palavras-chave SEO')
ON CONFLICT (key) DO NOTHING;
