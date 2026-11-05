# KORAN Sales Academy

Мобильная академия для менеджеров Hidjaz Premium. Сайт предназначен **только для обучения продажам Коранов**. Игра — один из разделов, не весь сайт. MVP содержит 10 игровых уровней; планируется 100. Число менеджеров не ограничено тремя.

## Готово
- Адаптивный личный кабинет, навигация по разделам, библиотека подтверждённых фактов.
- Вход **только через Google OAuth** в Supabase; email/password формы нет.
- 10 кыргызоязычных интерактивных ситуаций с объяснениями; уровни 11–100 обозначены как будущие.
- Прогресс и XP в Supabase с RLS по user_id. Данные разных менеджеров разделены.
- Сценарии написаны специально для Hidjaz Premium на основе типовых тем продаж и подтверждённых фактов продукта; **не заявляем**, что все 806 видео уже семантически проанализированы или процитированы.

## Подключение
1. Vercel проект `prodaji-koran` создан. Привяжите GitHub `adiletzainidinov/Satup.yiron` в Vercel → Project → Settings → Git. Vercel сообщил `repo_no_access` при автоматической привязке: предоставьте Vercel GitHub App доступ к этому репозиторию.
2. В Vercel уже добавлены `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` (публичный ключ, **не** service_role).
3. В Supabase проекте `knowledge-hub` → Authentication → Providers → Google включите Google OAuth, указав Google Client ID и Client Secret из Google Cloud. Google Authorized redirect URI: `https://obxbxwwaxjmluriyzyjw.supabase.co/auth/v1/callback`.
4. Supabase → Authentication → URL Configuration: Site URL = фактический домен Vercel, Redirect URLs = `https://<ваш-домен>/**` (при необходимости preview домены). Для входа используем `redirectTo: window.location.origin`.
5. Таблица `public.academy_progress` и RLS уже созданы и проверены в Supabase. SQL сохранён в `supabase/academy_progress.sql` для воспроизводимости; повторно выполнять его без проверки политик не требуется.

## Команды
`npm install` → `npm run dev` → `npm run build`.

## Важные ограничения MVP
- Google OAuth требует ручного подключения Google Cloud credentials; без него авторизация не заработает.
- Прогресс начисляется за выбор правильного ответа, это **тренажёр**, не защищённый экзамен. Для аттестации нужна серверная проверка.
- Пока нет свободного ИИ-диалога, голоса, лидерборда, ролей администраторов, полного анализа 806 расшифровок и уровней 11–100.
- Поскольку Google-вход доступен любому Google-аккаунту, если нужна закрытая команда, добавьте приглашения/allowlist до публичного запуска.
