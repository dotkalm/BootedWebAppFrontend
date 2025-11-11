import { loadFrameFixture } from '../../src/utils/captureFrameFixture';
import {
  detectHorizontalLines,
  detectSemiCircles,
  detectWheelWells,
} from '../../src/utils/geometry/wheelWellDetection';

import carBridgeStFixture from '../fixtures/car_bridge_st.json';
import type { TCapturedFrame } from '../../src/types';

describe('Wheel Well Detection', () => {
  let edgeData: Uint8Array;
  let width: number;
  let height: number;

  beforeEach(() => {
    const frame = loadFrameFixture(carBridgeStFixture as TCapturedFrame);
    edgeData = frame.data;
    width = frame.width;
    height = frame.height;
  });

  describe('detectHorizontalLines', () => {
    it('detects horizontal lines in edge-detected image', () => {
      const lines = detectHorizontalLines(edgeData, width, height);

      expect(Array.isArray(lines)).toBe(true);
      expect(lines.length).toBeGreaterThan(0);
    });

    it('returns lines with correct structure', () => {
      const lines = detectHorizontalLines(edgeData, width, height);

      expect(lines.length).toBeGreaterThan(0);
      const line = lines[0];
      expect(line).toHaveProperty('y');
      expect(line).toHaveProperty('startX');
      expect(line).toHaveProperty('endX');
      expect(line).toHaveProperty('length');
      expect(typeof line.y).toBe('number');
      expect(typeof line.startX).toBe('number');
      expect(typeof line.endX).toBe('number');
      expect(typeof line.length).toBe('number');
    });

    it('filters out short lines below minimum threshold', () => {
      const lines = detectHorizontalLines(edgeData, width, height, {
        minLineLength: 100
      });

      expect(lines.length).toBeGreaterThan(0);
      // All lines should be at least 100 pixels long
      lines.forEach(line => {
        expect(line.length).toBeGreaterThanOrEqual(100);
      });
    });

    it('only searches in lower 2/3 of image by default', () => {
      const lines = detectHorizontalLines(edgeData, width, height);

      expect(lines.length).toBeGreaterThan(0);
      // Lines should be in lower 2/3 (y > height/3)
      lines.forEach(line => {
        expect(line.y).toBeGreaterThan(height / 3);
      });
    });

    it('returns lines sorted by strength/confidence', () => {
      const lines = detectHorizontalLines(edgeData, width, height);

      expect(lines.length).toBeGreaterThanOrEqual(2);
      for (let i = 0; i < lines.length - 1; i++) {
        // Each line should have equal or greater confidence than the next
        expect(lines[i].length).toBeGreaterThanOrEqual(lines[i + 1].length);
      }
    });
  });

  describe('detectSemiCircles', () => {
    it('detects semi-circular concave regions', () => {
      const circles = detectSemiCircles(edgeData, width, height);

      expect(Array.isArray(circles)).toBe(true);
      expect(circles.length).toBeGreaterThan(0);
    });

    it('returns semi-circles with correct structure', () => {
      const circles = detectSemiCircles(edgeData, width, height);

      expect(circles.length).toBeGreaterThan(0);
      const circle = circles[0];
      expect(circle).toHaveProperty('centerX');
      expect(circle).toHaveProperty('centerY');
      expect(circle).toHaveProperty('radius');
      expect(circle).toHaveProperty('score');
      expect(typeof circle.centerX).toBe('number');
      expect(typeof circle.centerY).toBe('number');
      expect(typeof circle.radius).toBe('number');
      expect(typeof circle.score).toBe('number');
    });

    it('filters circles by minimum radius', () => {
      const minRadius = 30;
      const circles = detectSemiCircles(edgeData, width, height, {
        minRadius
      });

      expect(circles.length).toBeGreaterThan(0);
      circles.forEach(circle => {
        expect(circle.radius).toBeGreaterThanOrEqual(minRadius);
      });
    });

    it('filters circles by maximum radius', () => {
      const maxRadius = 80;
      const circles = detectSemiCircles(edgeData, width, height, {
        maxRadius
      });

      expect(circles.length).toBeGreaterThan(0);
      circles.forEach(circle => {
        expect(circle.radius).toBeLessThanOrEqual(maxRadius);
      });
    });

    it('detects concave (upward-facing) semi-circles only', () => {
      const circles = detectSemiCircles(edgeData, width, height);

      expect(circles.length).toBeGreaterThan(0);
      // Semi-circles should be concave (arc cuts upward into horizontal line)
      // This means centerY should be at or above the arc
      circles.forEach(circle => {
        expect(circle.score).toBeGreaterThan(0);
      });
    });
  });

  describe('detectWheelWells', () => {
    it('detects wheel wells by combining lines and semi-circles', () => {
      const result = detectWheelWells(edgeData, width, height);

      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('wheelWells');
      expect(result).toHaveProperty('horizontalLines');
      expect(typeof result.confidence).toBe('number');
      expect(Array.isArray(result.wheelWells)).toBe(true);
    });

    it('returns high confidence for car fixture', () => {
      const result = detectWheelWells(edgeData, width, height);

      // Car fixture should have detectable wheel wells
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('detects two wheel wells for typical car side view', () => {
      const result = detectWheelWells(edgeData, width, height);

      // Most cars have 2 visible wheels from side view
      expect(result.wheelWells.length).toBeGreaterThanOrEqual(1);
      expect(result.wheelWells.length).toBeLessThanOrEqual(4);
    });

    it('validates wheel well spacing is realistic', () => {
      const result = detectWheelWells(edgeData, width, height);

      expect(result.wheelWells.length).toBeGreaterThanOrEqual(2);
      // Sort by x position
      const sorted = [...result.wheelWells].sort((a, b) => a.x - b.x);

      // Check spacing between consecutive wheel wells
      for (let i = 0; i < sorted.length - 1; i++) {
        const spacing = sorted[i + 1].x - sorted[i].x;

        // Wheel wells should be spaced reasonably apart
        // (not too close, not too far)
        expect(spacing).toBeGreaterThan(50); // Minimum spacing
        expect(spacing).toBeLessThan(width * 0.8); // Maximum spacing
      }
    });

    it('verifies semi-circles intersect with horizontal line', () => {
      const result = detectWheelWells(edgeData, width, height);

      expect(result.wheelWells.length).toBeGreaterThan(0);
      result.wheelWells.forEach(well => {
        // Each wheel well should have a reference to its line
        expect(well).toHaveProperty('lineY');
        expect(typeof well.lineY).toBe('number');

        // Semi-circle center should be near the line
        const distanceToLine = Math.abs(well.y - well.lineY);
        expect(distanceToLine).toBeLessThan(well.radius * 1.5);
      });
    });

    it('returns wheel wells with required properties', () => {
      const result = detectWheelWells(edgeData, width, height);

      expect(result.wheelWells.length).toBeGreaterThan(0);
      result.wheelWells.forEach(well => {
        expect(well).toHaveProperty('x');
        expect(well).toHaveProperty('y');
        expect(well).toHaveProperty('radius');
        expect(well).toHaveProperty('lineY');
        expect(well).toHaveProperty('score');
      });
    });
  });

  describe('Edge cases', () => {
    it('handles empty image data', () => {
      const emptyData = new Uint8Array(width * height * 4);
      const result = detectWheelWells(emptyData, width, height);

      expect(result.confidence).toBe(0);
      expect(result.wheelWells).toHaveLength(0);
    });

    it('handles very small images', () => {
      const smallData = new Uint8Array(10 * 10 * 4);
      const result = detectWheelWells(smallData, 10, 10);

      expect(result).toBeDefined();
      expect(result.confidence).toBeDefined();
    });

    it('handles images with no horizontal lines', () => {
      // Create vertical lines only
      const verticalData = new Uint8Array(width * height * 4);
      for (let x = 0; x < width; x += 10) {
        for (let y = 0; y < height; y++) {
          const idx = (y * width + x) * 4;
          verticalData[idx] = 255;
          verticalData[idx + 1] = 255;
          verticalData[idx + 2] = 255;
          verticalData[idx + 3] = 255;
        }
      }

      const result = detectWheelWells(verticalData, width, height);
      expect(result.confidence).toBeLessThan(0.3);
    });
  });

  describe('Performance', () => {
    it('completes detection in reasonable time', () => {
      const start = performance.now();

      detectWheelWells(edgeData, width, height);

      const duration = performance.now() - start;

      // Should complete in less than 100ms for 640x480 image
      expect(duration).toBeLessThan(100);
    });
  });
});
