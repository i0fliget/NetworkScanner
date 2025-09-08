package utilities

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/joho/godotenv"
)

func init() {
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		return
	}

	currentDir := filepath.Dir(filename)
	envPath := filepath.Join(currentDir, ".env")

	godotenv.Load(envPath)
}

/*
Функция для получения информации с https://www.abuseipdb.com/

Для корректной работы функции необходимо:

1. Зарегистрироваться на платформе https://www.abuseipdb.com/ с тарифом FREE

2. Создать API ключ и скопировать его

3. Вставить его в NetworkScanner/main/utilities/.env

Пример: ABUSEIPDB_API_KEY=08fsg5335dcqwd4t9aa8f3c78
*/
func GetIpAbuseInfo(ip string) map[string]interface{} {
	apiKey := os.Getenv("ABUSEIPDB_API_KEY")

	if apiKey == "" {
		return map[string]interface{}{
			"success": false,
			"error":   "API key for abuseipdb.com not found",
		}
	}

	url := "https://api.abuseipdb.com/api/v2/check?ipAddress=" + ip + "&maxAgeInDays=90"

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
		}
	}

	req.Header.Set("Key", apiKey)
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}

	resp, err := client.Do(req)

	if err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
		}
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return map[string]interface{}{
			"success": false,
			"error":   "Invalid response code",
			"status":  resp.StatusCode,
		}
	}

	var result struct {
		Data struct {
			IsPublic             bool   `json:"isPublic"`
			AbuseConfidenceScore int    `json:"abuseConfidenceScore"`
			TotalReports         int    `json:"totalReports"`
			LastReportedAt       string `json:"lastReportedAt"`
			ISP                  string `json:"isp"`
			IsTor                bool   `json:"isTor"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
			"status":  resp.StatusCode,
		}
	}

	return map[string]interface{}{
		"success":          true,
		"is_public":        result.Data.IsPublic,
		"abuse_confidence": result.Data.AbuseConfidenceScore,
		"total_reports":    result.Data.TotalReports,
		"last_reported":    result.Data.LastReportedAt,
		"isp":              result.Data.ISP,
		"is_tor":           result.Data.IsTor,
	}
}
