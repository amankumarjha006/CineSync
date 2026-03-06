import numpy as np
from PIL import Image
import sys

def remove_bg(input_path, output_path, tolerance=80):
    print(f"Opening {input_path}")
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    # Get background color from top-left pixel
    bg_color = data[0, 0, :3]
    print(f"Background color detected as: {bg_color}")
    
    # Calculate Euclidean distance from bg color
    # Using float to avoid overflow
    diff = data[..., :3].astype(float) - bg_color.astype(float)
    dist = np.sqrt(np.sum(diff ** 2, axis=2))
    
    # Create mask where distance is within tolerance
    mask = dist < tolerance
    
    # Let's also add a condition for dark colors in general, as the background is a noisy gradient
    # The logo itself is very bright white/pink
    dark_mask = (data[..., 0] < 120) & (data[..., 1] < 100) & (data[..., 2] < 150)
    
    final_mask = mask | dark_mask
    
    # Apply mask
    data[final_mask, 3] = 0  # Set alpha to 0
    
    Image.fromarray(data).save(output_path)
    print(f"Saved transparent logo to {output_path}")

input_img = 'C:/Users/akjha/OneDrive/Documents/MyProjects/Movies_recommendation_system/frontend/public/Untitled design.png'
output_img = 'C:/Users/akjha/OneDrive/Documents/MyProjects/Movies_recommendation_system/frontend/public/cinesync-logo.png'
remove_bg(input_img, output_img)
