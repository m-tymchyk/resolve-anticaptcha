export enum TaskTypes {
    IMAGE_TO_TEXT = 'ImageToTextTask',
    RECAPTCHA_PROXYLESS = 'RecaptchaV2TaskProxyless',
    RECAPTCHA_PROXY = 'RecaptchaV2Task',
    RECAPTCHA_V2_TASK_PROXYLESS = 'RecaptchaV2TaskProxyless',
    RECAPTCHA_V2_TASK = 'RecaptchaV2Task',
    RECAPTCHA_V3_TASK_PROXYLESS = 'RecaptchaV3TaskProxyless',
    RECAPTCHA_V2_ENTERPRISE_TASK = 'RecaptchaV2EnterpriseTask',
    RECAPTCHA_V2_ENTERPRISE_TASK_PROXYLESS = 'RecaptchaV2EnterpriseTaskProxyless',
    FUN_CAPTCHA = 'FunCaptchaTask',
    FUN_CAPTCHA_PROXYLESS = 'FunCaptchaTaskProxyless',
    SQUARE_NET_TEXT = 'SquareNetTextTask',
    GEE_TEST = 'GeeTestTask',
    GET_TEST_PROXYLESS = 'GeeTestTaskProxyless',
    CUSTOM_CAPTCHA = 'CustomCaptchaTask'
}


export enum NumericOption {
    NoDemand = 0,

    // only numeric
    OnlyNumeric = 1,

    // any symbol but not numeric
    NoNumeric = 2,
}


export type IError = {
    errorId: number;
    errorCode: string;
    errorDescription: string;
}


export interface ICreateTaskResponse extends IError {
    taskId: number;
}


export interface IGetBalanceResponse extends IError {
    balance: number;
}


export interface IGRecaptchaSolution {
    gRecaptchaResponse: string;
}


export interface IImageToTextSolution {
    text: string;
    url: string;
}


export interface IGetTaskResultResponse<S = any> extends IError {
    status: 'ready' | 'processing';
    solution: S;
    cost: number;
    ip: string;
    createTime: number;
    endTime: number;
    solveCount: number;
}


export interface IProxyOptions {
    proxyType: 'http' | 'socks4' | 'socks5';
    proxyAddress: string;
    proxyPort: number;
    proxyLogin?: string;
    proxyPassword?: string;
    userAgent?: string;
    cookies?: string;
}


export interface ICommonTask {
    type: TaskTypes;

    [key: string]: any;
}


export interface ICommonTaskOptions {
    lang?: 'en' | 'ru';
    callbackUrl?: string;
}


export interface IReCaptchaV3Options extends ICommonTaskOptions {
    pageAction?: string;
    isEnterprise?: boolean;
    apiDomain?: string;
}


export interface IImageToTextOptions {
    phrase?: boolean;
    case?: boolean;
    numeric?: NumericOption;
    math?: boolean;
    minLength?: number;
    maxLength?: number;
    comment?: string;
}
