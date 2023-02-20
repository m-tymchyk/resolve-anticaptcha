import Axios, {AxiosInstance} from "axios";
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
    IReCaptchaV3Options
} from "./interfaces";


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
            baseURL: "https://api.anti-captcha.com",
        });

        this.clientKey = clientKey;
        this.debug = debugMode;
    }


    /**
     * @return {string}
     */
    public getApiKey(): string {
        return this.clientKey;
    }


    /**
     * Wrapper to send common AntiCaptcha request.
     *
     * @param {string} method - AntiCaptcha request method
     * @param {object} [params={}] - Request params
     */
    public async sendRequest<T extends IError = any>(method: string,
                                                     params: any = {}
    ): Promise<T> {
        const { data } = await this.client.request<T>({
            url: method,
            data: {
                ...params,
                clientKey: this.clientKey,
                softId: 1090
            },
        });

        if (data.errorId === 0) {
            return data;
        }

        throw new class implements Error {
            public message: string = data.errorDescription;
            public name: string = "Error";
            public stack: string = "No stack";
            public data = data;
        };
    }


    /**
     * Fetch your account balance.
     *
     * @returns {Promise<IGetBalanceResponse>}
     */
    public async getBalance() {
        const { balance } = await this.sendRequest<IGetBalanceResponse>("/getBalance");

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
    public async createTask(task: ICommonTask,
                            taskOptions: ICommonTaskOptions = {}
    ): Promise<number> {
        const response = await this.sendRequest<ICreateTaskResponse>("/createTask", {
            task: task,
            languagePool: taskOptions.lang || "en",
            callbackUrl: taskOptions.callbackUrl,
        });

        this.debugLog(`Task [${response.taskId}] - Created`);

        return response.taskId;
    }


    /**
     * @param {string} websiteURL - The URL where the captcha is defined.
     * @param {string} websiteKey - The value of the "data-site-key" attribute.
     * @param {boolean} isInvisible - Is invisible Google ReCaptcha.
     * @param {IProxyOptions} proxy
     * @param {ICommonTaskOptions} taskOptions
     */
    public async reCaptchaV2Task(websiteURL: string,
                                 websiteKey: string,
                                 isInvisible: boolean = false,
                                 proxy?: IProxyOptions,
                                 taskOptions?: ICommonTaskOptions
    ) {
        let taskData = {
            type: proxy ? TaskTypes.RECAPTCHA_V2_TASK : TaskTypes.RECAPTCHA_V2_TASK_PROXYLESS,
            websiteURL: websiteURL,
            websiteKey: websiteKey,
            isInvisible: isInvisible,
        };

        if (proxy) {
            taskData = Object.assign({}, taskData, proxy);
        }

        return this.createTask(taskData, taskOptions);
    }


    /**
     * @param {string} websiteURL - The URL where the captcha is defined.
     * @param {string} websiteKey - The value of the "data-site-key" attribute.
     * @param {IReCaptchaV3Options} taskOptions
     */
    public async reCaptchaV3Task<IGRecaptchaSolution>(websiteURL: string,
                                                      websiteKey: string,
                                                      taskOptions?: IReCaptchaV3Options
    ) {
        let taskData = {
            type: TaskTypes.RECAPTCHA_V3_TASK_PROXYLESS,
            websiteURL: websiteURL,
            websiteKey: websiteKey,

            minScore: taskOptions.minScore,
            pageAction: taskOptions.pageAction,
            isEnterprise: taskOptions.isEnterprise,
            apiDomain: taskOptions.apiDomain
        };

        return this.createTask(taskData, taskOptions);
    }


    /**
     * @param {string} imgBase64 - Image Base64 string
     * @param {IImageToTextOptions} imgToTextOptions
     * @param {ICommonTaskOptions} taskOptions
     */
    public async imageTask(imgBase64: string,
                           imgToTextOptions: IImageToTextOptions = {},
                           taskOptions?: ICommonTaskOptions
    ) {
        let taskData = {
            type: TaskTypes.IMAGE_TO_TEXT,
            body: imgBase64,
            ...imgToTextOptions,
        };

        return this.createTask(taskData, taskOptions);
    }


    public async resolveImage(imgBase64: string,
                              imgToTextOptions?: IImageToTextOptions,
                              taskOptions?: ICommonTaskOptions
    ) {
        const taskId = await this.imageTask(imgBase64, imgToTextOptions, taskOptions);

        return this.getTaskResult<IImageToTextSolution>(taskId, 15, 2000);
    }


    /**
     * @param {string} websiteURL - The URL where the captcha is defined.
     * @param {string} websiteKey - The value of the "data-site-key" attribute.
     * @param {IProxyOptions} proxy
     * @param {ICommonTaskOptions} taskOptions
     *
     * @deprecated
     * @see AntiCaptcha.resolveRecaptchaV2()
     */
    public async resolveNoCaptcha<IGRecaptchaSolution>(websiteURL: string,
                                                       websiteKey: string,
                                                       proxy?: IProxyOptions,
                                                       taskOptions?: ICommonTaskOptions
    ): Promise<IGetTaskResultResponse<IGRecaptchaSolution>> {
        return this.resolveRecaptchaV2<IGRecaptchaSolution>(websiteURL, websiteKey, false, proxy, taskOptions);
    }

    /**
     * @param websiteURL
     * @param websiteKey
     * @param isInvisible
     * @param proxy
     * @param taskOptions
     */
    public async resolveRecaptchaV2<IGRecaptchaSolution>(websiteURL: string,
                                                         websiteKey: string,
                                                         isInvisible: boolean = false,
                                                         proxy?: IProxyOptions,
                                                         taskOptions?: ICommonTaskOptions
    ): Promise<IGetTaskResultResponse<IGRecaptchaSolution>> {
        const taskId = await this.reCaptchaV2Task(websiteURL, websiteKey, isInvisible, proxy, taskOptions);

        return this.getTaskResult<IGRecaptchaSolution>(taskId, 15, 2000);
    }


    public async resolveRecaptchaV3<IGRecaptchaSolution>(websiteURL: string,
                                                         websiteKey: string,
                                                         taskOptions?: IReCaptchaV3Options
    ): Promise<IGetTaskResultResponse<IGRecaptchaSolution>> {
        const taskId = await this.reCaptchaV3Task(websiteURL, websiteKey, taskOptions);

        return this.getTaskResult<IGRecaptchaSolution>(taskId, 15, 2000);
    }


    /**
     * Check a task to be resolved. Will try for given amount at the give time interval.
     *
     * @param {number} taskId - The task ID you want to check result.
     * @param {number} [retry=20] - The number of time the request must be tryed if worker is busy.
     * @param {number} [retryInterval=1500] - The amount of time before first and each try.
     *
     * @returns {Promise<IGetTaskResultResponse>}
     */
    public async getTaskResult<S = any>(taskId: number,
                                        retry: number = 20,
                                        retryInterval = 1500
    ): Promise<IGetTaskResultResponse<S>> {
        let retryCount = 0;
        return new Promise((resolve, reject) => {
            const routine = setInterval(async () => {
                this.debugLog(`Task [${taskId}] - Retry: ${retryCount}`);

                if (retryCount > retry) {
                    this.debugLog(`Task [${taskId}] - Exceeded retry count [${retry}].`);
                    clearInterval(routine);
                    reject(new Error("Timeout error."));

                    return;
                }

                try {
                    const response = await this.sendRequest("/getTaskResult", {taskId});

                    retryCount++;
                    if (response.status === "ready") {
                        this.debugLog(`Task [${taskId}] - Hash found!`);
                        clearInterval(routine);
                        resolve(response);

                        return;
                    }
                } catch (error) {
                    clearInterval(routine);

                    const errorMessage = error.data && error.data.hasOwnProperty("errorDescription")
                        ? error.data.errorDescription
                        : "HTTP request to get task result failed";

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
