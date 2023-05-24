import { HwChannel, MasterBus, MasterChannel, SoundcraftUI } from "soundcraft-ui-connection";

export function getChannelById(channelId: string | undefined, mixer: SoundcraftUI): MasterChannel {
    const identifier = (channelId) ? channelId.split('.') : [];
    let channel;

    switch (identifier[0]) {
      case 'i':
        channel = mixer.master.input(Number(identifier[1])+1);
        break;
      case 'a':
        channel = mixer.master.aux(Number(identifier[1])+1);
        break;
      case 'f':
        channel = mixer.master.fx(Number(identifier[1])+1);
        break;
      case 'l':
        channel = mixer.master.line(Number(identifier[1])+1);
        break;
      case 'p':
        channel = mixer.master.player(Number(identifier[1])+1);
        break;
      case 's':
        channel = mixer.master.sub(Number(identifier[1])+1);
        break;
      case 'v':
        channel = mixer.master.vca(Number(identifier[1])+1);
        break;
    //   case 'm':
        // channel = mixer.master;
        // break;
      default:
        channel = mixer.master.input(100);
    }
    return channel;
}

export function getHwChannelById(channelId: string | undefined, mixer: SoundcraftUI): HwChannel | null {
    const identifier = (channelId) ? channelId.split('.') : [];
    let hwChannel = null;

    switch (identifier[0]) {
      case 'i':
        hwChannel = mixer.hw(Number(identifier[1])+1);
        break;
    }
    return hwChannel;
}