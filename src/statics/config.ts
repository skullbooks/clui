import { FaderBlockType, UiConfig, UserUiConfig } from "../interfaces/states";


export const mixerUiConfig:UiConfig = {
    faderBlocks: [{
        identifier: 'leftBlock',
        channelCount: 8,
        bankCount: 4,
        type: FaderBlockType.secondary
    },{
        identifier: 'centerBlock',
        channelCount: 8,
        bankCount: 4,
        type: FaderBlockType.primary
    },{
        identifier: 'masterBlock',
        channelCount: 2,
        bankCount: 1,
        type: FaderBlockType.master
    }],
    customKeysCount: 8
}





export const userUiConfig:UserUiConfig = {
    faderBlocks: {
        'leftBlock': {
            banks: [{
                name: '1 - 8',
                channels: ['i.0', 'i.1', 'i.2', 'i.3', 'i.4', 'i.5', 'i.6', 'i.7']
            },{
                name: '9 - 16',
                channels: ['i.8', 'i.9', 'i.10', 'i.11', 'i.12', 'i.13', 'i.14', 'i.15']
            },{
                name: '17 - 24',
                channels: ['i.16', 'i.17', 'i.18', 'i.19', 'i.20', 'i.21', 'i.22', 'i.23']
            },{
                name: 'Line',
                channels: ['l.0', 'l.1', 'p.0', 'p.1'] //['i.24', 'i.25', 'i.26', 'i.27', 'i.28', 'i.29', 'i.30', 'i.31']
            }] 
        },
        'centerBlock': {
            banks: [{
                name: 'AUX 1-8',
                channels: ['a.0', 'a.1', 'a.2', 'a.3', 'a.4', 'a.5', 'a.6', 'a.7']
            },{
                name: 'AUX 9-16',
                channels: ['a.8', 'a.9', 'm', null, 'f.0', 'f.1', 'f.2', 'f.3',]
            },{
                name: 'SUB',
                channels: ['s.0', 's.1', 's.2', 's.3', 's.4', 's.5']
            },{
                name: 'VCA',
                channels: ['v.0', 'v.1', 'v.2', 'v.3', 'v.4', 'v.5']
            }] 
        },
        'masterBlock': {
            banks: [{
                channels: ['m']
            }] 
        }
    },
    customKeys: {
        1: {
            name: 'Mute All'
        }
    }
}