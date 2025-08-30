from speedtest import Speedtest

def speed_test():
  try:
    st = Speedtest()
    st.get_best_server()
        
    download_speed = st.download() / 1_000_000  
    upload_speed = st.upload() / 1_000_000     
    ping = st.results.ping
        
    return {
      'success': True,
      'download': round(download_speed, 2),
      'upload': round(upload_speed, 2),
      'ping': round(ping, 2),
      'server': st.results.server['name'],
      'bytes_sent': st.results.bytes_sent,
      'bytes_received': st.results.bytes_received
    }
  except Exception as err:
    return {'success': False, 'error': str(err)}