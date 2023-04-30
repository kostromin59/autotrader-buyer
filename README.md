# Autotrader

1) Скачать
2) Открыть консоль в этой папке и ввести следующие команды:
```
npm i
```
```
npm run build
```
3) Скопировать файл `.env.server.example` и переименовать его в `.env`
4) Отредактировать .env
```
PG_HOST=postgres
JWT_SECRET=ОЧЕНЬ_СЛОЖНАЯ_СТРОКА
TELEGRAM_TOKEN=Токен_от_телеграм_бота
ADMIN_KEY=Ключ_от_апи
ADMIN_EMAIL=Почта_админ
```
5) Изменить ip в папке `conf.d`
6) Ввести команду `npm run start`
7) Ввести команду `npm run start:site`
