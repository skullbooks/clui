import styled from 'styled-components';

export enum RoundDisplayMode {
    Point = 'point',
    Bar = 'bar',
    CenterBar = 'center'
}

const CircularBar = styled.div`
  float: left;
  margin: 0;
  background: transparent;
  border: 20px solid #aaa;
  border-radius: 2000px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
`
const EmptyBar = styled(CircularBar)`
  border-color: #333;
`

const DisplayMask = styled.div`
  position: relative;
`

function buildPolygonStringBar(deg: number) {
    let polygonString = '0%0%,';
    let percent = Math.floor(((deg%90)*100)/90);
    if (deg < 90) polygonString += `${percent}%0%,`;
    else if (90 <= deg) polygonString += '100%0%,';
    if (90 < deg && deg < 180) polygonString += `100%${percent}%,`;
    else if (180 <= deg) polygonString += '100%100%,';
    if (180 < deg && deg < 270) polygonString += `${100-percent}%100%,`;
    else if (270 <= deg) polygonString += '0%100%,';
    if (270 < deg && deg < 360) polygonString += `0%${100-percent}%,`;
    else if (360 === deg) polygonString += '0%0%,';
    polygonString += '50%50%';
    return polygonString;
}

function RoundDisplay({
    displaySize = 200,
    zero = 0,
    min = 0,
    max = 10,
    mode = RoundDisplayMode.Bar,
    value = 1,
    width = 150,
    height = null,
    rangeColor = '#333',
    valueColor = '#aaa',
    strokeWidth = 14
}:{
    displaySize?: number,
    zero?: number,
    min?: number,
    max?: number,
    mode?: RoundDisplayMode,
    value?: number,
    width?: number,
    height?: number|null,
    rangeColor?: string,
    valueColor?: string,
    strokeWidth?: number,
}) {

    const valueDeg = (mode === RoundDisplayMode.Point) ? (value*(displaySize-15))/(max-min) : (value*displaySize)/(max-min);
    const polygonStringValue = (mode === RoundDisplayMode.Point) ? buildPolygonStringBar(20) : buildPolygonStringBar(valueDeg);
    const rotationValue = (mode === RoundDisplayMode.CenterBar) ? zero+45+((displaySize/2)-(valueDeg/2)) : (mode === RoundDisplayMode.Point) ? (zero+45)+valueDeg : zero+45;
    const polygonStringRange = buildPolygonStringBar(displaySize);

    height = (height) ? height : width;

    return (
    <>
    <DisplayMask style={{ width: width, height: height }}>
    <EmptyBar style={{ 
        clipPath: `polygon(${polygonStringRange})`, 
        transform: `rotate(${zero+45}deg)`, 
        width: width, height: width,
        borderColor: rangeColor,
        borderWidth: strokeWidth
    }} />
    <CircularBar style={{ 
        clipPath: `polygon(${polygonStringValue})`, 
        transform: `rotate(${rotationValue}deg)`, 
        width: width, height: width,
        borderColor: valueColor,
        borderWidth: strokeWidth 
    }} />
    </DisplayMask>
    </>
    );
}

export default RoundDisplay;