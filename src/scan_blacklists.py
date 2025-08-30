import requests

def check_ip_in_blacklists(ip):
  blacklists = [
    'zen.spamhaus.org',   
    'bl.spamcop.net',
    'dnsbl.sorbs.net',
    'b.barracudacentral.org',
    'psbl.surriel.com',          
    'db.wpbl.info',  
    'dnsbl.dronebl.org', 
    'rbl.efnetrbl.org',    
    'all.s5h.net',        
    'bl.emailbasura.org',      
    'dnsbl.inps.de',          
    'spam.dnsbl.sorbs.net',     
    'dul.dnsbl.sorbs.net',   
    'rbl.mailru.net', 
    'rbl.iprange.net', 
    'dnsbl.inps.de',
    'bl.spamhaus.org',
    'bl.njabl.org'
  ]
    
  results = {}
  index = 0
    
  for blacklist in blacklists:
    index += 1
    
    try:
      response = requests.get(f'https://dns.google/resolve?name={ip}.{blacklist}&type=A', timeout=8)
      data = response.json()
            
      code = data['Status']

      is_listed = True if int(code) == 0 else False

      results[index] = {
        'success': True,
        'blacklist': blacklist,
        'listed': is_listed,
      }
            
    except Exception as err:
      results[index] = {
        'success': False,
        'listed': False,
        'blacklist': blacklist,
        'error': f'{err}'
      }
    
  return results