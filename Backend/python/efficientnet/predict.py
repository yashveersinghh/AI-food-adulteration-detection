"""
FOODGUARD-AI PREDICTION SCRIPT
===============================
Predicts food adulteration for any image
Supports: Cashews, Pistachios, Saffron, Vanilla, A2 Milk
"""

import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import timm
from pathlib import Path
import argparse
import sys

# ============================================================================
# MODEL DEFINITION
# ============================================================================

class MultiProductAdulterationModel(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        
        self.backbone = timm.create_model(
            'tf_efficientnetv2_b0',
            pretrained=True,
            num_classes=0
        )
        
        with torch.no_grad():
            dummy = torch.randn(1, 3, 224, 224)
            features = self.backbone(dummy)
            feature_dim = features.shape[1]
        
        self.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(feature_dim, 256),
            nn.ReLU(),
            nn.BatchNorm1d(256),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, num_classes)
        )
    
    def forward(self, x):
        features = self.backbone(x)
        return self.classifier(features)


# ============================================================================
# PREDICTION CLASS
# ============================================================================

class FoodGuardPredictor:
    def __init__(self, model_path='../models/multi_product/best_model.pth'):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.transform = None
        self.class_names = {0: 'Adulterated', 1: 'Pure'}
        
        self._load_model(model_path)
        self._setup_transforms()
    
    def _load_model(self, model_path):
        """Load trained model"""
        print(f"🔄 Loading model from: {model_path}")
        
        if not Path(model_path).exists():
            raise FileNotFoundError(f"Model not found: {model_path}")
        
        self.model = MultiProductAdulterationModel(num_classes=2).to(self.device)
        checkpoint = torch.load(model_path, map_location=self.device, weights_only=False)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.eval()
        
        print(f"✅ Model loaded successfully!")
        print(f"💾 Device: {self.device}")
        if 'val_acc' in checkpoint:
            print(f"📊 Model validation accuracy: {checkpoint['val_acc']:.2f}%")
    
    def _setup_transforms(self):
        """Setup image preprocessing"""
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
    
    def predict(self, image_path):
        """
        Predict adulteration for a single image
        
        Args:
            image_path: Path to image file
            
        Returns:
            dict with prediction results
        """
        # Load image
        if not Path(image_path).exists():
            raise FileNotFoundError(f"Image not found: {image_path}")
        
        img = Image.open(image_path).convert('RGB')
        
        # Preprocess
        img_tensor = self.transform(img).unsqueeze(0).to(self.device)
        
        # Predict
        with torch.no_grad():
            output = self.model(img_tensor)
            probabilities = torch.softmax(output, dim=1)[0]
        
        # Get results
        predicted_idx = int(torch.argmax(probabilities).item())
        predicted_label = self.class_names[predicted_idx]
        confidence = float(probabilities[predicted_idx].item() * 100)
        
        return {
            'image_path': str(image_path),
            'prediction': predicted_label,
            'confidence': confidence,
            'probabilities': {
                'Adulterated': float(probabilities[0].item() * 100),
                'Pure': float(probabilities[1].item() * 100)
            }
        }
    
    def predict_batch(self, image_paths):
        """Predict multiple images"""
        results = []
        for img_path in image_paths:
            try:
                result = self.predict(img_path)
                results.append(result)
            except Exception as e:
                results.append({
                    'image_path': str(img_path),
                    'error': str(e)
                })
        return results


# ============================================================================
# COMMAND LINE INTERFACE
# ============================================================================

def print_result(result):
    """Pretty print prediction result"""
    print("\n" + "="*80)
    print("🔍 PREDICTION RESULT")
    print("="*80)
    
    if 'error' in result:
        print(f"❌ Error: {result['error']}")
        return
    
    print(f"📁 Image: {result['image_path']}")
    print(f"\n{'='*80}")
    
    prediction = result['prediction']
    confidence = result['confidence']
    
    # Color-coded output
    if prediction == 'Pure':
        status_icon = "✅"
        status_color = "GREEN"
    else:
        status_icon = "⚠️"
        status_color = "RED"
    
    print(f"{status_icon} PREDICTION: {prediction.upper()}")
    print(f"📊 Confidence: {confidence:.2f}%")
    
    print(f"\n{'='*80}")
    print("📈 PROBABILITY BREAKDOWN:")
    print(f"{'='*80}")
    print(f"  Pure:        {result['probabilities']['Pure']:6.2f}%")
    print(f"  Adulterated: {result['probabilities']['Adulterated']:6.2f}%")
    
    print(f"\n{'='*80}")
    print("💡 INTERPRETATION:")
    print(f"{'='*80}")
    
    if prediction == 'Pure' and confidence > 85:
        print("  ✅ Sample appears to be PURE with high confidence")
    elif prediction == 'Pure':
        print("  ⚠️  Sample likely PURE but with moderate confidence")
    elif prediction == 'Adulterated' and confidence > 85:
        print("  ❌ Sample appears to be ADULTERATED with high confidence")
    else:
        print("  ⚠️  Sample possibly ADULTERATED but with moderate confidence")
    
    print(f"{'='*80}\n")


def main():
    parser = argparse.ArgumentParser(
        description='FoodGuard-AI: Multi-Product Food Adulteration Detection',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Single image prediction
  python predict.py --image sample.jpg
  
  # Multiple images
  python predict.py --image img1.jpg img2.jpg img3.jpg
  
  # Use specific model
  python predict.py --image sample.jpg --model ../models/custom_model.pth
        """
    )
    
    parser.add_argument(
        '--image', '-i',
        nargs='+',
        required=True,
        help='Path to image file(s) to analyze'
    )
    
    parser.add_argument(
        '--model', '-m',
        default='../models/multi_product/best_model.pth',
        help='Path to trained model (default: ../models/multi_product/best_model.pth)'
    )
    
    args = parser.parse_args()
    
    # Print header
    print("="*80)
    print("🍎 FOODGUARD-AI - FOOD ADULTERATION DETECTION")
    print("="*80)
    print("Supported products: Cashews, Pistachios, Saffron, Vanilla, A2 Milk")
    print("="*80)
    
    # Load model
    try:
        predictor = FoodGuardPredictor(model_path=args.model)
    except Exception as e:
        print(f"\n❌ Failed to load model: {e}")
        sys.exit(1)
    
    # Predict
    print(f"\n📸 Analyzing {len(args.image)} image(s)...")
    
    for img_path in args.image:
        try:
            result = predictor.predict(img_path)
            print_result(result)
        except Exception as e:
            print(f"\n❌ Error processing {img_path}: {e}\n")


if __name__ == '__main__':
    main()