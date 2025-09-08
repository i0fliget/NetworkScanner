package utilities

// Импорт пакетов
import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// Функция для получения информации об IP с https://ipinfo.io/json
func GetIpInfo() map[string]interface{} {
	type Temple struct {
		IP       string `json:"ip"`
		City     string `json:"city"`
		Country  string `json:"country"`
		Hostname string `json:"org"`
		Timezone string `json:"timezone"`
		Location string `json:"loc"`
	}

	resp, err := http.Get("https://ipinfo.io/json")

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

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
			"status":  resp.StatusCode,
		}
	}

	var temple Temple
	err = json.Unmarshal(body, &temple)
	if err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
			"status":  resp.StatusCode,
		}
	}

	return map[string]interface{}{
		"success": true,
		"status":  resp.StatusCode,
		"structure": map[string]interface{}{
			"ip":       temple.IP,
			"country":  temple.Country,
			"city":     temple.City,
			"location": temple.Location,
			"timezone": temple.Timezone,
			"hostname": temple.Hostname,
		},
	}
}

// Функция для получения уровня угрозы у IP с https://db-ip.com/
func GetIpThreatLvl(ip string) map[string]interface{} {
	resp, err := http.Get("https://db-ip.com/" + ip)

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

	doc, err := goquery.NewDocumentFromReader(resp.Body)

	if err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
			"status":  resp.StatusCode,
		}
	}

	threatLvl := doc.Find(".label.badge-success").Text()

	return map[string]interface{}{
		"success":    true,
		"status":     resp.StatusCode,
		"threat_lvl": threatLvl,
	}
}

// Функция для проверки доступности сервисов Cloudflare
func CheckCloudflareAvailability() map[string]interface{} {
	urls := []string{
		"https://cloudflare.com/",
		"https://radar.cloudflare.com/",
		"https://dash.cloudflare.com/",
		"https://1.1.1.1/",
	}

	results := make(map[string]interface{})

	var wg sync.WaitGroup
	var mu sync.Mutex

	for i, url := range urls {
		wg.Add(1)

		go func(index int, u string) {
			defer wg.Done()

			start := time.Now()
			client := &http.Client{Timeout: 4 * time.Second}
			resp, err := client.Get(u)
			elapsed := time.Since(start)

			result := map[string]interface{}{
				"url":  u,
				"time": elapsed.Milliseconds(),
			}

			if err != nil {
				result["success"] = false
				result["error"] = err.Error()
			} else {
				defer resp.Body.Close()
				result["success"] = resp.StatusCode == http.StatusOK
				result["status"] = resp.StatusCode
			}

			mu.Lock()
			results[strconv.Itoa(index)] = result
			mu.Unlock()
		}(i, url)
	}

	wg.Wait()

	return results
}

// Функция для проверки доступности сервисов YouTube
func CheckYouTubeAvailability() map[string]interface{} {
	urls := []string{
		"https://youtube.com/",
		"https://music.youtube.com/",
	}

	results := make(map[string]interface{})

	var wg sync.WaitGroup
	var mu sync.Mutex

	for i, url := range urls {
		wg.Add(1)

		go func(index int, u string) {
			defer wg.Done()

			start := time.Now()
			client := &http.Client{Timeout: 4 * time.Second}
			resp, err := client.Get(u)
			elapsed := time.Since(start)

			result := map[string]interface{}{
				"url":  u,
				"time": elapsed.Milliseconds(),
			}

			if err != nil {
				result["success"] = false
				result["error"] = err.Error()
			} else {
				defer resp.Body.Close()
				result["success"] = resp.StatusCode == http.StatusOK
				result["status"] = resp.StatusCode
			}

			mu.Lock()
			results[strconv.Itoa(index)] = result
			mu.Unlock()
		}(i, url)
	}

	wg.Wait()

	return results
}

// Функция для проверки доступности сервисов Facebook
func CheckFacebookAvailability() map[string]interface{} {
	urls := []string{
		"https://www.facebook.com/",
		"https://lite.facebook.com/",
		"https://developers.facebook.com/",
	}

	results := make(map[string]interface{})

	var wg sync.WaitGroup
	var mu sync.Mutex

	for i, url := range urls {
		wg.Add(1)

		go func(index int, u string) {
			defer wg.Done()

			start := time.Now()
			client := &http.Client{Timeout: 4 * time.Second}
			resp, err := client.Get(u)
			elapsed := time.Since(start)

			result := map[string]interface{}{
				"url":  u,
				"time": elapsed.Milliseconds(),
			}

			if err != nil {
				result["success"] = false
				result["error"] = err.Error()
			} else {
				defer resp.Body.Close()
				result["success"] = resp.StatusCode == http.StatusOK
				result["status"] = resp.StatusCode
			}

			mu.Lock()
			results[strconv.Itoa(index)] = result
			mu.Unlock()
		}(i, url)
	}

	wg.Wait()

	return results
}
