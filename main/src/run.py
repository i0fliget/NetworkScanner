import os
import sys
import subprocess
import webbrowser
import platform
import time
from pathlib import Path


def message(log_prefix, text):
  print(f'[ INFO{f' ~ {log_prefix}' if log_prefix else ''} ]: {text}')


def main():
  message(False, 'Запуск Network Scanner...')
    
  current_dir = Path(__file__).parent
  site_dir = current_dir / 'site' / 'index.html'
    
  message('SERVER', 'Запуск сервера...')

  try:
    if platform.system() == 'Windows':
      server_process = subprocess.Popen(['cmd', '/k', f'cd /d {current_dir} && 'f'uvicorn server:app --reload'], creationflags=subprocess.CREATE_NEW_CONSOLE)
    else:
      server_process = subprocess.Popen(['uvicorn', f'server:app', '--reload'], cwd=current_dir, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, preexec_fn=os.setsid)
      
    time.sleep(3)

    message('SERVER', 'Сервер успешно запущен.')
        
    message('OPEN', 'Открытие браузера...')
    webbrowser.open(f'file://{site_dir.absolute()}')
        
    message('SUCCESS', 'Сканер сети успешно запущен.')
    message(False, f'Адрес веб-интерфейса: file://{site_dir.absolute()}')
    message(False, f'Адрес API (сканирование сети): http://127.0.0.1:8000/api/scanner/network')
    message(False, f'Адрес API (тест скорости): http://127.0.0.1:8000/api/scanner/speedtest')
    message(False, f'Адрес API (проверка чёрных листов): http://127.0.0.1:8000/api/scanner/blacklists')
    message(False, 'Чтобы остановить сканер нажмите Ctrl + C.')
        
    server_process.wait()
        
  except KeyboardInterrupt:
    message('STOP', 'Остановка сервера...')
    server_process.terminate()
  except Exception as err:
    message('ERROR', f'Ошибка запуска: {err}')
    sys.exit(1)


if __name__ == '__main__':
  main()