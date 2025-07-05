export interface NumberFormatterOptions {
  decimals?: number;
  locale?: string;
  currency?: string;
  unit?: string;
  compact?: boolean;
  percentage?: boolean;
}

export const formatNumber = (
  value: number,
  options: NumberFormatterOptions = {}
): string => {
  const {
    decimals = 2,
    locale = 'en-US',
    currency,
    unit,
    compact = false,
    percentage = false
  } = options;

  if (isNaN(value) || !isFinite(value)) {
    return 'Invalid number';
  }

  try {
    let formattedValue: string;

    if (percentage) {
      formattedValue = new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value / 100);
    } else if (currency) {
      formattedValue = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value);
    } else if (compact) {
      formattedValue = new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: decimals
      }).format(value);
    } else {
      formattedValue = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value);
    }

    return unit ? `${formattedValue} ${unit}` : formattedValue;
  } catch (error) {
    console.error('Number formatting error:', error);
    return value.toString();
  }
};

export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US',
  decimals = 2
): string => {
  return formatNumber(value, { currency, locale, decimals });
};

export const formatPercentage = (
  value: number,
  decimals = 2,
  locale = 'en-US'
): string => {
  return formatNumber(value, { percentage: true, decimals, locale });
};

export const formatCompactNumber = (
  value: number,
  decimals = 1,
  locale = 'en-US'
): string => {
  return formatNumber(value, { compact: true, decimals, locale });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return `${minutes}m ${Math.round(remainingSeconds)}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return `${hours}h ${remainingMinutes}m`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return `${days}d ${remainingHours}h`;
};

export const formatTemperature = (
  value: number,
  unit: 'C' | 'F' | 'K' = 'C',
  decimals = 1
): string => {
  const symbol = unit === 'C' ? '°C' : unit === 'F' ? '°F' : 'K';
  return formatNumber(value, { decimals, unit: symbol });
};

export const formatHumidity = (value: number, decimals = 1): string => {
  return formatNumber(value, { decimals, unit: '%' });
};

export const formatPressure = (value: number, decimals = 1): string => {
  return formatNumber(value, { decimals, unit: 'hPa' });
};

export const formatVoltage = (value: number, decimals = 2): string => {
  return formatNumber(value, { decimals, unit: 'V' });
};

export const formatCurrent = (value: number, decimals = 2): string => {
  return formatNumber(value, { decimals, unit: 'A' });
};

export const formatPower = (value: number, decimals = 2): string => {
  return formatNumber(value, { decimals, unit: 'W' });
};

export const formatEnergy = (value: number, decimals = 2): string => {
  return formatNumber(value, { decimals, unit: 'kWh' });
};

export const formatFrequency = (value: number, decimals = 1): string => {
  return formatNumber(value, { decimals, unit: 'Hz' });
};

export const formatDistance = (value: number, decimals = 2): string => {
  return formatNumber(value, { decimals, unit: 'm' });
};

export const formatSpeed = (value: number, decimals = 1): string => {
  return formatNumber(value, { decimals, unit: 'm/s' });
};

export const formatAngle = (value: number, decimals = 1): string => {
  return formatNumber(value, { decimals, unit: '°' });
}; 