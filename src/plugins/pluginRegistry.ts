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
    // Future: Iterate through plugins and map their custom types to their renderers
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
