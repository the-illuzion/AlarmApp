import BackgroundFetch from 'react-native-background-fetch';

class BackgroundTaskService {
  private static instance: BackgroundTaskService;

  private constructor() {}

  static getInstance(): BackgroundTaskService {
    if (!BackgroundTaskService.instance) {
      BackgroundTaskService.instance = new BackgroundTaskService();
    }
    return BackgroundTaskService.instance;
  }

  configure() {
    // Configure BackgroundFetch for periodic background tasks
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async (taskId: string) => {
        console.log('[BackgroundFetch] taskId:', taskId);

        // Perform background location check
        await this.performBackgroundLocationCheck();

        // Required: Signal completion of your task to native code
        BackgroundFetch.finish(taskId);
      },
      (error: string) => {
        console.log('[BackgroundFetch] failed to start:', error);
      }
    );

    // Start the background fetch
    BackgroundFetch.start().then(() => {
      console.log('[BackgroundFetch] started successfully');
    });
  }

  async performBackgroundLocationCheck() {
    try {
      console.log('[BackgroundTask] Performing background location check');

      // Here you would check if there are pending location checks
      // and perform them in the background

      // For now, just log that the background task ran
      console.log('[BackgroundTask] Background location check completed');
    } catch (error) {
      console.error('[BackgroundTask] Error in background location check:', error);
    }
  }

  start() {
    BackgroundFetch.start().then(() => {
      console.log('[BackgroundFetch] started successfully');
    }).catch((error) => {
      console.log('[BackgroundFetch] failed to start:', error);
    });
  }

  stop() {
    BackgroundFetch.stop().then(() => {
      console.log('[BackgroundFetch] stopped successfully');
    });
  }
}

export default BackgroundTaskService;
