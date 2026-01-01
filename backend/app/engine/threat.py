import json
import os

class ThreatIntel:
    def __init__(self):
        self.ioc_file = os.path.join(os.path.dirname(__file__), 'iocs.json')
        self.ip_blacklist = {}
        self.domain_blacklist = {}
        self.load_iocs()

    def load_iocs(self):
        """Loads IOCs from the JSON database."""
        if os.path.exists(self.ioc_file):
            try:
                with open(self.ioc_file, 'r') as f:
                    data = json.load(f)
                    self.ip_blacklist = data.get("ips", {})
                    self.domain_blacklist = data.get("domains", {})
                print(f"[+] Threat Intel Loaded: {len(self.ip_blacklist)} IPs, {len(self.domain_blacklist)} Domains.")
            except Exception as e:
                print(f"[-] Error loading IOCs: {e}")
        else:
            print("[-] No IOC file found. Threat Intel disabled.")

    def check_ip(self, ip_addr):
        """Checks if an IP is in the blacklist."""
        if ip_addr in self.ip_blacklist:
            return {
                "is_malicious": True,
                "threat_type": self.ip_blacklist[ip_addr],
                "ioc_type": "IP"
            }
        return {"is_malicious": False, "threat_type": "None", "ioc_type": "None"}

    def check_domain(self, domain):
        """Checks if a Domain is in the blacklist."""
        # Simple exact match (Enhancement: could add regex/substring checks)
        if domain in self.domain_blacklist:
            return {
                "is_malicious": True,
                "threat_type": self.domain_blacklist[domain],
                "ioc_type": "Domain"
            }
        return {"is_malicious": False, "threat_type": "None", "ioc_type": "None"}