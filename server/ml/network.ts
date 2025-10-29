import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface NetworkFeatures {
  duration: number;
  protocol_type: string;
  service: string;
  flag: string;
  src_bytes: number;
  dst_bytes: number;
  land: number;
  wrong_fragment: number;
  urgent: number;
  hot: number;
  num_failed_logins: number;
  logged_in: number;
  num_compromised: number;
  root_shell: number;
  su_attempted: number;
  num_root: number;
  num_file_creations: number;
  num_shells: number;
  num_access_files: number;
  num_outbound_cmds: number;
  is_host_login: number;
  is_guest_login: number;
  count: number;
  srv_count: number;
  serror_rate: number;
  srv_serror_rate: number;
  rerror_rate: number;
  srv_rerror_rate: number;
  same_srv_rate: number;
  diff_srv_rate: number;
  srv_diff_host_rate: number;
  dst_host_count: number;
  dst_host_srv_count: number;
  dst_host_same_srv_rate: number;
  dst_host_diff_srv_rate: number;
  dst_host_same_src_port_rate: number;
  dst_host_srv_diff_host_rate: number;
  dst_host_serror_rate: number;
  dst_host_srv_serror_rate: number;
  dst_host_rerror_rate: number;
  dst_host_srv_rerror_rate: number;
}

export interface NetworkPrediction {
  isAttack: boolean;
  attackType: string;
  confidence: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface NetworkModelStatus {
  ready: boolean;
  modelPath?: string;
  error?: string;
}

export class NetworkDetector {
  private modelReady = false;
  private modelStatus: NetworkModelStatus = { ready: false };

  async initialize(): Promise<void> {
    try {
      const modelsDir = path.join(__dirname, '../models/phishing');
      const modelPath = path.join(modelsDir, 'network_model.pkl');

      // Check if model file exists
      if (!fs.existsSync(modelPath)) {
        console.log('Network model file not found. Using simulated network intrusion detection');
        this.modelStatus = { ready: false, error: 'Model file not found' };
        return;
      }

      console.log('Network model file found (670MB Random Forest)');
      
      // For now, we'll use simulated detection based on NSL-KDD patterns
      // In production, this would load the actual pickle model via Python subprocess
      this.modelReady = false; // Set to false for now, using simulation
      this.modelStatus = { 
        ready: false, 
        modelPath,
        error: 'Python model integration pending - using simulation'
      };

      console.log('Network analysis ready (simulated mode)');

    } catch (error) {
      console.error('Failed to initialize network models:', error);
      this.modelStatus = { 
        ready: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  isReady(): boolean {
    return this.modelReady;
  }

  getStatus(): NetworkModelStatus {
    return this.modelStatus;
  }

  async predict(features: Partial<NetworkFeatures>): Promise<NetworkPrediction> {
    // Use intelligent simulation based on NSL-KDD attack patterns
    return this.simulatedNetworkPrediction(features);
  }

  private simulatedNetworkPrediction(features: Partial<NetworkFeatures>): NetworkPrediction {
    let attackScore = 0;
    let attackType = 'normal';
    let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const detectedPatterns: string[] = [];

    console.log('Analyzing features:', {
      protocol: features.protocol_type,
      service: features.service,
      flag: features.flag,
      count: features.count,
      srv_count: features.srv_count,
      dst_host_count: features.dst_host_count,
      serror_rate: features.serror_rate,
      rerror_rate: features.rerror_rate
    });

    // PORTSWEEP Detection (improved logic) - HIGH PRIORITY
    let isPortsweep = false;
    if (
      features.protocol_type === 'tcp' && 
      features.service === 'private' &&
      features.flag === 'REJ' &&
      (features.count || 0) > 100
    ) {
      attackScore += 0.85;
      attackType = 'portsweep';
      threatLevel = 'high';
      isPortsweep = true;
      detectedPatterns.push('Port sweep: Many rejected TCP connections to private services');
    }

    // Alternative portsweep patterns
    if ((features.dst_host_srv_count || 0) > 50 && 
        (features.dst_host_same_srv_rate || 0) < 0.1) {
      attackScore += 0.7;
      if (!isPortsweep) {
        attackType = 'portsweep';
        threatLevel = 'medium';
      }
      detectedPatterns.push('Port sweep: Multiple services, low same service rate');
    }

    // NEPTUNE (SYN Flood) - improved detection
    if (features.protocol_type === 'tcp' && 
        features.flag === 'S0' && 
        (features.count || 0) > 100) {
      attackScore += 0.9;
      attackType = 'neptune';
      threatLevel = 'critical';
      detectedPatterns.push('Neptune SYN flood: Many incomplete connections');
    }

    // SMURF Attack (ICMP flood)
    if (features.protocol_type === 'icmp' && 
        (features.count || 0) > 200) {
      attackScore += 0.85;
      attackType = 'smurf';
      threatLevel = 'high';
      detectedPatterns.push('Smurf attack: ICMP flood detected');
    }

    // SATAN Scan (only if not already portsweep)
    if ((features.rerror_rate || 0) > 0.5 && 
        (features.srv_rerror_rate || 0) > 0.5 &&
        (features.count || 0) > 10 &&
        !isPortsweep) {
      attackScore += 0.75;
      attackType = 'satan';
      threatLevel = 'medium';
      detectedPatterns.push('Satan scan: High error rates indicating reconnaissance');
    } else if ((features.rerror_rate || 0) > 0.5 && isPortsweep) {
      // Just add to the pattern but don't change the attack type
      detectedPatterns.push('Additional: High error rates consistent with port sweep');
    }

    // BUFFER OVERFLOW Detection
    if ((features.src_bytes || 0) > 5000 && 
        features.service === 'http' &&
        (features.hot || 0) > 0) {
      attackScore += 0.8;
      attackType = 'buffer_overflow';
      threatLevel = 'critical';
      detectedPatterns.push('Buffer overflow attempt: Large HTTP payload with hot indicators');
    }

    // IP SWEEP / NMAP Detection
    if (features.protocol_type === 'icmp' && 
        features.service === 'ecr_i' &&
        (features.dst_host_count || 0) > 100) {
      attackScore += 0.7;
      attackType = 'ipsweep';
      threatLevel = 'medium';
      detectedPatterns.push('IP sweep: ICMP probes to many hosts');
    }

    // TEARDROP Attack
    if (features.protocol_type === 'udp' && 
        (features.wrong_fragment || 0) > 0) {
      attackScore += 0.9;
      attackType = 'teardrop';
      threatLevel = 'critical';
      detectedPatterns.push('Teardrop attack: Malformed UDP fragments');
    }

    // WAREZCLIENT (FTP abuse)
    if (features.service?.includes('ftp') && 
        (features.num_file_creations || 0) > 0) {
      attackScore += 0.6;
      attackType = 'warezclient';
      threatLevel = 'medium';
      detectedPatterns.push('Warezclient: Suspicious FTP file activity');
    }

    // ROOT KIT indicators
    if ((features.num_root || 0) > 0 || 
        (features.root_shell || 0) > 0 || 
        (features.su_attempted || 0) > 0) {
      attackScore += 0.85;
      attackType = 'rootkit';
      threatLevel = 'critical';
      detectedPatterns.push('Rootkit activity: Privileged access attempts');
    }

    // Failed login patterns (brute force)
    if ((features.num_failed_logins || 0) > 2) {
      attackScore += 0.6;
      attackType = 'bruteforce';
      threatLevel = 'medium';
      detectedPatterns.push('Brute force: Multiple failed login attempts');
    }

    // Calculate final confidence and decision
    const confidence = Math.min(Math.max(attackScore, 0.1), 0.98);
    const isAttack = attackScore > 0.3; // Lower threshold for better sensitivity

    if (!isAttack) {
      attackType = 'normal';
      threatLevel = 'low';
    }

    console.log(`Network analysis result: score=${attackScore.toFixed(2)}, attack=${isAttack}, type=${attackType}, patterns=[${detectedPatterns.join(', ')}]`);

    return {
      isAttack,
      attackType: isAttack ? attackType : 'normal',
      confidence,
      threatLevel
    };
  }

  // Helper method to parse network connection string into features
  parseNetworkConnection(connectionData: string): Partial<NetworkFeatures> {
    try {
      // Parse connection data - could be CSV format, JSON, or custom format
      const parts = connectionData.split(',');
      
      if (parts.length >= 10) {
        // Assume CSV format similar to NSL-KDD
        return {
          duration: parseFloat(parts[0]) || 0,
          protocol_type: parts[1] || 'tcp',
          service: parts[2] || 'http',
          flag: parts[3] || 'SF',
          src_bytes: parseFloat(parts[4]) || 0,
          dst_bytes: parseFloat(parts[5]) || 0,
          land: parseInt(parts[6]) || 0,
          wrong_fragment: parseInt(parts[7]) || 0,
          urgent: parseInt(parts[8]) || 0,
          hot: parseInt(parts[9]) || 0,
          num_failed_logins: parseInt(parts[10]) || 0,
          logged_in: parseInt(parts[11]) || 0,
          num_compromised: parseInt(parts[12]) || 0,
          root_shell: parseInt(parts[13]) || 0,
          su_attempted: parseInt(parts[14]) || 0,
          num_root: parseInt(parts[15]) || 0,
          num_file_creations: parseInt(parts[16]) || 0,
          num_shells: parseInt(parts[17]) || 0,
          num_access_files: parseInt(parts[18]) || 0,
          num_outbound_cmds: parseInt(parts[19]) || 0,
          is_host_login: parseInt(parts[20]) || 0,
          is_guest_login: parseInt(parts[21]) || 0,
          count: parseInt(parts[22]) || 0,
          srv_count: parseInt(parts[23]) || 0,
          serror_rate: parseFloat(parts[24]) || 0,
          srv_serror_rate: parseFloat(parts[25]) || 0,
          rerror_rate: parseFloat(parts[26]) || 0,
          srv_rerror_rate: parseFloat(parts[27]) || 0,
          same_srv_rate: parseFloat(parts[28]) || 0,
          diff_srv_rate: parseFloat(parts[29]) || 0,
          srv_diff_host_rate: parseFloat(parts[30]) || 0,
          dst_host_count: parseInt(parts[31]) || 0,
          dst_host_srv_count: parseInt(parts[32]) || 0,
          dst_host_same_srv_rate: parseFloat(parts[33]) || 0,
          dst_host_diff_srv_rate: parseFloat(parts[34]) || 0,
          dst_host_same_src_port_rate: parseFloat(parts[35]) || 0,
          dst_host_srv_diff_host_rate: parseFloat(parts[36]) || 0,
          dst_host_serror_rate: parseFloat(parts[37]) || 0,
          dst_host_srv_serror_rate: parseFloat(parts[38]) || 0,
          dst_host_rerror_rate: parseFloat(parts[39]) || 0,
          dst_host_srv_rerror_rate: parseFloat(parts[40]) || 0
        };
      }
      
      // If not CSV, try JSON
      return JSON.parse(connectionData);
    } catch (error) {
      // Return default features for basic analysis
      return {
        duration: 0,
        protocol_type: 'tcp',
        service: 'http',
        flag: 'SF',
        src_bytes: 0,
        dst_bytes: 0
      };
    }
  }
}

// Export singleton instance
export const networkDetector = new NetworkDetector();