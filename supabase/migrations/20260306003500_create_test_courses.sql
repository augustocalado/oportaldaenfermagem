-- Create test courses
INSERT INTO public.courses (title, instructor, hours, price, rating, students, category, free)
VALUES 
('Curso de Teste - Emissão de Certificado', 'Instrutor Teste', 10, 0, 5.0, 10, 'Educação', true),
('Curso Premium de Teste - Checkout PIX', 'Instrutor Teste', 20, 97.00, 5.0, 5, 'Enfermagem Clínica', false)
ON CONFLICT DO NOTHING;
