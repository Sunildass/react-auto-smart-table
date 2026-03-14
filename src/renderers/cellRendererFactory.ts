import React from 'react';
import { ColumnType } from '../schema/schemaTypes';
import { NumberRenderer } from './numberRenderer';
import { EmailRenderer } from './emailRenderer';
import { UrlRenderer } from './urlRenderer';
import { ImageRenderer } from './imageRenderer';
import { PercentageRenderer } from './percentageRenderer';
import { DateRenderer } from './dateRenderer';
import { BooleanRenderer } from './booleanRenderer';
import { DefaultRenderer } from './defaultRenderer';
import { PluginRegistry } from '../plugins/pluginRegistry';
import { currencyPlugin } from '../plugins/currencyPlugin';
import { percentagePlugin } from '../plugins/percentagePlugin';

export const getCellRenderer = (type: ColumnType | string, registry?: PluginRegistry): React.FC<{ value: any }> => {
  
  // Phase 5: Plugin Renderer resolution
  if (registry) {
    for (const plugin of registry.getPlugins()) {
      if (type === 'currency' && plugin.render && (plugin === currencyPlugin || plugin.detect?.('amount', []) === 'currency')) {
        return plugin.render as React.FC<any>;
      }
      if (type === 'percentage' && plugin.render && (plugin === percentagePlugin || plugin.detect?.('percentage', []) === 'percentage')) {
        return plugin.render as React.FC<any>;
      }
    }
  }

  // Backwards compat if passed old pluginRenderers record directly (optional cleanup)
  // Fallthrough to defaults


  // Currency can use number formatting or custom, let's just use number for now if simple, or default
  switch (type) {
    case 'number':
    case 'currency': // Currency might need specific mapping later if we don't render string currency correctly
      return NumberRenderer;
    case 'email':
      return EmailRenderer;
    case 'url':
      return UrlRenderer;
    case 'image':
      return ImageRenderer;
    case 'percentage':
      return PercentageRenderer;
    case 'date':
      return DateRenderer;
    case 'boolean':
      return BooleanRenderer;
    case 'string':
    default:
      return DefaultRenderer;
  }
};
