@echo off
chcp 65001 >nul

setlocal enabledelayedexpansion

:message
if "%1"=="false" (
  echo [ INFO ]: %~2
) else (
  echo [ INFO ~ %~1 ]: %~2
)
exit /b 0

call :message false "> Проверка требований"

call :message CHECK "Проверка Python..."
python --version >nul 2>&1
if errorlevel 1 (
  call :message ERROR "Ошибка: Python не установлен или не добавлен в PATH"
  pause
  exit /b 1
)

call :message CHECK "Проверка pip..."
pip --version >nul 2>&1
if errorlevel 1 (
  call :message ERROR "Ошибка: pip не установлен или не добавлен в PATH"
  pause
  exit /b 1
)

call :message SUCCESS "Проверка успешно пройдена!"

for /f "delims=" %%i in ('where python') do set PYTHON_PATH=%%i

call :message false "> Установка зависимостей"

cd src
if errorlevel 1 (
  call :message ERROR "Ошибка: не удалось сменить директорию"
  pause
  exit /b 1
)

call :message false "Директория изменена: %CD%"

call :message INSTALL "Установка requirements.txt..."
"%PYTHON_PATH%" -m pip install -r requirements.txt

if errorlevel 1 (
  call :message ERROR "Ошибка при установке зависимостей"
  pause
  exit /b 1
) else (
  call :message SUCCESS "Зависимости успешно установлены!"
)

call :message false "Чтобы запустить Network Scanner, воспользуйтесь командой: cd ./src/ && python run.py"

pause