import os
import sys
import subprocess
import webbrowser
import platform
import time
from pathlib import Path

def logging(log_prefix, text):
  print(f'[ INFO{f' ~ {log_prefix}' if log_prefix else ''} ]: {text}')

def run_command(command):
  logging('EXECUTE', f'Выполняется "{command}"...')

  try:
    output = subprocess.run(command, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return True
  except Exception as err:
    logging('ERROR', f'Произошла ошибка при выполнении "{command}": {err}')
    return False

def check_requirements():
  try:
    subprocess.run([sys.executable, '--version'], check=True, capture_output=True)
    subprocess.run([sys.executable, '-m', 'pip', '--version'], check=True, capture_output=True)
    return True
  except Exception as err:
    logging('ERROR', f'Ошибка проверки Python и pip: {err}')
    return False

def main():
  logging(False, 'Автоматическая установка зависимостей и запуск сканера сети...')
    
  if not check_requirements():
    sys.exit(1)
    
  current_dir = Path(__file__).parent
  site_dir = current_dir / 'site' / 'index.html'
  requirements_file = current_dir / 'requirements.txt'
    
  if not requirements_file.exists():
    logging('ERROR', 'Файл requirements.txt не найден.')
    sys.exit(1)
  
  logging('INSTALL', 'Установка зависимостей...')

  if not run_command(f'pip install -r {requirements_file}'):
    sys.exit(1)
    
  logging('SERVER', 'Запуск сервера...')

  try:
    if platform.system() == 'Windows':
      server_process = subprocess.Popen(['cmd', '/k', f'cd /d {current_dir} && 'f'uvicorn api:app --reload'], creationflags=subprocess.CREATE_NEW_CONSOLE)
    else:
      server_process = subprocess.Popen(['uvicorn', 'api:app', '--reload'], cwd=current_dir, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, preexec_fn=os.setsid)
      
    time.sleep(3)

    logging('SERVER', 'Сервер успешно запущен.')
        
    logging('OPEN', 'Открытие браузера...')
    webbrowser.open(f'file://{site_dir.absolute()}')
        
    logging('SUCCESS', 'Сканер сети успешно запущен.')
    logging(False, f'Адрес веб-интерфейса: file://{site_dir.absolute()}')
    logging(False, f'Адрес API (сканирование сети): http://127.0.0.1:8000/api/scanner/network')
    logging(False, f'Адрес API (тест скорости): http://127.0.0.1:8000/api/scanner/speedtest')
    logging(False, f'Адрес API (проверка чёрных листов): http://127.0.0.1:8000/api/scanner/blacklists')
    logging(False, 'Чтобы остановить сканер нажмите Ctrl + C.')
        
    server_process.wait()
        
  except KeyboardInterrupt:
    logging('STOP', 'Остановка сервера...')
    server_process.terminate()
  except Exception as err:
    logging('ERROR', f'Ошибка запуска: {err}')
    sys.exit(1)

if __name__ == '__main__':
  main()