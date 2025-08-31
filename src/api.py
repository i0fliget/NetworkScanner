import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scan_ip import get_ip_info, scan_ip_on_threats, check_cloudflare_availability, check_youtube_availability
from scan_speed import speed_test
from scan_blacklists import check_ip_in_blacklists


app = FastAPI()

ip_info = {}

app.add_middleware(
  CORSMiddleware,
  allow_origins=['*'],
  allow_methods=['*'],
  allow_headers=['*'],
)


@app.get('/api/scanner/update')
async def update_data():
  try:
    global ip_info 
    ip_info = await get_ip_info()

    return ip_info
  except Exception as err:
    ip_info = {'error': str(err)}

@app.get('/api/scanner/network')
async def api_scanner_network():
  try:
    global ip_info 

    if 'ip' not in ip_info:
      ip_info = await get_ip_info()

    security_info, cloudflare_info, youtube_info = await asyncio.gather(
      scan_ip_on_threats(ip_info['ip']),
      check_cloudflare_availability(),
      check_youtube_availability()
    )

    return {
      'ip': ip_info['ip'], 
      'ip_info': ip_info, 
      'security_lvl': security_info['security_lvl'] if security_info['success'] else security_info['error'],
      'cloudflare':  cloudflare_info,
      'youtube': youtube_info
    } 
  except Exception as err:
    return {'error': str(err)}
  
@app.get('/api/scanner/speedtest')
async def api_scanner_speedtest():
  try:
    speedtest_info = speed_test()

    return speedtest_info
  except Exception as err:
    return {'error': str(err)}
  
@app.get('/api/scanner/blacklists')
async def api_check_blacklists():
  try:
    global ip_info 

    if 'ip' not in ip_info:
      ip_info = await get_ip_info()

    blacklists_info = check_ip_in_blacklists(ip_info['ip'])

    return blacklists_info
  except Exception as err:
    return {'error': str(err)}