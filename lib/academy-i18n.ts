export type AcademyLanguage = 'ky' | 'ru';
export const academyLanguages = {ky:'Кыргызча',ru:'Русский'} as const;
export const academyText = {
 ky:{home:'Башкы бет',game:'Оюн · 100 деңгээл',library:'Билим китепканасы',info:'Маалымат жана булактар',next:'Кийинки деңгээл',back:'Артка',xp:'Упайлар',explanation:'Эмне үчүн бул жооп туура?',sources:'Булактар',close:'Жабуу',completed:'Өттү',locked:'Жабык',open:'Баштоо',correct:'Туура! +100 XP',wrong:'Дагы аракет кылыңыз',retry:'Кайра аракет кылуу'},
 ru:{home:'Главная',game:'Игра · 100 уровней',library:'Библиотека знаний',info:'Информация и источники',next:'Следующий уровень',back:'Назад',xp:'Очки',explanation:'Почему этот ответ правильный?',sources:'Источники',close:'Закрыть',completed:'Пройден',locked:'Закрыт',open:'Начать',correct:'Верно! +100 XP',wrong:'Попробуйте ещё раз',retry:'Повторить попытку'}
} as const;
