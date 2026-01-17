import type { Plugin } from '@opencode-ai/plugin';
import { tool } from '@opencode-ai/plugin';
import { createLogger } from './providers/common/logger.ts';
import { formatDashboardData, formatDashboardString } from './dashboard/format.ts';
import { formatUsageToast } from './toast/format.ts';

export const UsagePlugin: Plugin = async ({ client }) => {
  const logger = createLogger(client);

  void logger.info('UsagePlugin initialized');

  // Start worker immediately at plugin load
  try {
    const { startWorker } = await import('./cache/worker.ts');
    startWorker(logger);
    void logger.info('Worker started during initialization');
  } catch (error) {
    void logger.error('Failed to start worker during initialization', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const usageToastTool = tool({
    description: 'Show subscription usage as toast for OpenAI, Google, and z.ai providers',
    args: {},
    async execute() {
      const { loadCacheForDisplay } = await import('./cache/reader.ts');

      await logger.info('Loading usage from cache');

      const displayCache = await loadCacheForDisplay(logger);

      const toast = await formatUsageToast(displayCache, logger);

      await client.tui.showToast({
        body: {
          title: toast.title,
          message: toast.message,
          variant: toast.variant,
        },
      });

      return 'Usage displayed';
    },
  });

  const usageTableTool = tool({
    description:
      'Get subscription usage data for OpenAI, Google, and z.ai providers as a formatted table',
    args: {},
    async execute() {
      const { loadCacheForDisplay } = await import('./cache/reader.ts');

      await logger.info('Loading usage from cache');

      const displayCache = await loadCacheForDisplay(logger);

      if (!displayCache) {
        return 'No cache available';
      }

      const dashboardData = formatDashboardData(displayCache);

      return formatDashboardString(dashboardData, displayCache.updatedAt, displayCache.isStale);
    },
  });

  return {
    tool: {
      usage_toast: usageToastTool,
      usage_table: usageTableTool,
    },
    async event({ event }) {
      void logger.debug('Event received', { type: event.type });
    },
    async config(config) {
      config.command = config.command ?? {};

      config.command['usage-toast'] = {
        template: 'Call the usage_toast tool.',
        description: 'Show subscription usage as toast notification',
      };

      config.command.usage = {
        template: 'Call the usage_table tool and display the formatted table.',
        description: 'Show subscription usage as formatted table',
      };
    },
  };
};

const setupShutdownHandlers = async (): Promise<void> => {
  const { isWorkerRunning, stopWorker } = await import('./cache/worker.ts');
  const { createLogger } = await import('./providers/common/logger.ts');
  const logger = createLogger({
    app: { log: () => Promise.resolve(true) },
  } as unknown as Parameters<typeof createLogger>[0]);

  const onShutdown = async (): Promise<void> => {
    if (await isWorkerRunning()) {
      stopWorker(logger);
    }
  };

  process.on('SIGINT', onShutdown);
  process.on('SIGTERM', onShutdown);
  process.on('exit', onShutdown);
};

void setupShutdownHandlers();

export default UsagePlugin;
