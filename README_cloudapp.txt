Приложение cloudapp подключается к API mongolab - облачному серверу mongodb.

Ссылка при установке к корневую папку сервера localhost/cloudapp/www/index.html  
(в моем случае это было C:/xampp/htdocs/cloudapp/www/index.html).

Frontend часть приложения выполнена на основе ionic framework и у правляется одним контроллером(cloudapp/www/js/controllers.js)

Основные модели:
 $scope.user - текущий пользователь
 $scope.cloudusers - массив пользователей, подгружаемый из mongolab.
 
На клиентской стороне проверяются на валидность данные форм регистрации и авторизации,
при этом используются как средства angularjs, 
так и отдельные функции с регулярными выражениями (cloudapp/www/lib_js/valid_script.js).

Данные форм отправляются серверу с соответствующим параметром 'action', в соответствии с которым
выполняется дальнейший сценарий: авторизация, регистрация, загрузка списка пользователей, выход из аккаунта.

При успешной авторизации или регистрации происходит переход на страницу списка зарегестрированных пользователей.
Вначале загружаются данные 5 пользователей. 
После при клике на соответствующие кнопки внизу и вверху списка подгружаются еще по 5 пользователей.

Backend часть выполнена на PHP.
На сервере (индексный файл cloudapp/www/index.php) при получении запроса от клиетна 
создается объект $cloudAgent класса CloudApi (cloudapp/www/lib_php/cloud_api.php),
который обращается к mongolab .



