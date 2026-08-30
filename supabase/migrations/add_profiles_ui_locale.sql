-- Idioma de interface preferido do usuário (pt/en), usado para localizar
-- textos que o servidor gera fora do navegador do usuário, como e-mails.
alter table public.profiles
  add column ui_locale text not null default 'pt' check (ui_locale in ('pt', 'en'));
