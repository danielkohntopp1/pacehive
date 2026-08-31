-- Guarda os parâmetros brutos da notificação (nome, data, nota) em vez de só o
-- texto já pronto, para o título/corpo poderem ser montados no idioma de quem
-- está lendo (PT ou EN), não no idioma de quem gerou o evento.
alter table public.notifications
  add column data jsonb;
