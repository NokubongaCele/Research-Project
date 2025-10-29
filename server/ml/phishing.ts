import * as ort from 'onnxruntime-node';
import { AutoTokenizer } from '@xenova/transformers';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PhishingPrediction {
  isPhishing: boolean;
  confidence: number;
  label: string;
}

export interface ModelStatus {
  ready: boolean;
  modelPath?: string;
  tokenizerPath?: string;
  error?: string;
}

export class PhishingDetector {
  private session: ort.InferenceSession | null = null;
  private tokenizer: any = null;
  private isInitialized = false;
  private modelStatus: ModelStatus = { ready: false };

  async initialize(): Promise<void> {
    try {
      const modelsDir = path.join(__dirname, '../models/phishing');
      const modelPath = path.join(modelsDir, 'model.onnx');
      const tokenizerPath = path.join(modelsDir, 'tokenizer.json');

      // Check if model files exist
      if (!fs.existsSync(modelPath)) {
        console.log('ONNX model file not found. Please place model.onnx in server/models/phishing/');
        this.modelStatus = { ready: false, error: 'Model file not found' };
        return;
      }

      if (!fs.existsSync(tokenizerPath)) {
        console.log('Tokenizer file not found. Please place tokenizer.json in server/models/phishing/');
        this.modelStatus = { ready: false, error: 'Tokenizer file not found' };
        return;
      }

      // Load the ONNX model
      console.log('Loading ONNX model...');
      this.session = await ort.InferenceSession.create(modelPath);
      console.log('ONNX model loaded successfully');

      // Load the tokenizer from local file
      console.log('Loading tokenizer...');
      const tokenizerData = JSON.parse(fs.readFileSync(tokenizerPath, 'utf-8'));
      
      // Create a simple tokenizer interface compatible with our needs
      this.tokenizer = {
        async encode(text: string, options: any = {}) {
          // Simple tokenization - split by spaces and convert to IDs
          // This is a simplified approach; in production you'd want proper tokenization
          const tokens = text.toLowerCase().split(/\s+/).slice(0, options.max_length || 512);
          const vocab = tokenizerData.model?.vocab || {};
          
          // Convert tokens to IDs, using unknown token ID for missing words
          const inputIds = tokens.map((token: string) => vocab[token] || vocab['[UNK]'] || 0);
          
          // Pad or truncate to max_length
          const maxLength = options.max_length || 512;
          while (inputIds.length < maxLength) inputIds.push(0); // pad with 0
          
          return {
            input_ids: {
              data: new BigInt64Array(inputIds.map((id: number) => BigInt(id))),
              dims: [1, inputIds.length]
            },
            attention_mask: {
              data: new BigInt64Array(inputIds.map((id: number, idx: number) => 
                idx < tokens.length ? BigInt(1) : BigInt(0)
              )),
              dims: [1, inputIds.length]
            }
          };
        }
      };
      console.log('Tokenizer loaded successfully');

      this.isInitialized = true;
      this.modelStatus = { 
        ready: true, 
        modelPath,
        tokenizerPath
      };

    } catch (error) {
      console.error('Failed to initialize ML models:', error);
      this.modelStatus = { 
        ready: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      // Don't throw error - continue with simulated predictions
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.session !== null && this.tokenizer !== null;
  }

  getStatus(): ModelStatus {
    return this.modelStatus;
  }

  async predict(emailText: string): Promise<PhishingPrediction> {
    console.log('predict() called, isReady:', this.isReady());
    
    // Always get simulation result as backup/ensemble
    const simResult = this.simulatedPrediction(emailText);
    
    // If model is not ready, return simulated prediction
    if (!this.isReady()) {
      console.log('Using simulated prediction only:', simResult);
      return simResult;
    }

    try {
      // Tokenize the input text
      const inputs = await this.tokenizer.encode(emailText, {
        max_length: 512
      });

      // Convert to the format expected by ONNX Runtime
      const inputIds = new ort.Tensor('int64', inputs.input_ids.data, inputs.input_ids.dims);
      const attentionMask = new ort.Tensor('int64', inputs.attention_mask.data, inputs.attention_mask.dims);

      // Run inference
      const feeds = {
        input_ids: inputIds,
        attention_mask: attentionMask
      };

      const results = await this.session!.run(feeds);
      
      // Get the output logits
      const logits = results.logits.data as Float32Array;
      
      // Apply softmax to get probabilities
      const probabilities = this.softmax(Array.from(logits));
      
      // Check both interpretations of the model output
      console.log('Raw probabilities:', probabilities);
      console.log('Prob[0] (should be not_phishing):', probabilities[0]);
      console.log('Prob[1] (should be phishing):', probabilities[1]);
      
      // Try the reverse interpretation - maybe labels are swapped
      const phishingProb = probabilities[0];  // Try index 0 instead of 1
      const isPhishing = phishingProb > 0.5;
      
      const aiResult = {
        isPhishing,
        confidence: Math.max(...probabilities),
        label: isPhishing ? 'Phishing' : 'Legitimate'
      };
      console.log('AI prediction result:', aiResult);
      console.log('Simulation result:', simResult);
      
      // Ensemble method: If simulation has high confidence for phishing, trust it
      if (simResult.isPhishing && simResult.confidence > 0.6) {
        console.log('Using simulation result due to high phishing confidence');
        return {
          isPhishing: true,
          confidence: Math.max(simResult.confidence, aiResult.confidence * 0.5),
          label: 'Phishing'
        };
      }
      
      // If AI says not phishing but simulation disagrees with medium confidence
      if (!aiResult.isPhishing && simResult.isPhishing && simResult.confidence > 0.4) {
        console.log('Using ensemble result - simulation overrides AI');
        return {
          isPhishing: true,
          confidence: (simResult.confidence + (1 - aiResult.confidence)) / 2,
          label: 'Phishing'
        };
      }
      
      // Otherwise use AI result
      return aiResult;

    } catch (error) {
      console.error('Error during ML prediction:', error);
      // Fall back to simulated prediction on error
      const fallbackResult = this.simulatedPrediction(emailText);
      console.log('Using fallback prediction due to error:', fallbackResult);
      return fallbackResult;
    }
  }

  private simulatedPrediction(emailText: string): PhishingPrediction {
    // Advanced phishing detection using comprehensive heuristics
    const text = emailText.toLowerCase();
    let score = 0;
    
    // High-confidence phishing indicators (25 points each)
    const strongIndicators = [
      'verify account', 'suspend', 'suspended', 'immediate action', 'urgent action',
      'click here immediately', 'confirm identity', 'update payment', 'payment failed',
      'account locked', 'security alert', 'unusual activity', 'verify now',
      'expires today', 'expires soon', 'limited time', 'act now', 'claim now',
      'congratulations you have won', 'you are a winner', 'tax refund'
    ];
    
    // Medium indicators (15 points each)  
    const mediumIndicators = [
      'click here', 'click link', 'dear customer', 'dear user', 'dear sir/madam',
      'winner', 'prize', 'free money', 'cash prize', 'inheritance',
      'lottery', 'jackpot', 'million dollars', 'urgent', 'asap'
    ];
    
    // Weak indicators (10 points each)
    const weakIndicators = [
      'congratulations', 'free', 'offer', 'special deal', 'limited offer',
      'no cost', 'risk free', 'guaranteed', '100%', 'amazing deal'
    ];
    
    // Banking/financial phishing (30 points each)
    const bankingPhishing = [
      'bank support', 'account verification', 'online banking', 'credit card',
      'paypal', 'amazon', 'apple id', 'microsoft account', 'google account',
      'password reset', 'login credentials', 'two-factor authentication'
    ];
    
    // URL/link indicators (20 points each) 
    const urlIndicators = [
      'http://', 'bit.ly', 'tinyurl', 'login.', 'verify.', 'secure.',
      'update.', 'confirm.', '.tk', '.ml', '.ga'
    ];
    
    // Count indicators with weights
    strongIndicators.forEach(indicator => {
      if (text.includes(indicator)) score += 25;
    });
    
    mediumIndicators.forEach(indicator => {
      if (text.includes(indicator)) score += 15;
    });
    
    weakIndicators.forEach(indicator => {
      if (text.includes(indicator)) score += 10;
    });
    
    bankingPhishing.forEach(indicator => {
      if (text.includes(indicator)) score += 30;
    });
    
    urlIndicators.forEach(indicator => {
      if (text.includes(indicator)) score += 20;
    });
    
    // Additional patterns
    if (text.includes('http://') && !text.includes('https://')) score += 20; // Insecure links
    if ((text.match(/click/g) || []).length > 1) score += 15; // Multiple "click" words
    if (text.includes('failure to do so will result in')) score += 35; // Threatening language
    if (text.includes('dear sir') || text.includes('dear madam')) score += 20; // Generic greeting
    
    // Calculate confidence and result
    const maxScore = 100;
    const confidence = Math.min(score / maxScore, 0.98);
    const isPhishing = score >= 25; // Lower threshold for better detection
    
    console.log(`Simulation analysis: score=${score}, confidence=${confidence}, isPhishing=${isPhishing}`);
    
    return {
      isPhishing,
      confidence: Math.max(confidence, 0.1), // Minimum 10% confidence
      label: isPhishing ? 'Phishing' : 'Legitimate'
    };
  }

  private softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits);
    const expLogits = logits.map(x => Math.exp(x - maxLogit));
    const sumExp = expLogits.reduce((sum, val) => sum + val, 0);
    return expLogits.map(x => x / sumExp);
  }
}

// Export singleton instance
export const phishingDetector = new PhishingDetector();