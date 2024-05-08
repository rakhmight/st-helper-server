# st-helper-server

### Стек технологий
<div>
    <img
    style="height: 45px;"
    src="https://cdn-icons-png.flaticon.com/512/5968/5968381.png"
    alt="TypeScript"
    />
    <img
    style="height: 45px;"
    src="https://seeklogo.com/images/F/fastify-logo-4FA5E177B6-seeklogo.com.png"
    alt="Fastify.js"
    />
    <img
    style="height: 45px;"
    src="https://miro.medium.com/v2/resize:fit:512/1*doAg1_fMQKWFoub-6gwUiQ.png"
    alt="MongoDB"
    />
</div>

###
> Проект провальный. Рабочий, но очень плохо написанный. <strong>Идёт работа над над ST v.1.2</strong>

### Информация
<strong>st-helper-server</strong> - один из модулей системы SmartTesting, который отвечает за (работает с [st-exam-client](https://github.com/rakhmight/st-exam-client)):
- проверку существующих экзаменов у пользователя;
- отдаёт списки пользователей, которые должны пройти экзамены;
- сохранение каждого действия экзаменуемого во время экзамена;
- сохранение историй действий, сохранённых на стороне клиента.

Использует ту же БД, что и [st-admin-server](https://github.com/rakhmight/st-admin-server).

### Сборка и запуск
- в .env указать переменные:
```js
SERVER_PORT // порт сервера
ST_AUTH_SERVER_IP // полный адрес st-auth-server (протокол:/ip-адрес:порт или домен)
DB_USER, DB_PASSWORD, DB_NAME // имя БД, пользователь и его пароль (используем ту же БД, что и st-admin-server)
```
- устанавливаем зависимости:
```bash
npm i
```
- компилириуем код:
```bash
npm run build
```

- После компиляции кода в build сборке создаём папку logs, а в ней папки errors и general - сюда будут сохраняться логи сервера

- запускаем сервер:
```bash
npm run start
```