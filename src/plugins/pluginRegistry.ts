import { SmartTablePlugin, ColumnType } from '../schema/schemaTypes';

class PluginRegistry {
  private plugins: SmartTablePlugin[] = [];

  register(pluginOrPlugins: SmartTablePlugin | SmartTablePlugin[]) {
    if (Array.isArray(pluginOrPlugins)) {
      this.plugins.push(...pluginOrPlugins);
    } else {
      this.plugins.push(pluginOrPlugins);
    }
  }

  clear() {
    this.plugins = [];
  }

  runDetectors(columnKey: string, sample: any[]): ColumnType | null {
    for (const plugin of this.plugins) {
      if (plugin.detect) {
        const detectedType = plugin.detect(columnKey, sample);
        if (detectedType) {
          return detectedType;
        }
      }
    }
    return null;
  }

  getRenderers(): Record<string, React.FC<{ value: any }>> {
    const renderers: Record<string, React.FC<{ value: any }>> = {};
    for (const plugin of this.plugins) {
      // If a plugin provides a detect, it can implicitly define a completely new string type.
      // E.g., if a plugin returns 'my_custom_type' from detect() we need to map that type to its renderer().
      // For simplicity in this architecture, we expect the plugin to either state what type it renders 
      // or we map it generically if it provided a single render override.
      // But based on the interface `render(value) => ReactNode` it doesn't give a key.
      // Let's enhance it slightly internally or expect the plugin author to provide a mapping if needed.
      // Actually, per docs: { detect(column, sample), render(cell), insights(dataset) }
      // This implies 1 plugin handles 1 type override.
      
      // We will look at sample dataset during buildSchema. Let's provide a way for the factory to get it.
      // We'll leave this empty for now if we can't map strict strings, but we will pass the whole registry
      // down to the cell factory.
    }
    return renderers;
  }
  
  getPlugins() {
    return this.plugins;
  }
}

// Export a singleton instance for global scope if needed, though instance scoped to SmartTable is better
export const globalPluginRegistry = new PluginRegistry();

// Export the class so SmartTable can instantiate its own safely
export { PluginRegistry };
