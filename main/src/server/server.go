package main

import (
	"encoding/json"
	"net/http"
	utils "scanner/src/utilities"
	"sync"
)

func main() {
	http.HandleFunc("/network-scanner/info/ip", printIpInfo)
	http.HandleFunc("/network-scanner/info/speedtest", printSpeedtestInfo)
	http.HandleFunc("/network-scanner/info/blacklists", printBlacklistsInfo)
	http.HandleFunc("/network-scanner/info/abuse", printIpAbuseInfo)

	http.ListenAndServe(":8060", nil)
}

func setHeadersSettings(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	w.Header().Add("Content-Type", "application/json")
}

func printIpInfo(w http.ResponseWriter, req *http.Request) {
	data := make(map[string]interface{})

	ipInfo := utils.GetIpInfo()
	data["ip_info"] = ipInfo

	var wg sync.WaitGroup
	var mu sync.Mutex

	wg.Add(4)

	go func() {
		defer wg.Done()
		mu.Lock()
		threats := utils.GetIpThreatLvl(data["ip_info"].(map[string]interface{})["structure"].(map[string]interface{})["ip"].(string))
		data["ip_threat_info"] = threats
		mu.Unlock()
	}()

	go func() {
		defer wg.Done()
		cf := utils.CheckCloudflareAvailability()
		mu.Lock()
		data["cloudflare_availability"] = cf
		mu.Unlock()
	}()

	go func() {
		defer wg.Done()
		yt := utils.CheckYouTubeAvailability()
		mu.Lock()
		data["youtube_availability"] = yt
		mu.Unlock()
	}()

	go func() {
		defer wg.Done()
		fb := utils.CheckFacebookAvailability()
		mu.Lock()
		data["facebook_availability"] = fb
		mu.Unlock()
	}()

	wg.Wait()

	setHeadersSettings(w)

	encoder := json.NewEncoder(w)
	err := encoder.Encode(data)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func printSpeedtestInfo(w http.ResponseWriter, req *http.Request) {
	speedInfo := utils.Speedtest()

	setHeadersSettings(w)

	jsonData := map[string]interface{}{"speed_info": speedInfo}

	encoder := json.NewEncoder(w)
	err := encoder.Encode(jsonData)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func printBlacklistsInfo(w http.ResponseWriter, req *http.Request) {
	ipInfo := utils.GetIpInfo()

	blacklistsInfo := utils.CheckBlacklists(ipInfo["structure"].(map[string]interface{})["ip"].(string))

	setHeadersSettings(w)

	jsonData := map[string]interface{}{"blacklists_info": blacklistsInfo}

	encoder := json.NewEncoder(w)
	err := encoder.Encode(jsonData)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func printIpAbuseInfo(w http.ResponseWriter, req *http.Request) {
	ipInfo := utils.GetIpInfo()

	abuseInfo := utils.GetIpAbuseInfo(ipInfo["structure"].(map[string]interface{})["ip"].(string))

	setHeadersSettings(w)

	jsonData := map[string]interface{}{"ip_abuse_info": abuseInfo}

	encoder := json.NewEncoder(w)
	err := encoder.Encode(jsonData)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
