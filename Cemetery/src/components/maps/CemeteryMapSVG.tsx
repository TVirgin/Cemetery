// src/components/maps/CemeteryMapSVG.tsx
import * as React from 'react';
// Make sure these import paths are correct for your project structure
import { base64MapImage1 } from './image64Data1';
import { base64MapImage2 } from './image64Data2';

// This interface allows the component to accept standard SVG props like className, style, onClick, etc.
interface CemeteryMapSVGProps extends React.SVGProps<SVGSVGElement> {}

// We use React.forwardRef so the parent component (InteractiveCemeteryMap) can get a reference
// to the root <svg> element, which is essential for highlighting and click detection.
export const CemeteryMapSVG = React.forwardRef<SVGSVGElement, CemeteryMapSVGProps>(
  (props, ref) => {
    // Spread any props passed from the parent onto the root <svg> element.
    const { className, style, onClick } = props;

    const textStyle: React.CSSProperties = {
        fontSize: '10px', // Adjust font size as needed
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fill: 'rgb(255, 255, 255)', // Dark text, slightly transparent
        textAnchor: 'middle', // Horizontal centering
        dominantBaseline: 'middle', // Vertical centering
        pointerEvents: 'none', // Allows clicks to pass through to the rectangle below
    };

    return (
      <svg
        ref={ref}           
        onClick={onClick}   
        style={style}       
        className={className}
        width="577.8584mm"
        height="697.46033mm"
        viewBox="0 0 577.85841 697.46032"
        version="1.1"
        id="svg1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        //{...restOfProps} // This applies onClick, className, style, etc. from the parent
      >
        <g
          id="layer1"
          transform="translate(133.7639,334.11701)"
        >
          {/* Group containing the two background images */}
          <g
            id="g5"
          >
            <image
              width="436.5625"
              height="436.5625"
              preserveAspectRatio="none"
              style={{ imageRendering: 'auto' }}
              xlinkHref={base64MapImage1}
              id="image1"
              x="-23.081678"
              y="-116.13659"
            />
            <image
              width="489.75769"
              height="436.5625"
              preserveAspectRatio="none"
              style={{ imageRendering: 'auto' }}
              xlinkHref={base64MapImage2}
              id="image1-2"
              x="-133.7639"
              y="-334.117"
            />
          </g>

          {/* Group containing all the plot/ward overlay rectangles */}
          <g id="g6">
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.21214, strokeOpacity: 0.43 }} id="1E" width="16.119999" height="168.37979" x="375.8656" y="136.97226" />
            <text style={textStyle} x={375.8656 + 16.119999 / 2} y={136.97226 + 168.37979 / 2}>1E</text>

            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.43631, strokeOpacity: 0.43 }} id="1" width="16.119999" height="192.70132" x="359.40179" y="113.02491" />
            <text style={textStyle} x={359.40179 + 16.119999 / 2} y={113.02491 + 192.70132 / 2}>1</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.49912, strokeOpacity: 0.43 }} id="2" width="16.119999" height="199.8107" x="334.70609" y="105.54136" />
            <text style={textStyle} x={334.70609 + 16.119999 / 2} y={105.54136 + 199.8107 / 2}>2</text>

            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.49912, strokeOpacity: 0.43 }} id="3" width="16.119999" height="199.8107" x="302.901" y="105.54136" />
            <text style={textStyle} x={302.901 + 16.119999 / 2} y={105.54136 + 199.8107 / 2}>3</text>

            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.73484, strokeOpacity: 0.43 }} id="4" width="18.365063" height="199.8107" x="277.45694" y="105.54136" />
            <text style={textStyle} x={277.45694 + 18.365063 / 2} y={105.54136 + 199.8107 / 2}>4</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.6189, strokeOpacity: 0.43 }} id="5" width="17.242531" height="199.8107" x="241.91008" y="102.92212" />
            <text style={textStyle} x={241.91008 + 17.242531 / 2} y={102.92212 + 199.8107 / 2}>5</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.49912, strokeOpacity: 0.43 }} id="6" width="16.119999" height="199.8107" x="217.96274" y="103.67047" />
            <text style={textStyle} x={217.96274 + 16.119999 / 2} y={103.67047 + 199.8107 / 2}>6</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.49912, strokeOpacity: 0.43 }} id="7" width="16.119999" height="199.8107" x="180.17082" y="101.05123" />
            <text style={textStyle} x={180.17082 + 16.119999 / 2} y={101.05123 + 199.8107 / 2}>7</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.66603, strokeOpacity: 0.43 }} id="15" width="16.119999" height="355.30109" x="156.22348" y="-51.819923" />
            <text style={textStyle} x={156.22348 + 16.119999 / 2} y={-51.819923 + 355.30109 / 2}>15</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.69054, strokeOpacity: 0.43 }} id="16" width="16.119999" height="359.04285" x="118.43156" y="-56.477425" />
            <text style={textStyle} x={118.43156 + 16.119999 / 2} y={-56.477425 + 359.04285 / 2}>16</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.66603, strokeOpacity: 0.43 }} id="17" width="16.119999" height="355.30109" x="95.232574" y="-54.064987" />
            <text style={textStyle} x={95.232574 + 16.119999 / 2} y={-54.064987 + 355.30109 / 2}>17</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.69298, strokeOpacity: 0.43 }} id="18" width="16.119999" height="359.41702" x="57.440651" y="-58.722488" />
            <text style={textStyle} x={57.440651 + 16.119999 / 2} y={-58.722488 + 359.41702 / 2}>18</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.19632, strokeOpacity: 0.43 }} id="A" width="16.119999" height="287.36819" x="319.73898" y="17.983864" />
            <text style={textStyle} x={319.73898 + 16.119999 / 2} y={17.983864 + 287.36819 / 2}>A</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.65975, strokeOpacity: 0.43 }} id="B" width="16.119999" height="354.34595" x="260.61896" y="-49.742233" />
            <text style={textStyle} x={260.61896 + 16.119999 / 2} y={-49.742233 + 354.34595 / 2}>B</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.65975, strokeOpacity: 0.43 }} id="C" width="16.119999" height="354.34595" x="199.25388" y="-52.361473" />
            <text style={textStyle} x={199.25388 + 16.119999 / 2} y={-52.361473 + 354.34595 / 2}>C</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.65975, strokeOpacity: 0.43 }} id="D" width="16.119999" height="354.34595" x="137.14044" y="-52.735649" />
            <text style={textStyle} x={137.14044 + 16.119999 / 2} y={-52.735649 + 354.34595 / 2}>D</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.65975, strokeOpacity: 0.43 }} id="E" width="16.119999" height="354.34595" x="76.523712" y="-51.238941" />
            <text style={textStyle} x={76.523712 + 16.119999 / 2} y={-51.238941 + 354.34595 / 2}>E</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 2.00884, strokeOpacity: 0.43 }} id="9" width="16.119999" height="65.855217" x="335.82861" y="39.68615" />
            <text style={textStyle} x={335.82861 + 16.119999 / 2} y={39.68615 + 65.855217 / 2}>9</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 2.5019, strokeOpacity: 0.43 }} id="10" width="16.119999" height="102.15042" x="302.901" y="1.8942407" />
            <text style={textStyle} x={302.901 + 16.119999 / 2} y={1.8942407 + 102.15042 / 2}>10</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.10045, strokeOpacity: 0.43 }} id="11" width="18.365063" height="137.69727" x="277.08276" y="-32.904255" />
            <text style={textStyle} x={277.08276 + 18.365063 / 2} y={-32.904255 + 137.69727 / 2}>11</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.2726, strokeOpacity: 0.43 }} id="12" width="18.365063" height="153.41272" x="241.53592" y="-50.116409" />
            <text style={textStyle} x={241.53592 + 18.365063 / 2} y={-50.116409 + 153.41272 / 2}>12</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.03977, strokeOpacity: 0.43 }} id="13" width="16.119999" height="150.79347" x="218.33691" y="-48.245525" />
            <text style={textStyle} x={218.33691 + 16.119999 / 2} y={-48.245525 + 150.79347 / 2}>13</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 3.03977, strokeOpacity: 0.43 }} id="14" width="16.119999" height="150.79347" x="179.79665" y="-51.238945" />
            <text style={textStyle} x={179.79665 + 16.119999 / 2} y={-51.238945 + 150.79347 / 2}>14</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 8.78841, strokeOpacity: 0.43 }} id="rect4" width="56.531151" height="359.41702" x="-5.0469623" y="-59.84502" />
            <text style={textStyle} x={-5.0469623 + 56.531151 / 2} y={-59.84502 + 359.41702 / 2}>H</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 7.00967, strokeOpacity: 0.43 }} id="G" width="79.355972" height="160.35469" x="188.40271" y="-220.74127" />
            <text style={textStyle} x={188.40271 + 79.355972 / 2} y={-220.74127 + 160.35469 / 2}>G</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 7.41692, strokeOpacity: 0.43 }} id="M" width="55.782799" height="255.39574" x="117.30902" y="-317.6532" />
            <text style={textStyle} x={117.30902 + 55.782799 / 2} y={-317.6532 + 255.39574 / 2}>M</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 6.75734, strokeOpacity: 0.43 }} id="N" width="55.782799" height="211.99117" x="56.318115" y="-275.74533" />
            <text style={textStyle} x={56.318115 + 55.782799 / 2} y={-275.74533 + 211.99117 / 2}>K</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.54826, strokeOpacity: 0.43 }} id="J" width="33.332157" height="160.72887" x="17.029495" y="-224.48303" />
            <text style={textStyle} x={17.029495 + 33.332157 / 2} y={-224.48303 + 160.72887 / 2}>J</text>
            
            <rect className="plot-interaction-layer" style={{ fill: '#181767', fillOpacity: 0.430851, strokeWidth: 4.32443, strokeOpacity: 0.43 }} id="TB" width="46.80254" height="103.47974" x="-35.729507" y="-166.48555" />
            <text style={textStyle} x={-35.729507 + 46.80254 / 2} y={-166.48555 + 103.47974 / 2}>TB</text>
          </g>
        </g>
      </svg>
    );
  }
);

CemeteryMapSVG.displayName = "CemeteryMapSVG";

export default CemeteryMapSVG;