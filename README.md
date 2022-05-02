# Google Sheet auto grader

## Задача

Автоматически отмечаем `+` в таблице Google Sheet при успешном прохождении тестов.

На вход имеем таблицу:

| # |    Фамилия Имя    |   Контакты   |  Github   | ... |
|---|-------------------|--------------|-----------|-----|
| 1 | Романов Алексей   | @romanowalex | romanow   | ... |
| 2 | Иванов Иван       | @notexisting | ivanov    | ... |
| 3 | Сидоренко Николай | @sidorenko   | sidorenko | ... |

По имени пользователя ищем строку, но номеру лабораторной вычисляем столбец.

## Использование

```yaml
- uses: romanow/google-sheet-autograder-marker@v1.0
  with:
    sheet_id: "<google-sheet-id>"
    google_token: "<google-service-account-token>"
    homework_number: 1
    user_column: "D"
    column_offset: "F"
    mark: "'+"
```

## Реализация

#### Входные данные

| Название        | Тип    | Описание                      | Обязательность | Значение по-умолчанию |
|-----------------|:------:|-------------------------------|:--------------:|:---------------------:|
| sheet_id        | string | ID таблицы в Google Sheet     | +              |                       |
| google_token    | string | Google Service token          | +              |                       |
| homework_number | number | Номер работы                  | +              |                       |
| mark            | string | Отметка                       | -              | +                     |
| user_column     | string | Номер колонки с пользователем | -              | D                     |
| column_offset   | string | Базовое смещение колонки      | -              | F                     |

#### Алгоритм выполнения

1. Google API key получаем через параметры action. Регистрируем как JWT.
2. Пользователя, который запустил сборку, получаем из `github_user`, который [подставляется в default](action.yml) как
   параметр Github Context (`${{ github.actor }}`).
3. Запрашиваем строки 1:100 в колонке `user_column`, в полученных данных ищем пользователя. Если нашли, то получаем
   индекс строки `row`.
4. По номеру лабораторной работы `homework_ number` и базового смещения `column_offset` вычисляем номер колонки
   `column`, в которой нужно поставить отметку.
5. Ставим отметку `mark` в строке `row` из п.3 и колонке `column`.

#### Google Service Account

1. Зайти в Google Cloud Platform -> [Manage Resources](https://console.cloud.google.com/cloud-resource-manager) ->
   Create Project: Github Classroom Autograder.
2. [Manage Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) -> Create Service Account.
   Использовать роль Viewer.
3. [Включить Google Sheet API](https://console.cloud.google.com/apis/api/sheets.googleapis.com/overview) для Github
   Classroom Autograder.
4. Добавить Service Account (email) как редактора в Google Sheet.

Создание Service Account описано [здесь](https://developers.google.com/identity/protocols/oauth2/service-account).
