export enum TaskTypes {
    IMAGE_TO_TEXT = 'ImageToTextTask',
    RECAPTCHA_PROXYLESS = 'NoCaptchaTaskProxyless',
    RECAPTCHA_PROXY = 'NoCaptchaTask',
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


export type ICreateTaskResponse = IError & {
    taskId: number;
}


export type IGetBalanceResponse = IError & {
    balance: number;
}


export type IGRecaptchaSolution = {
    gRecaptchaResponse: string;
};


export type IImageToTextSolution = {
    text: string;
    url: string;
};


export type IGetTaskResultResponse<S = any> = IError & {
    status: 'ready' | 'processing';
    solution: S;
    solveCount: number;
    cost: number;
    ip: string;
    createTime: number;
    endTime: number;
}

export type IProxyOptions = {
    proxyType: 'http' | 'socks4' | 'socks5';
    proxyAddress: string;
    proxyPort: number;
    userAgent: string;

    proxyLogin?: string;
    proxyPassword?: string;
    cookies?: string;
};

export type ICommonTask = {
    type: TaskTypes;

    [key: string]: any;
};

export type ICommonTaskOptions = {
    lang?: 'en' | 'rn';
    callbackUrl?: string;
}

export type IImageToTextOptions = {
    phrase?: boolean;
    case?: boolean;
    numeric?: NumericOption;
    math?: boolean;
    minLength?: number;
    maxLength?: number;
    comment?: string;
};
