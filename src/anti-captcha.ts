import Axios, { AxiosInstance } from 'axios';
import {
    TaskTypes,
    IError,
    ICreateTaskResponse,
    IGetBalanceResponse,
    IProxyOptions,
    IImageToTextOptions,
    IGetTaskResultResponse,
    ICommonTask,
    ICommonTaskOptions,
    IGRecaptchaSolution,
    IImageToTextSolution,
} from './interfaces';

export default class AntiCaptcha {

    private client: AxiosInstance;

    private readonly clientKey: string;
    private readonly debug: boolean;

    /**
     * Creates an instance of AntiCaptcha.
     *
     * @param {string} clientKey - The client key of your AntiCaptcha account.
     * @param {boolean} [debugMode=false] - Enable debug mode.
     */
    public constructor(clientKey: string, debugMode: boolean = false) {
        this.client = Axios.create({
            baseURL: 'http://api.anti-captcha.com',
        });

        this.clientKey = clientKey;
        this.debug = debugMode;
    }


    /**
     * Wrapper to send common AntiCaptcha request.
     *
     * @param {string} method - AntiCaptcha request method
     * @param {object} [params={}] - Request params
     */
    public async sendRequest<T extends IError = any>(method: string, params: any = {}): Promise<T> {
        const { data } = await this.client.request<T>({
            url: method,
            data: {
                ...params,
                clientKey: this.clientKey,
                softId: 791,
            },
        });

        if (data.errorId === 0) {
            return data;
        }

        throw new class implements Error {
            public message: string = data.errorDescription;
            public name: string = 'Error';
            public stack: string = 'No stack';
            public data = data;
        };
    }


    /**
     * Fetch your account balance.
     *
     * @returns {Promise<IGetBalanceResponse>}
     */
    public async getBalance() {
        const { balance } = await this.sendRequest<IGetBalanceResponse>('/getBalance');

        return balance;
    }


    /**
     * Dispatch a task creation to the service. This will return a taskId.
     *
     * @params {ICommonTask} task
     * @params {ICommonTaskOptions} taskOptions
     *
     * @returns {Promise<number>}
     */
    public async createTask(task: ICommonTask, taskOptions?: ICommonTaskOptions): Promise<number> {
        const response = await this.sendRequest<ICreateTaskResponse>('/createTask', {
            task: task,
            languagePool: taskOptions.lang || 'en',
            callbackUrl: taskOptions.callbackUrl,
        });

        this.debugLog(`Task [${response.taskId}] - Created`);

        return response.taskId;
    }


    /**
     * @param {string} websiteURL - The URL where the captcha is defined.
     * @param {string} websiteKey - The value of the "data-site-key" attribute.
     * @param {IProxyOptions} proxy
     * @param {ICommonTaskOptions} taskOptions
     */
    public async noCaptchaTask(websiteURL: string,
                               websiteKey: string,
                               proxy?: IProxyOptions,
                               taskOptions?: ICommonTaskOptions) {
        let taskData = {
            type: proxy ? TaskTypes.RECAPTCHA_PROXY : TaskTypes.RECAPTCHA_PROXYLESS,
            websiteURL: websiteURL,
            websiteKey: websiteKey,
        };

        if (proxy) {
            taskData = Object.assign({}, taskData, proxy);
        }

        return this.createTask(taskData, taskOptions);
    }

    /**
     * @param {string} imgBase64 - Image Base64 string
     * @param {IImageToTextOptions} imgToTextOptions
     * @param {ICommonTaskOptions} taskOptions
     */
    public async imageTask(imgBase64: string, imgToTextOptions: IImageToTextOptions = {}, taskOptions?: ICommonTaskOptions) {
        let taskData = {
            type: TaskTypes.IMAGE_TO_TEXT,
            body: imgBase64,
            ...imgToTextOptions,
        };

        return this.createTask(taskData, taskOptions);
    }


    public async resolveImage(imgBase64: string, imgToTextOptions?: IImageToTextOptions, taskOptions?: ICommonTaskOptions) {
        const taskId = await this.imageTask(imgBase64, imgToTextOptions, taskOptions);

        return this.getTaskResult<IImageToTextSolution>(taskId, 10, 10000);
    }


    /**
     * @param {string} websiteURL - The URL where the captcha is defined.
     * @param {string} websiteKey - The value of the "data-site-key" attribute.
     * @param {IProxyOptions} proxy
     * @param {ICommonTaskOptions} taskOptions
     */
    public async resolveNoCaptcha(websiteURL: string,
                                  websiteKey: string,
                                  proxy?: IProxyOptions,
                                  taskOptions?: ICommonTaskOptions,
    ): Promise<IGetTaskResultResponse<IGRecaptchaSolution>> {
        const taskId = await this.noCaptchaTask(websiteURL, websiteKey, proxy, taskOptions);

        return this.getTaskResult<IGRecaptchaSolution>(taskId, 10, 10000);
    }


    /**
     * Check a task to be resolved. Will try for given amount at the give time interval.
     *
     * @param {number} taskId - The task ID you want to check result.
     * @param {number} [retry=12] - The number of time the request must be tryed if worker is busy.
     * @param {number} [retryInterval=10000] - The amount of time before first and each try.
     *
     * @returns {Promise<IGetTaskResultResponse>}
     *
     * @see createTask
     */
    public async getTaskResult<S = any>(taskId: number, retry: number = 12, retryInterval = 10000): Promise<IGetTaskResultResponse<S>> {
        let retryCount = 0;
        return new Promise((resolve, reject) => {
            const routine = setInterval(async () => {
                this.debugLog(`Task [${taskId}] - Retry: ${retryCount}`);

                if (retryCount > retry) {
                    this.debugLog(`Task [${taskId}] - Exceeded retry count [${retry}].`);
                    clearInterval(routine);
                    reject(new Error('Timeout error.'));

                    return;
                }

                try {
                    const response = await this.sendRequest('/getTaskResult', { taskId });

                    retryCount++;
                    if (response.status === 'ready') {
                        this.debugLog(`Task [${taskId}] - Hash found!`);
                        clearInterval(routine);
                        resolve(response);

                        return;
                    }
                } catch (error) {
                    clearInterval(routine);

                    const errorMessage = error.data && error.data.hasOwnProperty('errorDescription')
                        ? error.data.errorDescription
                        : 'HTTP request to get task result failed';

                    reject(new Error(errorMessage));

                    return;
                }
            }, retryInterval);
        }) as Promise<IGetTaskResultResponse<S>>;
    }

    /**
     * @param debugData
     */
    protected debugLog(...debugData: any[]) {
        if (this.debug) {
            console.log(...debugData);
        }
    }
}
