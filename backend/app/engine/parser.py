import pyshark
import geoip2.database
import os
import json
from .threat import ThreatIntel  # Import the Threat Engine

class NetXParser:
    def __init__(self, pcap_file):
        """
        Initialize the parser with the path to the pcap file.
        """
        if not os.path.exists(pcap_file):
            raise FileNotFoundError(f"File not found: {pcap_file}")
            
        self.pcap_file = pcap_file
        self.conversation_list = []
        
        # 1. Setup GeoIP Database
        self.db_path = os.path.join(os.path.dirname(__file__), 'GeoLite2-City.mmdb')
        self.geo_reader = None

        if os.path.exists(self.db_path):
            try:
                self.geo_reader = geoip2.database.Reader(self.db_path)
                print(f"[+] GeoIP Database loaded from {self.db_path}")
            except Exception as e:
                print(f"[-] Error loading GeoIP DB: {e}")
        else:
            print(f"[-] GeoLite2 DB not found. Geo-location disabled.")

        # 2. Setup Threat Intelligence Engine
        self.threat_engine = ThreatIntel()

    def get_country(self, ip_addr):
        """Helper to lookup country ISO code."""
        if not self.geo_reader or ip_addr == "N/A":
            return "N/A"
        try:
            if ip_addr.startswith(('192.168.', '10.', '172.16.', '127.', 'fe80::')):
                return "Internal"
            response = self.geo_reader.city(ip_addr)
            return response.country.iso_code or "Unknown"
        except Exception:
            return "Unknown"

    def parse(self):
        """
        Reads PCAP, extracts Metadata + Geo + Threat Info (IP & DNS).
        """
        print(f"[*] Starting analysis on {self.pcap_file}...")
        
        # keep_packets=False saves RAM on large files
        capture = pyshark.FileCapture(self.pcap_file, keep_packets=False)
        packet_count = 0

        for packet in capture:
            try:
                # Default empty object structure
                packet_data = {
                    "timestamp": str(packet.sniff_time),
                    "src_ip": "N/A", "dst_ip": "N/A",
                    "src_country": "", "dst_country": "",
                    "src_port": "0", "dst_port": "0",
                    "protocol": "Unknown",
                    "length": packet.length,
                    "is_malicious": False,
                    "threat_type": "None",
                    "ioc_value": "" # Stores the specific bad IP or Domain found
                }

                # --- 1. HANDLE IP LAYER ---
                if 'IP' in packet:
                    src_ip = packet.ip.src
                    dst_ip = packet.ip.dst
                    packet_data["src_ip"] = src_ip
                    packet_data["dst_ip"] = dst_ip
                    packet_data["src_country"] = self.get_country(src_ip)
                    packet_data["dst_country"] = self.get_country(dst_ip)
                    
                    # Check IP Threats
                    src_threat = self.threat_engine.check_ip(src_ip)
                    dst_threat = self.threat_engine.check_ip(dst_ip)

                    if src_threat['is_malicious']:
                        packet_data["is_malicious"] = True
                        packet_data["threat_type"] = src_threat['threat_type']
                        packet_data["ioc_value"] = src_ip
                    elif dst_threat['is_malicious']:
                        packet_data["is_malicious"] = True
                        packet_data["threat_type"] = dst_threat['threat_type']
                        packet_data["ioc_value"] = dst_ip

                # --- 2. HANDLE TRANSPORT LAYER (Ports) ---
                if 'TCP' in packet:
                    packet_data["protocol"] = "TCP"
                    packet_data["src_port"] = packet.tcp.srcport
                    packet_data["dst_port"] = packet.tcp.dstport
                elif 'UDP' in packet:
                    packet_data["protocol"] = "UDP"
                    packet_data["src_port"] = packet.udp.srcport
                    packet_data["dst_port"] = packet.udp.dstport

                # --- 3. HANDLE DNS (Domain IOCs) ---
                # Checks if the packet contains a DNS Query for a bad domain
                if 'DNS' in packet:
                    packet_data["protocol"] = "DNS"
                    try:
                        # Extract the website being queried
                        qry_name = packet.dns.qry_name
                        
                        # Check Domain against Threat DB
                        domain_threat = self.threat_engine.check_domain(qry_name)
                        
                        if domain_threat['is_malicious']:
                            packet_data["is_malicious"] = True
                            packet_data["threat_type"] = domain_threat['threat_type']
                            packet_data["ioc_value"] = qry_name
                    except AttributeError:
                        pass # Not a standard query packet
                
                # Final cleanup: If protocol is still unknown, grab the highest layer name
                if packet_data["protocol"] == "Unknown" and hasattr(packet, 'highest_layer'):
                    packet_data["protocol"] = packet.highest_layer

                self.conversation_list.append(packet_data)
                packet_count += 1

            except Exception:
                # Skip malformed packets
                continue

        capture.close()
        
        if self.geo_reader:
            self.geo_reader.close()
            
        print(f"[+] Analysis complete. Processed {packet_count} packets.")
        return self.conversation_list