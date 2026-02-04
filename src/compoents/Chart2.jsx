import * as React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const settings = {
  width: 200,
  height: 200,
  value: 60,
 
};

export default function ArcDesign() {
  return (
    <Gauge
      {...settings}
      cornerRadius="50%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 40,
          color: '#FFFFFF',
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: '#840032',
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: "#EFC3CA",
        },
      })}
    />
  );
}
