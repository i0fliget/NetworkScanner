async function set_scanner_data() {
  const save_data_container = document.getElementById('save-data-section');
  save_data_container.innerHTML = ''; 

  try {
    const response = await fetch('http://127.0.0.1:8000/api/scanner/update');
    
    if (!response.ok) {
      save_data_container.innerHTML = `<p class="save-data-text" style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }

    data = await response.json()
    
    save_data_container.innerHTML = `<p class="save-data-text">Сохранённый IP: ${data.ip}</p>`
  } catch (error) {
    save_data_container.innerHTML = `<p class="save-data-text" style="color: red;">Ошибка API: ${error['message']}</p>`;
  }
}

async function update_data() {
  const results_container = document.getElementById('results-container');
  const save_data_container = document.getElementById('save-data-section');

  results_container.innerHTML = '<p>Обновление данных...</p>'; 

  try {
    const response = await fetch('http://127.0.0.1:8000/api/scanner/update');
    
    if (!response.ok) {
      results_container.innerHTML = `<p style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }

    data = await response.json()
    
    save_data_container.innerHTML = `<p class="save-data-text">Сохранённый IP: ${data.ip}</p>`
    results_container.innerHTML = '<p>Просканируйте сеть и получите результаты.</p>'
  } catch (error) {
    results_container.innerHTML = `<p style="color: red;">Ошибка API: ${error['message']}</p>`;
  }
}

async function start_scan_network() {
  const results_container = document.getElementById('results-container');
  results_container.innerHTML = '<p>Сканирование сети...</p>'; 

  try {
    const response = await fetch('http://127.0.0.1:8000/api/scanner/network');
    
    if (!response.ok) {
      results_container.innerHTML = `<p style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }
    
    const data = await response.json();
    
    logging_scan_network(data);
  } catch (error) {
    results_container.innerHTML = `<p style="color: red;">Ошибка API: ${error['message']}</p>`;
  }
}

async function start_speed_test() {
  const results_container = document.getElementById('results-container');
  results_container.innerHTML = '<p>Тестирование скорости сети (тест может длиться 40 секунд)...</p>'; 

  try {
    const response = await fetch('http://127.0.0.1:8000/api/scanner/speedtest');
    
    if (!response.ok) {
      results_container.innerHTML = `<p style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }
    
    const data = await response.json();
    
    logging_speed_test(data);
  } catch (error) {
    results_container.innerHTML = `<p style="color: red;">Ошибка API: ${error['message']}</p>`;
  }
}

async function start_check_blacklists() {
  const results_container = document.getElementById('results-container');
  results_container.innerHTML = '<p>Проверка вашего IP в чёрных списках...</p>'; 

  try {
    const response = await fetch('http://127.0.0.1:8000/api/scanner/blacklists');
    
    if (!response.ok) {
      results_container.innerHTML = `<p style="color: red;">Ошибка HTTP: ${response['status']}</p>`; 
      return;
    }
    
    const data = await response.json();
    
    logging_check_blacklists(data);
  } catch (error) {
    results_container.innerHTML = `<p style="color: red;">Ошибка API: ${error['message']}</p>`;
  }
}

function logging_scan_network(data) {
  const container = document.getElementById('results-container');
  container.innerHTML = ''; 

  if (data.error) {
    const error_el = document.createElement('p');
    error_el.textContent = `Ошибка сканирования сети: ${data.error}`;
    error_el.style.color = 'var(--error)';
    container.appendChild(error_el);
    return;
  }

  const ip_section = document.createElement('div');
  ip_section.className = 'result-section';
  ip_section.innerHTML = `
    <h3>Информация об IP</h3>
    <div class="result-item"><span class="result-label">IP-адрес:</span> <span class="result-value">${data['ip']}</span></div>
    <div class="result-item"><span class="result-label">Страна:</span> <span class="result-value">${data.ip_info['country']}</span></div>
    <div class="result-item"><span class="result-label">Город:</span> <span class="result-value">${data.ip_info['city']}</span></div>
    <div class="result-item"><span class="result-label">Провайдер:</span> <span class="result-value">${data.ip_info['org']}</span></div>
  `;
  container.appendChild(ip_section);

  const security_section = document.createElement('div');
  security_section.className = 'result-section';

  let security_class = 'security-low';
  if (data.security_lvl.toLowerCase().includes('high')) security_class = 'security-high';
  if (data.security_lvl.toLowerCase().includes('medium')) security_class = 'security-medium';
    
  security_section.innerHTML = `
    <h3>Безопасность IP</h3>
    <div class="result-item"><span class="result-label">Уровень угроз:</span> <span class="result-value ${security_class}">${data['security_lvl']}</span></div>
  `;
  container.appendChild(security_section);

  const cloudflare_section = document.createElement('div');
  cloudflare_section.className = 'result-section';

  let cloudflare_content = '';
  
  cloudflare_content += `
    <div class="service-grid">
      <div class="service-header">URL</div>
      <div class="service-header">Статус</div>
      <div class="service-header">Время</div>
      <div class="service-header">Код</div>
  `;
  
  for (const key in data.cloudflare) {
    const item = data.cloudflare[key];
    
    let status_color = 'var(--error)';
    let status_text = 'Ошибка';
    
    if (item.success) {
      status_color = 'var(--success)';
      status_text = 'Успех';
    }
    
    const cloudflare_response_time = item.response_time ? `${item.response_time}мс` : 'N/A';
    
    cloudflare_content += `
      <div class="service-url">${item.url}</div>
      <div class="service-status" style="color: ${status_color}">${status_text}</div>
      <div class="service-time">${cloudflare_response_time}</div>
      <div class="service-code">${item.status_code || 'N/A'}</div>
    `;
  }   
  
  cloudflare_content += '</div>';
  
  cloudflare_section.innerHTML = `
    <h3>Доступность Cloudflare</h3>
    ${cloudflare_content}
  `;
  container.appendChild(cloudflare_section);

  const youtube_section = document.createElement('div');
  youtube_section.className = 'result-section';

  let youtube_content = '';
  
  youtube_content += `
    <div class="service-grid">
      <div class="service-header">URL</div>
      <div class="service-header">Статус</div>
      <div class="service-header">Время</div>
      <div class="service-header">Код</div>
  `;
  
  for (const key in data.youtube) {
    const item = data.youtube[key];
    
    let status_color = 'var(--error)';
    let status_text = 'Ошибка';
    
    if (item.success) {
      status_color = 'var(--success)';
      status_text = 'Успех';
    }
    
    const youtube_response_time = item.response_time ? `${item.response_time}мс` : 'N/A';
    
    youtube_content += `
      <div class="service-url">${item.url}</div>
      <div class="service-status" style="color: ${status_color}">${status_text}</div>
      <div class="service-time">${youtube_response_time}</div>
      <div class="service-code">${item.status_code || 'N/A'}</div>
    `;
  }   
  
  youtube_content += '</div>';
  
  youtube_section.innerHTML = `
    <h3>Доступность YouTube</h3>
    ${youtube_content}
  `;
  container.appendChild(youtube_section);
}

function logging_speed_test(data) {
  const container = document.getElementById('results-container');
  container.innerHTML = ''; 

  if (data.error) {
    const error_el = document.createElement('p');
    error_el.textContent = `Ошибка теста скорости: ${data.error}`;
    error_el.style.color = 'var(--error)';
    container.appendChild(error_el);
    return;
  }

  const speed_section = document.createElement('div');
  speed_section.className = 'result-section';
  speed_section.innerHTML = `
    <h3>Скорость</h3>
    <div class="result-item"><span class="result-label">Скачивание:</span> <span class="result-value">${data.download} Мбит/с</span></div>
    <div class="result-item"><span class="result-label">Загрузка:</span> <span class="result-value">${data.upload} Мбит/с</span></div>
    <div class="result-item"><span class="result-label">Пинг:</span> <span class="result-value">${data.ping}мс</span></div>
  `;
  container.appendChild(speed_section);

  const server_section = document.createElement('div');
  server_section.className = 'result-section';
  server_section.innerHTML = `
    <h3>Сервер</h3>
    <div class="result-item"><span class="result-label">Сервер:</span> <span class="result-value">${data.server}</span></div>
  `;
  container.appendChild(server_section);

  const other_section = document.createElement('div');
  other_section.className = 'result-section';
  other_section.innerHTML = `
    <h3>Отправлено/Получено байт</h3>
    <div class="result-item"><span class="result-label">Отправлено:</span> <span class="result-value">${data.bytes_sent} байт</span></div>
    <div class="result-item"><span class="result-label">Получено:</span> <span class="result-value">${data.bytes_received} байт</span></div>
  `;
  container.appendChild(other_section);
}

function logging_check_blacklists(data) {
  const container = document.getElementById('results-container');
  container.innerHTML = ''; 

  if (data.error) {
    const error_el = document.createElement('p');
    error_el.textContent = `Ошибка проверки чёрных листов: ${data.error}`;
    error_el.style.color = 'var(--error)';
    container.appendChild(error_el);
    return;
  }

  const blacklists_section = document.createElement('div');
  blacklists_section.className = 'result-section';
    
  let content = `
    <h3>Проверка IP в чёрных списках</h3>
    <div class="blacklists-grid">
      <div class="blacklist-header">Список</div>
      <div class="blacklist-header">Статус</div>
      <div class="blacklist-header">Результат</div>
  `;


  for (const key in data) {
    const item = data[key];
    
    const status_color = item.success ? 'var(--success)' : 'var(--error)';
    const status_text = item.success ? 'Успех' : 'Ошибка';

    const result_color = item.listed ? 'var(--error)' : 'var(--success)';

    content += `
      <div class="blacklist-name">${item.blacklist}</div>
      <div class="blacklist-status" style="color: ${status_color}">${status_text}</div>
      <div class="blacklist-result" style="color: ${result_color}">${item.success ? (item.listed ? 'Обнаружен' : 'Не обнаружен') : 'Ошибка'}</div>
    `;
  }

  content += '</div>';

  blacklists_section.innerHTML = content;
  container.appendChild(blacklists_section);
}


set_scanner_data()