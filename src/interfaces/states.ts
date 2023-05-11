export enum FaderBlockType {
    primary,
    master,
    secondary
}

export enum FaderBankKnobMode {
    gain = 'gain',
    pan = 'pan'
}

export interface UiConfig {
    readonly faderBlocks: {
        identifier: string,
        channelCount: number,
        bankCount: number,
        type: FaderBlockType,
    }[],
    readonly customKeysCount: number
}

export interface UserUiConfig {
    faderBlocks: {
        [identifier: string]: {
            banks: {
                name?: string,
                channels: (string|null)[]
            }[]
        };
    },
    customKeys?: {
        [identifier: number]: {
            name: string
        };
    }
}

export interface UserState {

}

export interface MixerConfig {

}