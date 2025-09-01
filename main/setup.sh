#!/bin/bash

message()
{
  if [ "$1" != "false" ]; then
    echo "[ INFO ~ $1 ]: $2"
  else
    echo "[ INFO ]: $2"
  fi
}

message false "> Проверка требований"

message "CHECK" "Проверка Python..."

if ! command -v python &> /dev/null; then
  message "ERROR" "Ошибка: Python не установлен или не добавлен в PATH"
  exit 1
fi

message "CHECK" "Проверка pip..."

if ! command -v pip &> /dev/null; then
  message "ERROR" "Ошибка: pip не установлен или не добавлен в PATH"
  exit 1
fi

message "SUCCESS" "Проверка успешно пройдена!"

PYTHON_PATH=$(which python)

message false "> Установка зависимостей"

cd ./src/ || {
  message "ERROR" "Ошибка: не удалось сменить директорию"
  exit 1
}

message false "Дериктория изменена: $(pwd)"

message "INSTALL" "Установка requirements.txt..."
"$PYTHON_PATH" -m pip install -r requirements.txt

if [ $? -eq 0 ]; then
  message "SUCCESS" "Зависимости успешно установлены!"
else
  message "ERROR" "Ошибка при установке зависимостей"
  exit 1
fi

message false "Чтобы запустить Network Scanner, воспользуйтесь командой: cd ./src/ && python run.py"