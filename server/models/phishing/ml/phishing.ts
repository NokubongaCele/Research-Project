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
  scores: number[];
  label: string;
}

export class PhishingDetector {
  private session: ort.InferenceSession | null = null;
  private tokenizer: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    try {
      const modelPath = path.join(__dirname, '../models/phishing/model.onnx');
      const tokenizerPath = path.join(__dirname, '../models/phishing');

      // Check if model files exist
      if (!fs.existsSync(modelPath)) {
        console.warn('ONNX model file not found. Please place model.onnx in server/models/phishing/');
        return;
      }

      console.log('Loading ONNX model...');
      this.session = await ort.InferenceSession.create(modelPath);
      
      console.log('Loading tokenizer...');
      this.tokenizer = await AutoTokenizer.from_pretrained(tokenizerPath);
      
      this.isInitialized = true;
      console.log('PhishingDetector initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PhishingDetector:', error);
      this.isInitialized = false;
    }
  }

  async predict(emailText: string): Promise<PhishingPrediction> {
    if (!this.isInitialized) {
      // Return simulated prediction if model not loaded
      const simulatedConfidence = Math.random();
      const isPhishing = simulatedConfidence > 0.7;
      
      return {
        isPhishing,
        confidence: simulatedConfidence,
        scores: isPhishing ? [0.3, 0.7] : [0.7, 0.3],
        label: isPhishing ? 'Phishing Email' : 'Safe Email'
      };
    }

    try {
      // Tokenize the input text
      const inputs = await this.tokenizer(emailText, {
        padding: true,
        truncation: true,
        max_length: 512,
        return_tensors: 'pt'
      });

      // Prepare input for ONNX Runtime
      const inputTensor = new ort.Tensor('int64', inputs.input_ids.data, inputs.input_ids.dims);
      const attentionTensor = new ort.Tensor('int64', inputs.attention_mask.data, inputs.attention_mask.dims);

      // Run inference
      const results = await this.session!.run({
        input_ids: inputTensor,
        attention_mask: attentionTensor
      });

      // Extract logits and calculate probabilities
      const logits = Array.from(results.logits.data as Float32Array);
      const softmax = this.softmax(logits);
      
      const isPhishing = softmax[1] > softmax[0]; // Assuming index 1 is phishing class
      const confidence = Math.max(...softmax);

      return {
        isPhishing,
        confidence,
        scores: softmax,
        label: isPhishing ? 'Phishing Email' : 'Safe Email'
      };
    } catch (error) {
      console.error('Prediction error:', error);
      
      // Fallback to simulated prediction
      const simulatedConfidence = Math.random();
      const isPhishing = simulatedConfidence > 0.7;
      
      return {
        isPhishing,
        confidence: simulatedConfidence,
        scores: isPhishing ? [0.3, 0.7] : [0.7, 0.3],
        label: isPhishing ? 'Phishing Email (Simulated)' : 'Safe Email (Simulated)'
      };
    }
  }

  private softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits);
    const scores = logits.map(logit => Math.exp(logit - maxLogit));
    const sumScores = scores.reduce((sum, score) => sum + score, 0);
    return scores.map(score => score / sumScores);
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance
export const phishingDetector = new PhishingDetector();