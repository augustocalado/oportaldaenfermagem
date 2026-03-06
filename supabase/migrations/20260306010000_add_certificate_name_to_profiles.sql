-- Add full_name_certificate to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name_certificate TEXT;

-- Comment on the column for clarity
COMMENT ON COLUMN public.profiles.full_name_certificate IS 'Nome completo obrigatório para emissão de certificados';
