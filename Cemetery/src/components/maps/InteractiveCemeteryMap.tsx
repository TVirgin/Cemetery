// src/components/maps/InteractiveCemeteryMap.tsx
import * as React from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { Button } from "@/components/ui/button"; // Assuming you use Shadcn Button
import { PlotIdentifier } from '@/pages/records/records.types';
// Ensure PlotIdentifier and parsePlotDomId are correctly defined and imported
// If they are in mapUtils.ts:
// import { PlotIdentifier, parsePlotDomId } from './mapUtils';
// Or define them here if local:
// export interface PlotIdentifier {
//   block: string;
//   lot?: number;
//   pos?: number;
//   plot?: number;
//   rawId: string;
// }

export const parsePlotDomId = (domId: string): PlotIdentifier | null => {
  // First, check for the more granular plot-BLOCK-ROW-POS format if you add it later
  if (domId.startsWith('plot-')) {
    const parts = domId.substring(5).split('-');
    if (parts.length === 3) {
      const block = parts[0];
      const lot = parseInt(parts[1], 10);
      const pos = parseInt(parts[2], 10);
      if (block && !isNaN(lot) && !isNaN(pos)) {
        return { block, lot, sect: pos, rawId: domId };
      }
    }
  }

  // Handle simple IDs like "1E", "A", "1", "9", etc., as block identifiers.
  // We can add a check to ignore certain IDs if needed (e.g., "image1", "g6").
  if (domId && !domId.startsWith('image') && !domId.startsWith('g') && !domId.startsWith('layer')) {
    // Treat any other valid ID as a block/ward ID.
    return { block: domId, rawId: domId };
  }

  return null; // Return null for IDs we want to ignore (like group or image IDs)
};


interface InteractiveCemeteryMapProps {
  // SvgMapOverlayComponent is your CemeteryMapSVG component
  SvgMapOverlayComponent: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { ref?: React.Ref<SVGSVGElement> }>;
  selectedPlotId?: string | null; // e.g., "wardA", "ward1" matching an ID in your SVG
  onPlotClick: (plotIdentifier: PlotIdentifier) => void;
  highlightClass?: string;
}

export const InteractiveCemeteryMap: React.FC<InteractiveCemeteryMapProps> = ({
  SvgMapOverlayComponent,
  selectedPlotId,
  onPlotClick,
  highlightClass = "plot-highlighted",
}) => {
  const svgRootRef = React.useRef<SVGSVGElement>(null);
  const lastHighlightedElementRef = React.useRef<Element | null>(null);
  const transformWrapperRef = React.useRef<ReactZoomPanPinchRef | null>(null);

  React.useEffect(() => {
    if (lastHighlightedElementRef.current) {
      lastHighlightedElementRef.current.classList.remove(highlightClass);
    }
    lastHighlightedElementRef.current = null;

    if (selectedPlotId && svgRootRef.current) {
      const plotElement = svgRootRef.current.querySelector(`#${selectedPlotId}`);
      if (plotElement) {
        plotElement.classList.add(highlightClass);
        lastHighlightedElementRef.current = plotElement;

        // Optional: Centering logic (can be complex, ensure BBox is available)
        const T = transformWrapperRef.current;
        if (T && typeof (plotElement as any).getBBox === 'function' && T.instance.wrapperComponent) {
            const BBox = (plotElement as SVGGElement).getBBox();
            if (BBox && BBox.width > 0 && BBox.height > 0) { // Ensure BBox has valid dimensions
                const currentScale = T.state.scale;
                // Center the BBox of the element within the viewport of the TransformWrapper
                const targetX = -(BBox.x + BBox.width / 2) * currentScale + T.instance.wrapperComponent.clientWidth / 2;
                const targetY = -(BBox.y + BBox.height / 2) * currentScale + T.instance.wrapperComponent.clientHeight / 2;
                T.setTransform(targetX, targetY, currentScale, 300, "easeOut");
            }
        }
      }
    }
  }, [selectedPlotId, highlightClass, SvgMapOverlayComponent]);

  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    let target = event.target as Element;
    while (target && target !== svgRootRef.current) {
      if (target.id) {
        const plotIdentifier = parsePlotDomId(target.id);
        if (plotIdentifier) {
          onPlotClick(plotIdentifier);
          return;
        }
      }
      target = target.parentElement as Element;
    }
  };

  // Style for the SVG component to ensure it behaves correctly within TransformComponent
  const svgComponentStyle: React.CSSProperties = {
    width: '100%',  // Make SVG fill the container for TransformComponent to work with
    height: '100%',
    // The SVG's intrinsic aspect ratio will be maintained by its viewBox
    // The objectFit on the TransformComponent's content can also influence this.
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] border rounded-md overflow-hidden relative bg-gray-200 shadow-inner">
      <TransformWrapper
        ref={transformWrapperRef}
        initialScale={1} // Start without zoom
        minScale={0.1}   // Allow zooming out significantly
        maxScale={8}
        limitToBounds={true} // Important: Prevents panning outside content boundaries
        doubleClick={{ disabled: true }}
        wheel={{ step: 0.1 }}
        centerOnInit      // This should center the SVG content initially
        // initialPositionX and initialPositionY could be used if centerOnInit isn't perfect
      >
        {({ zoomIn, zoomOut, resetTransform, centerView }) => ( // Added centerView
          <>
            <div className="absolute top-2 right-2 z-10 space-x-1 bg-white/80 p-1 rounded shadow-md">
              <Button variant="outline" size="sm" onClick={() => zoomIn(0.2)} className="p-1.5 text-xs h-auto">Zoom In</Button>
              <Button variant="outline" size="sm" onClick={() => zoomOut(0.2)} className="p-1.5 text-xs h-auto">Zoom Out</Button>
              <Button variant="outline" size="sm" onClick={() => { resetTransform(200); centerView(1, 200);}} className="p-1.5 text-xs h-auto">Reset View</Button>
            </div>
            <TransformComponent
              // These classes ensure the direct child of TransformWrapper takes full space for panning calculations
              wrapperClass="!w-full !h-full"
              // contentClass ensures the SVG itself can be positioned within this wrapper
              contentClass="!w-full !h-full flex items-center justify-center" // Helps center the SVG if its aspect ratio differs from wrapper
            >
              {/* SvgMapOverlayComponent is your CemeteryMapSVG which includes the background image */}
              <SvgMapOverlayComponent
                ref={svgRootRef}
                onClick={handleMapClick}
                style={svgComponentStyle} // Apply style for sizing
                // Your CemeteryMapSVG component has intrinsic width, height, and viewBox.
                // react-zoom-pan-pinch will work with these.
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};