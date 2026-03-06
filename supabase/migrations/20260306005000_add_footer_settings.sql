-- Add Footer settings to site_settings
INSERT INTO public.site_settings (key, value, description)
VALUES 
('footer_address', 'Av. Paulista, 1000 - São Paulo, SP', 'Endereço exibido no rodapé'),
('footer_phone', '(11) 99999-9999', 'Telefone exibido no rodapé'),
('footer_email', 'contato@enfermagembrilhante.com.br', 'Email exibido no rodapé'),
('social_instagram', 'https://instagram.com/portal.enfermagem', 'Link do Instagram'),
('social_facebook', 'https://facebook.com/portal.enfermagem', 'Link do Facebook'),
('social_youtube', 'https://youtube.com/portal.enfermagem', 'Link do YouTube')
ON CONFLICT (key) DO NOTHING;
