package utilities

import (
	"github.com/showwin/speedtest-go/speedtest"
)

// Функция для тестирования скорости сети
func Speedtest() map[string]interface{} {
	var client = speedtest.New()

	servers, err := client.FetchServers()

	if err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
		}
	}

	targets, err := servers.FindServer([]int{})

	if err != nil {
		return map[string]interface{}{
			"success": false,
			"error":   err.Error(),
		}
	}

	server := targets[0]

	server.PingTest(nil)
	server.DownloadTest()
	server.UploadTest()

	return map[string]interface{}{
		"success":  true,
		"ping":     server.Latency.Seconds() * 1000,
		"download": server.DLSpeed,
		"upload":   server.ULSpeed,
		"country":  server.Country,
		"server":   server.Name,
		"host":     server.Host,
	}
}
