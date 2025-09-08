interface NetworkInfromation {
  ip_info: {
    success: boolean;
		status?: number;
		structure?: {
			ip: string;
			country: string;
			city: string;
			location: string;
			timezone: string;
			hostname: string;
		};
    error?: string;
  };
  ip_threat_info: {
    success: boolean;
		status?: number;
		threat_lvl?: string;
    error?: string;
  };
  cloudflare_availability: {
    [key: string]: {
      success: boolean;
      url: string;
      status?: number;
      time: number;
    };
  };
  youtube_availability: {
    [key: string]: {
      success: boolean;
      url: string;
      status?: number;
      time: number;
    };
  };
  facebook_availability: {
    [key: string]: {
      success: boolean;
      url: string;
      status?: number;
      time: number;
    };
  };
}

interface SpeedtestInfromation {
  speed_info: {
    success: boolean;
    ping: number;
		download: string;
		upload: string;
		country: string;
		server: string;
		host: string;
    error?: string;
  };
}

interface BlacklistsInfromation {
  blacklists_info: {
    [key: string]: {
      success: boolean;
	    blacklist: string;
      code: number;
      listed: boolean;
      status?: number;
    };
  };
}

interface AbuseInfromation {
  ip_abuse_info: {
    success: boolean;
	  is_public: boolean;
	  abuse_confidence: number;
	  total_reports: number;
	  last_reported: string;
	  isp: string;
	  is_tor: boolean;
    error?: string;
  };
}


async function startNetworkScanning() {
  const resultsContainer = document.getElementById('results-container') as HTMLElement;
  resultsContainer.innerHTML = '<p>Сканирование сети...</p>'; 

  try {
    const response = await fetch('http://127.0.0.1:8060/network-scanner/info/ip');
    
    if (!response.ok) {
      resultsContainer.innerHTML = `<p style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }
    
    const data: NetworkInfromation = await response.json();
    
    logNetworkScanning(data);
  } catch (error: any) {
    resultsContainer.innerHTML = `<p style="color: red;">Ошибка сервера: ${error['message']}</p>`;
  }
}

async function startSpeedTest() {
  const resultsContainer = document.getElementById('results-container') as HTMLElement;
  resultsContainer.innerHTML = '<p>Тестирование скорости сети (тест может длиться 40 секунд)...</p>'; 

  try {
    const response = await fetch('http://127.0.0.1:8060/network-scanner/info/speedtest');
    
    if (!response.ok) {
      resultsContainer.innerHTML = `<p style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }
    
    const data: SpeedtestInfromation = await response.json();
    
    logSpeedTest(data);
  } catch (error: any) {
    resultsContainer.innerHTML = `<p style="color: red;">Ошибка сервера: ${error['message']}</p>`;
  }
}

async function startBlacklistsVerification() {
  const resultsContainer = document.getElementById('results-container') as HTMLElement;
  resultsContainer.innerHTML = '<p>Проверка вашего IP в чёрных списках...</p>'; 

  try {
    const response = await fetch('http://127.0.0.1:8060/network-scanner/info/blacklists');
    
    if (!response.ok) {
      resultsContainer.innerHTML = `<p style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }
    
    const data: BlacklistsInfromation = await response.json();
    
    logBlacklistsVerification(data);
  } catch (error: any) {
    resultsContainer.innerHTML = `<p style="color: red;">Ошибка сервера: ${error['message']}</p>`;
  }
}

async function startAbuseScanning() {
  const resultsContainer = document.getElementById('results-container') as HTMLElement;
  resultsContainer.innerHTML = '<p>Abuse-сканирование...</p>'; 

  try {
    const response = await fetch('http://127.0.0.1:8060/network-scanner/info/abuse');
    
    if (!response.ok) {
      resultsContainer.innerHTML = `<p style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }
    
    const data: AbuseInfromation = await response.json();
    
    logAbuseScanning(data);
  } catch (error: any) {
    resultsContainer.innerHTML = `<p style="color: red;">Ошибка сервера: ${error['message']}</p>`;
  }
}


function logNetworkScanning(data: NetworkInfromation): void {
  const container = document.getElementById('results-container') as HTMLElement;
  container.innerHTML = ''; 

  if (!data.ip_info.success) {
    const errorElement = document.createElement('p');
    errorElement.textContent = `Ошибка сканирования сети: ${data.ip_info.error}`;
    errorElement.style.color = 'var(--error)';
    container.appendChild(errorElement);
    return;
  }

  const ipSection = document.createElement('div');
  ipSection.className = 'result-section';
  ipSection.innerHTML = `
    <h3>Информация об IP</h3>
    <div class="result-item"><span class="result-label">IP-адрес:</span> <span class="result-value">${data.ip_info.structure?.['ip'] ?? 'Ошибка'}</span></div>
    <div class="result-item"><span class="result-label">Страна:</span> <span class="result-value">${data.ip_info.structure?.['country'] ?? 'Ошибка'}</span></div>
    <div class="result-item"><span class="result-label">Город:</span> <span class="result-value">${data.ip_info.structure?.['city'] ?? 'Ошибка'}</span></div>
    <div class="result-item"><span class="result-label">Локация:</span> <span class="result-value">${data.ip_info.structure?.['location'] ?? 'Ошибка'}</span></div>
    <div class="result-item"><span class="result-label">Часовой пояс:</span> <span class="result-value">${data.ip_info.structure?.['timezone'] ?? 'Ошибка'}</span></div>
    <div class="result-item"><span class="result-label">Провайдер:</span> <span class="result-value">${data.ip_info.structure?.['hostname'] ?? 'Ошибка'}</span></div>
  `;
  container.appendChild(ipSection);

  
  const threatSection = document.createElement('div');
  threatSection.className = 'result-section';

  let threat_class = 'threat-low';
  
  if (data.ip_threat_info['threat_lvl']) {
    if (data.ip_threat_info['threat_lvl'].toLowerCase().includes('high')) threat_class = 'threat-high';
    if (data.ip_threat_info['threat_lvl'].toLowerCase().includes('medium')) threat_class = 'threat-medium';
  }
    
  threatSection.innerHTML = `
    <h3>Безопасность IP</h3>
    <div class="result-item"><span class="result-label">Уровень угроз:</span> <span class="result-value ${threat_class}">${data.ip_threat_info['threat_lvl']}</span></div>
  `;
  container.appendChild(threatSection);

  
  const cloudflareSection = document.createElement('div');
  cloudflareSection.className = 'result-section';

  let cloudflareContent = '';
  
  cloudflareContent += `
    <div class="service-grid">
      <div class="service-header">URL</div>
      <div class="service-header">Статус</div>
      <div class="service-header">Время</div>
      <div class="service-header">Код</div>
  `;
  
  for (const key in data.cloudflare_availability) {
    const item = data.cloudflare_availability[key];
    
    let statusColor = 'var(--error)';
    let statusText = 'Ошибка';
    
    if (item.success) {
      statusColor = 'var(--success)';
      statusText = 'Успех';
    }
    
    const cloudflareResponseTime = item.time ? `${item.time}мс` : 'N/A';
    
    cloudflareContent += `
      <div class="service-url">${item.url}</div>
      <div class="service-status" style="color: ${statusColor}">${statusText}</div>
      <div class="service-time">${cloudflareResponseTime}</div>
      <div class="service-code">${item.status || 'N/A'}</div>
    `;
  }   
  
  cloudflareContent += '</div>';
  
  cloudflareSection.innerHTML = `
    <h3>Доступность Cloudflare</h3>
    ${cloudflareContent}
  `;
  container.appendChild(cloudflareSection);

  const youtubeSection = document.createElement('div');
  youtubeSection.className = 'result-section';

  let youtubeContent = '';
  
  youtubeContent += `
    <div class="service-grid">
      <div class="service-header">URL</div>
      <div class="service-header">Статус</div>
      <div class="service-header">Время</div>
      <div class="service-header">Код</div>
  `;
  
  for (const key in data.youtube_availability) {
    const item = data.youtube_availability[key];
    
    let statusColor = 'var(--error)';
    let statusText = 'Ошибка';
    
    if (item.success) {
      statusColor = 'var(--success)';
      statusText = 'Успех';
    }
    
    const youtubeResponseTime = item.time ? `${item.time}мс` : 'N/A';
    
    youtubeContent += `
      <div class="service-url">${item.url}</div>
      <div class="service-status" style="color: ${statusColor}">${statusText}</div>
      <div class="service-time">${youtubeResponseTime}</div>
      <div class="service-code">${item.status || 'N/A'}</div>
    `;
  }   
  
  youtubeContent += '</div>';
  
  youtubeSection.innerHTML = `
    <h3>Доступность YouTube</h3>
    ${youtubeContent}
  `;
  container.appendChild(youtubeSection);

  const facebookSection = document.createElement('div');
  facebookSection.className = 'result-section';

  let facebookContent = '';
  
  facebookContent += `
    <div class="service-grid">
      <div class="service-header">URL</div>
      <div class="service-header">Статус</div>
      <div class="service-header">Время</div>
      <div class="service-header">Код</div>
  `;
  
  for (const key in data.facebook_availability) {
    const item = data.facebook_availability[key];
    
    let statusColor = 'var(--error)';
    let statusText = 'Ошибка';
    
    if (item.success) {
      statusColor = 'var(--success)';
      statusText = 'Успех';
    }
    
    const facebookResponseTime = item.time ? `${item.time}мс` : 'N/A';
    
    facebookContent += `
      <div class="service-url">${item.url}</div>
      <div class="service-status" style="color: ${statusColor}">${statusText}</div>
      <div class="service-time">${facebookResponseTime}</div>
      <div class="service-code">${item.status || 'N/A'}</div>
    `;
  }   
  
  facebookContent += '</div>';
  
  facebookSection.innerHTML = `
    <h3>Доступность Facebook</h3>
    ${facebookContent}
  `;
  container.appendChild(facebookSection);
}


function logSpeedTest(data: SpeedtestInfromation): void {
  const container = document.getElementById('results-container') as HTMLElement;
  container.innerHTML = ''; 

  if (!data.speed_info.success) {
    const errorElement = document.createElement('p');
    errorElement.textContent = `Ошибка теста скорости: ${data.speed_info.error}`;
    errorElement.style.color = 'var(--error)';
    container.appendChild(errorElement);
    return;
  }

  const speedSection = document.createElement('div');
  speedSection.className = 'result-section';
  speedSection.innerHTML = `
    <h3>Скорость</h3>
    <div class="result-item"><span class="result-label">Скачивание:</span> <span class="result-value">${(Number(data.speed_info['download']) / 1000000).toFixed(1)} Мбит/с</span></div>
    <div class="result-item"><span class="result-label">Загрузка:</span> <span class="result-value">${(Number(data.speed_info['upload']) / 1000000).toFixed(1)} Мбит/с</span></div>
    <div class="result-item"><span class="result-label">Пинг:</span> <span class="result-value">${Number(data.speed_info['ping']).toFixed(1)}мс</span></div>
  `;
  container.appendChild(speedSection);

  const serverSection = document.createElement('div');
  serverSection.className = 'result-section';
  serverSection.innerHTML = `
    <h3>Информация о сервере</h3>
    <div class="result-item"><span class="result-label">Страна:</span> <span class="result-value">${data.speed_info['country']}</span></div>
    <div class="result-item"><span class="result-label">Сервер:</span> <span class="result-value">${data.speed_info['server']}</span></div>
    <div class="result-item"><span class="result-label">Хост:</span> <span class="result-value">${data.speed_info['host']}</span></div>
  `;
  container.appendChild(serverSection);
}


function logBlacklistsVerification(data: BlacklistsInfromation): void {
  const container = document.getElementById('results-container') as HTMLElement;
  container.innerHTML = ''; 

  const blacklistsSection = document.createElement('div');
  blacklistsSection.className = 'result-section';
    
  let content = `
    <h3>Проверка IP в чёрных списках</h3>
    <div class="blacklists-grid">
      <div class="blacklist-header">Список</div>
      <div class="blacklist-header">Статус</div>
      <div class="blacklist-header">Результат</div>
  `;


  for (const key in data.blacklists_info) {
    const item = data.blacklists_info[key];
    
    const statusColor = item.success ? 'var(--success)' : 'var(--error)';
    const statusText = item.success ? 'Успех' : 'Ошибка';

    const resultColor = item.listed ? 'var(--error)' : 'var(--success)';

    content += `
      <div class="blacklist-name">${item.blacklist}</div>
      <div class="blacklist-status" style="color: ${statusColor}">${statusText} (${item.status})</div>
      <div class="blacklist-result" style="color: ${resultColor}">${item.success ? (item.listed ? 'Обнаружен' : 'Не обнаружен') : 'Ошибка'}</div>
    `;
  }

  content += '</div>';

  blacklistsSection.innerHTML = content;
  container.appendChild(blacklistsSection);
}


function logAbuseScanning(data: AbuseInfromation): void {
  const container = document.getElementById('results-container') as HTMLElement;
  container.innerHTML = ''; 

  if (!data.ip_abuse_info.success) {
    const errorElement = document.createElement('p');
    errorElement.textContent = `Ошибка abuse-сканирования: ${data.ip_abuse_info.error}`;
    errorElement.style.color = 'var(--error)';
    container.appendChild(errorElement);
    return;
  }

  const abuseSection = document.createElement('div');
  abuseSection.className = 'result-section';
  abuseSection.innerHTML = `
    <h3>Злоупотребление вашего IP</h3>
    <div class="result-item"><span class="result-label">Публичный IP:</span> <span class="result-value">${data.ip_abuse_info.is_public ? 'Да' : 'Нет'}</span></div>
    <div class="result-item"><span class="result-label">Всего злоупотреблений:</span> <span class="result-value">${data.ip_abuse_info.abuse_confidence}</span></div>
  `;
  container.appendChild(abuseSection);

  const reportsSection = document.createElement('div');
  reportsSection.className = 'result-section';
  reportsSection.innerHTML = `
    <h3>Жалобы на IP</h3>
    <div class="result-item"><span class="result-label">Всего жалоб:</span> <span class="result-value">${data.ip_abuse_info.total_reports}</span></div>
    <div class="result-item"><span class="result-label">Последняя жалоба:</span> <span class="result-value">${data.ip_abuse_info.abuse_confidence ? data.ip_abuse_info.abuse_confidence : 'Нету сведений'}</span></div>
  `;
  container.appendChild(reportsSection);

  const otherSection = document.createElement('div');
  otherSection.className = 'result-section';
  otherSection.innerHTML = `
    <h3>Прочее</h3>
    <div class="result-item"><span class="result-label">Tor:</span> <span class="result-value">${data.ip_abuse_info.is_tor ? 'Используется' : 'Не используется'}</span></div>
    <div class="result-item"><span class="result-label">ISP:</span> <span class="result-value">${data.ip_abuse_info.isp}</span></div>
  `;
  container.appendChild(otherSection);
}