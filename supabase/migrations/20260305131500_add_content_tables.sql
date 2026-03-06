-- Update profiles table to include role
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update handle_new_user function to handle master user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.email = 'augustocalado@hotmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  hours INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  rating DECIMAL(3,2),
  students INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  excerpt TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create materials table
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Policies (Publicly viewable)
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "News are viewable by everyone" ON public.news;
CREATE POLICY "News are viewable by everyone" ON public.news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Materials are viewable by everyone" ON public.materials;
CREATE POLICY "Materials are viewable by everyone" ON public.materials FOR SELECT USING (true);

-- Insert initial data for courses
INSERT INTO public.courses (title, instructor, hours, price, rating, students, category, free)
VALUES 
('Enfermagem em UTI Adulto', 'Prof. Ana Souza', 60, 197.00, 4.9, 1240, 'UTI', false),
('Saúde Pública e Atenção Básica', 'Prof. Carlos Lima', 40, 0, 4.8, 2100, 'Saúde Pública', true),
('Gestão Hospitalar para Enfermeiros', 'Profa. Maria Santos', 80, 249.00, 4.7, 890, 'Gestão', false),
('Cuidados Paliativos', 'Prof. Roberto Alves', 30, 0, 4.9, 1560, 'Enfermagem Clínica', true),
('Farmacologia Aplicada à Enfermagem', 'Profa. Juliana Costa', 45, 179.00, 4.6, 780, 'Enfermagem Clínica', false),
('Emergências e Primeiros Socorros', 'Prof. Fernando Dias', 50, 159.00, 4.8, 1890, 'UTI', false);

-- Insert initial data for news
INSERT INTO public.news (title, category, excerpt)
VALUES 
('Nova lei garante piso salarial para enfermeiros em todo o Brasil', 'Carreira', 'O Congresso Nacional aprovou a regulamentação do piso salarial da enfermagem com novas diretrizes...'),
('SUS amplia programa de vacinação em postos de saúde', 'Saúde Pública', 'O Ministério da Saúde anunciou a expansão do calendário vacinal com novas vacinas disponíveis...'),
('Congresso Nacional de Enfermagem 2026: inscrições abertas', 'Eventos', 'O maior evento de enfermagem do Brasil acontecerá em São Paulo com palestras e workshops...'),
('Técnicas inovadoras em cuidados paliativos', 'Educação', 'Novas abordagens em cuidados paliativos estão transformando o atendimento em hospitais brasileiros...');

-- Insert initial data for materials
INSERT INTO public.materials (title, type, category, size)
VALUES 
('Protocolo de Segurança do Paciente', 'PDF', 'Protocolos', '2.3 MB'),
('Apostila de Farmacologia Básica', 'PDF', 'Apostilas', '5.1 MB'),
('Manual de Procedimentos de Enfermagem', 'PDF', 'Manuais', '8.7 MB'),
('Guia de Cuidados em UTI Neonatal', 'PDF', 'Protocolos', '3.4 MB'),
('Apostila de Saúde Coletiva', 'PDF', 'Apostilas', '4.2 MB'),
('Checklist de Cirurgia Segura - OMS', 'PDF', 'Protocolos', '1.1 MB');
