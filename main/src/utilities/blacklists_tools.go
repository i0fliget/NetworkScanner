package utilities

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"sync"
)

func CheckBlacklists(ip string) map[string]interface{} {
	blacklists := []string{
		"zen.spamhaus.org",
		"bl.spamcop.net",
		"dnsbl.sorbs.net",
		"b.barracudacentral.org",
		"psbl.surriel.com",
		"db.wpbl.info",
		"dnsbl.dronebl.org",
		"rbl.efnetrbl.org",
		"all.s5h.net",
		"bl.emailbasura.org",
		"dnsbl.inps.de",
		"spam.dnsbl.sorbs.net",
		"dul.dnsbl.sorbs.net",
		"rbl.mailru.net",
		"rbl.iprange.net",
		"dnsbl.inps.de",
		"bl.spamhaus.org",
		"bl.njabl.org",
	}

	results := make(map[string]interface{})

	var wg sync.WaitGroup
	var mu sync.Mutex

	for i, list := range blacklists {
		wg.Add(1)

		go func(index int, ip string, list string) {
			defer wg.Done()

			url := "https://dns.google/resolve?name=" + ip + "." + list + "&type=A"

			resp, err := http.Get(url)

			result := map[string]interface{}{
				"blacklist": list,
				"listed":    false,
			}

			if err != nil {
				result["success"] = false
				result["error"] = err.Error()
			} else {
				defer resp.Body.Close()

				if resp.StatusCode != http.StatusOK {
					result["success"] = false
					result["error"] = "Invalid response code"
					result["status"] = resp.StatusCode
				} else {
					body, err := io.ReadAll(resp.Body)
					if err != nil {
						result["success"] = false
						result["error"] = err.Error()
						result["status"] = resp.StatusCode
					} else {
						var jsonData map[string]interface{}
						if err := json.Unmarshal(body, &jsonData); err != nil {
							result["success"] = false
							result["error"] = err.Error()
							result["status"] = resp.StatusCode
						} else {
							if code, ok := jsonData["Status"]; ok {
								result["success"] = true
								result["code"] = code
								result["listed"] = (code == 0)
								result["status"] = resp.StatusCode
							} else {
								result["success"] = false
								result["error"] = "Code not found in response"
								result["status"] = resp.StatusCode
							}
						}
					}
				}
			}

			mu.Lock()
			results[strconv.Itoa(index)] = result
			mu.Unlock()

		}(i, ip, list)
	}

	wg.Wait()

	return results
}
