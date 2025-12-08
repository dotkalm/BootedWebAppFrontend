# Directional Lighting API Feature Specification

## Overview

Extend the tire detection API to analyze scene lighting conditions and return lighting parameters alongside detection results. This will enable the frontend to render 3D tire boot models with realistic lighting that matches the original parking lot image.

## Why This Feature?

The frontend currently renders 3D tire boot models overlaid on parking lot images with hardcoded lighting values:

```typescript
<ambientLight intensity={0.5} />
<directionalLight position={[10, 10, 5]} intensity={5} />
<directionalLight position={[-10, -10, -5]} intensity={.5} />
```

These generic values don't match the actual lighting in each unique parking lot photo, making the 3D overlay look unrealistic. By analyzing the image during detection, we can provide scene-specific lighting parameters.

## Current API Response

Currently, the detection API returns:

```json
{
  "detections": [
    {
      "box": [x1, y1, x2, y2],
      "confidence": 0.95,
      "class": "car"
    }
  ]
}
```

## Proposed API Response

Add a `scene_lighting` object to the response:

```json
{
  "detections": [
    {
      "box": [x1, y1, x2, y2],
      "confidence": 0.95,
      "class": "car"
    }
  ],
  "scene_lighting": {
    "ambient": {
      "intensity": 0.6,
      "color": "#e8f0f8"
    },
    "directional_lights": [
      {
        "position": [10, 15, 8],
        "intensity": 1.2,
        "color": "#fffef0",
        "direction_hint": "sun_from_top_right"
      },
      {
        "position": [-5, 2, -10],
        "intensity": 0.3,
        "color": "#b8c8d8",
        "direction_hint": "fill_light"
      }
    ],
    "metadata": {
      "analysis_method": "histogram_and_shadow",
      "confidence": 0.85,
      "time_of_day_estimate": "midday"
    }
  }
}
```

## Field Specifications

### `ambient`
- **intensity** (float, 0.0-2.0): Overall scene brightness. Analyze image histogram to determine.
- **color** (hex string): Overall color temperature. Sample sky/bright areas to detect warm (sunny) vs cool (overcast) lighting.

### `directional_lights` (array)
Array of 1-3 directional light sources:

- **position** (array[3]): `[x, y, z]` coordinates in Three.js world space
  - Typically `y > 0` (above scene) for sun/sky
  - Use shadow analysis to estimate angle
- **intensity** (float, 0.0-5.0): Light strength
- **color** (hex string): Light color temperature
- **direction_hint** (string): Human-readable hint about light source type

### `metadata` (optional)
- **analysis_method**: Which algorithm was used
- **confidence**: How confident the analysis is (0.0-1.0)
- **time_of_day_estimate**: Optional hint like "morning", "midday", "dusk"

## Implementation Approaches

### Option 1: Simple Histogram Analysis (Recommended to Start)
- Analyze image brightness histogram
- Sample top 1/3 of image for sky color → ambient color
- Detect if image is dark/light → ambient intensity
- Use default directional positions with adjusted intensity

### Option 2: Shadow Detection
- Use edge detection to find strong shadows on cars/ground
- Analyze shadow direction to estimate sun position
- Shadow sharpness → directional light intensity
- More accurate but computationally expensive

### Option 3: ML-Based Lighting Estimation
- Use a pre-trained model for lighting estimation (e.g., "Lighthouse" models)
- Most accurate but requires additional ML model
- Consider for future enhancement

### Option 4: Color Temperature Analysis
- Sample bright spots (specular highlights on cars)
- Analyze color distribution across image quadrants
- Detect dominant light source direction from brightness gradient

## Frontend Integration

The frontend Viewer component will consume this data:

```typescript
interface SceneLighting {
  ambient: {
    intensity: number;
    color: string;
  };
  directional_lights: Array<{
    position: [number, number, number];
    intensity: number;
    color: string;
    direction_hint?: string;
  }>;
  metadata?: {
    analysis_method: string;
    confidence: number;
    time_of_day_estimate?: string;
  };
}

// Usage in Three.js scene:
<ambientLight
  intensity={sceneLighting.ambient.intensity}
  color={sceneLighting.ambient.color}
/>
{sceneLighting.directional_lights.map((light, i) => (
  <directionalLight
    key={i}
    position={light.position}
    intensity={light.intensity}
    color={light.color}
  />
))}
```

## Success Criteria

1. API returns valid `scene_lighting` object for all detection requests
2. Lighting values produce visually coherent 3D overlays
3. No significant performance degradation (< 100ms additional processing time)
4. Lighting analysis works across various conditions:
   - Different times of day
   - Indoor vs outdoor parking
   - Overcast vs sunny conditions

## Testing

Provide test images with known lighting conditions:
- Bright sunny midday parking lot
- Overcast/cloudy conditions
- Evening/dusk lighting
- Indoor parking garage
- Night with artificial lighting

## Future Enhancements

- Image-Based Lighting (IBL) using the actual photo as environment map
- HDR analysis for more accurate intensity values
- Per-detection lighting (if cars are in different lighting zones)
- Shadow rendering for the 3D tire boot model

## Questions for Implementation

1. What computer vision library is currently used for detection? (OpenCV, etc.)
2. What's the acceptable processing time increase per image?
3. Should lighting analysis be optional via query parameter?
4. Should we cache lighting results separately from detections?

## Example Code Snippet (Python/OpenCV)

```python
import cv2
import numpy as np

def estimate_scene_lighting(image):
    """
    Estimate scene lighting from parking lot image
    Returns lighting parameters for 3D rendering
    """
    # Convert to HSV for better analysis
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Sample top 1/3 for sky color (ambient)
    height = image.shape[0]
    sky_region = image[:height//3, :]
    avg_color = np.mean(sky_region, axis=(0, 1))

    # Calculate brightness
    brightness = np.mean(hsv[:, :, 2]) / 255.0

    # Estimate ambient
    ambient = {
        "intensity": 0.3 + (brightness * 0.5),
        "color": rgb_to_hex(avg_color)
    }

    # Simple directional light (can be enhanced)
    directional_lights = [
        {
            "position": [10, 15, 8],
            "intensity": 0.8 + (brightness * 0.6),
            "color": "#ffffff",
            "direction_hint": "primary_light"
        }
    ]

    return {
        "ambient": ambient,
        "directional_lights": directional_lights,
        "metadata": {
            "analysis_method": "histogram",
            "confidence": 0.7
        }
    }
```

## Contact

Frontend implementation: `/src/components/Viewer/index.tsx` (lines 175-177)
Current lighting values are hardcoded and need to be replaced with API response data.
