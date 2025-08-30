import requests
import random
import time
from bs4 import BeautifulSoup



user_agents = [
  'Mozilla/5.0 (Linux; Linux i662 ) Gecko/20100101 Firefox/60.9',
  'Mozilla/5.0 (Android; Android 4.4.1; LG-E987 Build/KOT49I) AppleWebKit/601.16 (KHTML, like Gecko)  Chrome/50.0.2033.394 Mobile Safari/600.8',
  'Mozilla/5.0 (Windows; Windows NT 6.2; x64; en-US) Gecko/20100101 Firefox/66.4',
  'Mozilla/5.0 (Windows NT 10.1; Win64; x64) AppleWebKit/536.26 (KHTML, like Gecko) Chrome/49.0.3506.316 Safari/600.2 Edge/12.97488',
  'Mozilla/5.0 (Windows NT 10.0; WOW64; en-US) AppleWebKit/600.17 (KHTML, like Gecko) Chrome/47.0.1840.300 Safari/534.0 Edge/15.20952',
  'Mozilla/5.0 (Linux; U; Linux x86_64; en-US) AppleWebKit/536.19 (KHTML, like Gecko) Chrome/55.0.2644.147 Safari/536'
]


def get_ip_info():
  try:
    response = requests.get('https://ipinfo.io/json', headers={'User-Agent': random.choice(user_agents)})
    response.raise_for_status()

    return response.json()
  except Exception as err:
    return str(err)


def scan_ip_on_threats(ip):
  try:
    response = requests.get(f'https://db-ip.com/{ip}', headers={'User-Agent': random.choice(user_agents)})
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'lxml')

    data = soup.find('div', {'class': 'row justify-content-between'}).find('div', {'class': 'col-lg-6 col-md-6'})
    security_lvl = data.find('span', {'class': 'label badge-success'}).get_text(strip=True)

    return {'success': True, 'ip': ip, 'lvl': security_lvl}
  except Exception as err:
    return {'success': False, 'error': str(err)}


def check_cloudflare_availability():
  urls = [
    'https://www.cloudflare.com',
    'https://1.1.1.1',
    'https://dash.cloudflare.com',
    'https://developers.cloudflare.com'
  ]
    
  results = {}
  index = 0
    
  for url in urls:
    index += 1

    try:
      start_time = time.time()
      response = requests.get(url, headers={'User-Agent': random.choice(user_agents)}, timeout=10)
      end_time = time.time()
            
      results[index] = {
        'url': url,
        'success': True if response.status_code == 200 else False,
        'status_code': response.status_code,
        'response_time': str(round((end_time - start_time) * 1000, 2)).split('.')[0],
      }
            
    except requests.exceptions.RequestException as err:
      results[index] = {
        'url': url,
        'success': False,
        'error': str(err),
      }
    
  return results


def check_youtube_availability():
  urls = [
    'https://www.youtube.com/',
    'https://music.youtube.com/'
  ]
    
  results = {}
  index = 0
    
  for url in urls:
    index += 1

    try:
      start_time = time.time()
      response = requests.get(url, headers={'User-Agent': random.choice(user_agents)}, timeout=10)
      end_time = time.time()
            
      results[index] = {
        'url': url,
        'success': True if response.status_code == 200 else False,
        'status_code': response.status_code,
        'response_time': str(round((end_time - start_time) * 1000, 2)).split('.')[0],
      }
            
    except requests.exceptions.RequestException as err:
      results[index] = {
        'url': url,
        'success': False,
        'error': str(err),
      }
    
  return results

  