export const SENSOR_UNITS = {
  // Temperature
  CELSIUS: '°C',
  FAHRENHEIT: '°F',
  KELVIN: 'K',
  
  // Humidity
  PERCENTAGE: '%',
  RELATIVE_HUMIDITY: '%RH',
  
  // Pressure
  PASCAL: 'Pa',
  HECTOPASCAL: 'hPa',
  KILOPASCAL: 'kPa',
  BAR: 'bar',
  PSI: 'psi',
  
  // Light
  LUX: 'lx',
  FOOT_CANDLE: 'fc',
  WATT_PER_SQUARE_METER: 'W/m²',
  
  // Sound
  DECIBEL: 'dB',
  DECIBEL_A: 'dBA',
  DECIBEL_C: 'dBC',
  
  // Gas
  PPM: 'ppm',
  PPB: 'ppb',
  MG_PER_CUBIC_METER: 'mg/m³',
  UG_PER_CUBIC_METER: 'μg/m³',
  
  // pH
  PH: 'pH',
  
  // Electrical
  VOLT: 'V',
  AMPERE: 'A',
  WATT: 'W',
  KILOWATT: 'kW',
  KILOWATT_HOUR: 'kWh',
  OHM: 'Ω',
  HERTZ: 'Hz',
  
  // Distance
  METER: 'm',
  CENTIMETER: 'cm',
  MILLIMETER: 'mm',
  KILOMETER: 'km',
  INCH: 'in',
  FOOT: 'ft',
  
  // Speed
  METER_PER_SECOND: 'm/s',
  KILOMETER_PER_HOUR: 'km/h',
  MILE_PER_HOUR: 'mph',
  
  // Flow
  LITER_PER_MINUTE: 'L/min',
  CUBIC_METER_PER_HOUR: 'm³/h',
  GALLON_PER_MINUTE: 'gpm',
  
  // Level
  PERCENT: '%',
  METER: 'm',
  CENTIMETER: 'cm',
  
  // Vibration
  METER_PER_SECOND_SQUARED: 'm/s²',
  G: 'g',
  
  // Force
  NEWTON: 'N',
  KILONEWTON: 'kN',
  POUND_FORCE: 'lbf',
  
  // Torque
  NEWTON_METER: 'N⋅m',
  FOOT_POUND: 'ft⋅lb',
  
  // Frequency
  HERTZ: 'Hz',
  KILOHERTZ: 'kHz',
  MEGAHERTZ: 'MHz',
  
  // Time
  SECOND: 's',
  MINUTE: 'min',
  HOUR: 'h',
  
  // Count
  COUNT: 'count',
  PULSES: 'pulses',
  
  // Custom
  CUSTOM: 'custom',
  NONE: '',
} as const;

export type SensorUnit = typeof SENSOR_UNITS[keyof typeof SENSOR_UNITS];

export const SENSOR_UNIT_LABELS: Record<SensorUnit, string> = {
  [SENSOR_UNITS.CELSIUS]: 'Celsius',
  [SENSOR_UNITS.FAHRENHEIT]: 'Fahrenheit',
  [SENSOR_UNITS.KELVIN]: 'Kelvin',
  [SENSOR_UNITS.PERCENTAGE]: 'Percentage',
  [SENSOR_UNITS.RELATIVE_HUMIDITY]: 'Relative Humidity',
  [SENSOR_UNITS.PASCAL]: 'Pascal',
  [SENSOR_UNITS.HECTOPASCAL]: 'Hectopascal',
  [SENSOR_UNITS.KILOPASCAL]: 'Kilopascal',
  [SENSOR_UNITS.BAR]: 'Bar',
  [SENSOR_UNITS.PSI]: 'PSI',
  [SENSOR_UNITS.LUX]: 'Lux',
  [SENSOR_UNITS.FOOT_CANDLE]: 'Foot-candle',
  [SENSOR_UNITS.WATT_PER_SQUARE_METER]: 'Watt per square meter',
  [SENSOR_UNITS.DECIBEL]: 'Decibel',
  [SENSOR_UNITS.DECIBEL_A]: 'Decibel A-weighted',
  [SENSOR_UNITS.DECIBEL_C]: 'Decibel C-weighted',
  [SENSOR_UNITS.PPM]: 'Parts per million',
  [SENSOR_UNITS.PPB]: 'Parts per billion',
  [SENSOR_UNITS.MG_PER_CUBIC_METER]: 'Milligram per cubic meter',
  [SENSOR_UNITS.UG_PER_CUBIC_METER]: 'Microgram per cubic meter',
  [SENSOR_UNITS.PH]: 'pH',
  [SENSOR_UNITS.VOLT]: 'Volt',
  [SENSOR_UNITS.AMPERE]: 'Ampere',
  [SENSOR_UNITS.WATT]: 'Watt',
  [SENSOR_UNITS.KILOWATT]: 'Kilowatt',
  [SENSOR_UNITS.KILOWATT_HOUR]: 'Kilowatt-hour',
  [SENSOR_UNITS.OHM]: 'Ohm',
  [SENSOR_UNITS.HERTZ]: 'Hertz',
  [SENSOR_UNITS.METER]: 'Meter',
  [SENSOR_UNITS.CENTIMETER]: 'Centimeter',
  [SENSOR_UNITS.MILLIMETER]: 'Millimeter',
  [SENSOR_UNITS.KILOMETER]: 'Kilometer',
  [SENSOR_UNITS.INCH]: 'Inch',
  [SENSOR_UNITS.FOOT]: 'Foot',
  [SENSOR_UNITS.METER_PER_SECOND]: 'Meter per second',
  [SENSOR_UNITS.KILOMETER_PER_HOUR]: 'Kilometer per hour',
  [SENSOR_UNITS.MILE_PER_HOUR]: 'Mile per hour',
  [SENSOR_UNITS.LITER_PER_MINUTE]: 'Liter per minute',
  [SENSOR_UNITS.CUBIC_METER_PER_HOUR]: 'Cubic meter per hour',
  [SENSOR_UNITS.GALLON_PER_MINUTE]: 'Gallon per minute',
  [SENSOR_UNITS.PERCENT]: 'Percent',
  [SENSOR_UNITS.METER_PER_SECOND_SQUARED]: 'Meter per second squared',
  [SENSOR_UNITS.G]: 'G-force',
  [SENSOR_UNITS.NEWTON]: 'Newton',
  [SENSOR_UNITS.KILONEWTON]: 'Kilonewton',
  [SENSOR_UNITS.POUND_FORCE]: 'Pound-force',
  [SENSOR_UNITS.NEWTON_METER]: 'Newton-meter',
  [SENSOR_UNITS.FOOT_POUND]: 'Foot-pound',
  [SENSOR_UNITS.KILOHERTZ]: 'Kilohertz',
  [SENSOR_UNITS.MEGAHERTZ]: 'Megahertz',
  [SENSOR_UNITS.SECOND]: 'Second',
  [SENSOR_UNITS.MINUTE]: 'Minute',
  [SENSOR_UNITS.HOUR]: 'Hour',
  [SENSOR_UNITS.COUNT]: 'Count',
  [SENSOR_UNITS.PULSES]: 'Pulses',
  [SENSOR_UNITS.CUSTOM]: 'Custom',
  [SENSOR_UNITS.NONE]: 'None',
};

export const SENSOR_UNIT_CATEGORIES = {
  TEMPERATURE: [
    SENSOR_UNITS.CELSIUS,
    SENSOR_UNITS.FAHRENHEIT,
    SENSOR_UNITS.KELVIN,
  ],
  HUMIDITY: [
    SENSOR_UNITS.PERCENTAGE,
    SENSOR_UNITS.RELATIVE_HUMIDITY,
  ],
  PRESSURE: [
    SENSOR_UNITS.PASCAL,
    SENSOR_UNITS.HECTOPASCAL,
    SENSOR_UNITS.KILOPASCAL,
    SENSOR_UNITS.BAR,
    SENSOR_UNITS.PSI,
  ],
  LIGHT: [
    SENSOR_UNITS.LUX,
    SENSOR_UNITS.FOOT_CANDLE,
    SENSOR_UNITS.WATT_PER_SQUARE_METER,
  ],
  SOUND: [
    SENSOR_UNITS.DECIBEL,
    SENSOR_UNITS.DECIBEL_A,
    SENSOR_UNITS.DECIBEL_C,
  ],
  GAS: [
    SENSOR_UNITS.PPM,
    SENSOR_UNITS.PPB,
    SENSOR_UNITS.MG_PER_CUBIC_METER,
    SENSOR_UNITS.UG_PER_CUBIC_METER,
  ],
  ELECTRICAL: [
    SENSOR_UNITS.VOLT,
    SENSOR_UNITS.AMPERE,
    SENSOR_UNITS.WATT,
    SENSOR_UNITS.KILOWATT,
    SENSOR_UNITS.KILOWATT_HOUR,
    SENSOR_UNITS.OHM,
    SENSOR_UNITS.HERTZ,
  ],
  DISTANCE: [
    SENSOR_UNITS.METER,
    SENSOR_UNITS.CENTIMETER,
    SENSOR_UNITS.MILLIMETER,
    SENSOR_UNITS.KILOMETER,
    SENSOR_UNITS.INCH,
    SENSOR_UNITS.FOOT,
  ],
  SPEED: [
    SENSOR_UNITS.METER_PER_SECOND,
    SENSOR_UNITS.KILOMETER_PER_HOUR,
    SENSOR_UNITS.MILE_PER_HOUR,
  ],
  FLOW: [
    SENSOR_UNITS.LITER_PER_MINUTE,
    SENSOR_UNITS.CUBIC_METER_PER_HOUR,
    SENSOR_UNITS.GALLON_PER_MINUTE,
  ],
  LEVEL: [
    SENSOR_UNITS.PERCENT,
    SENSOR_UNITS.METER,
    SENSOR_UNITS.CENTIMETER,
  ],
  VIBRATION: [
    SENSOR_UNITS.METER_PER_SECOND_SQUARED,
    SENSOR_UNITS.G,
  ],
  FORCE: [
    SENSOR_UNITS.NEWTON,
    SENSOR_UNITS.KILONEWTON,
    SENSOR_UNITS.POUND_FORCE,
  ],
  TORQUE: [
    SENSOR_UNITS.NEWTON_METER,
    SENSOR_UNITS.FOOT_POUND,
  ],
  FREQUENCY: [
    SENSOR_UNITS.HERTZ,
    SENSOR_UNITS.KILOHERTZ,
    SENSOR_UNITS.MEGAHERTZ,
  ],
  TIME: [
    SENSOR_UNITS.SECOND,
    SENSOR_UNITS.MINUTE,
    SENSOR_UNITS.HOUR,
  ],
  COUNT: [
    SENSOR_UNITS.COUNT,
    SENSOR_UNITS.PULSES,
  ],
  OTHER: [
    SENSOR_UNITS.PH,
    SENSOR_UNITS.CUSTOM,
    SENSOR_UNITS.NONE,
  ],
} as const;

export const getSensorUnitInfo = (unit: SensorUnit) => ({
  symbol: unit,
  label: SENSOR_UNIT_LABELS[unit],
  category: Object.entries(SENSOR_UNIT_CATEGORIES).find(([_, units]) => 
    units.includes(unit)
  )?.[0] || 'OTHER',
});

export const SENSOR_UNIT_OPTIONS = Object.entries(SENSOR_UNIT_LABELS).map(([value, label]) => ({
  value,
  label: `${label} (${value})`,
  symbol: value,
  category: Object.entries(SENSOR_UNIT_CATEGORIES).find(([_, units]) => 
    units.includes(value as SensorUnit)
  )?.[0] || 'OTHER',
}));

export const getUnitsByCategory = (category: keyof typeof SENSOR_UNIT_CATEGORIES) => {
  return SENSOR_UNIT_CATEGORIES[category];
}; 