import SoundPlayer from 'react-native-sound-player';
import { isValidUrl } from './common';

class Sound {
    playUrl(url: string) {
        SoundPlayer.stop();
        //kiem tra url hop le
        if (isValidUrl(url)) {
            try {
                SoundPlayer.playUrl(url);
            } catch (e) {
                console.log(`cannot play the sound url`, e)
            }
        }
    }

    seek(seconds: number) {
        try {
            SoundPlayer.seek(seconds);
        } catch (e) {
            console.log(`cannot seek the sound url`, e)
        }
    }

    resume() {
        try {
            SoundPlayer.resume();
        } catch (e) {
            console.log(`cannot resume the sound url`, e)
        }
    }

    pause() {
        try {
            SoundPlayer.pause();
        } catch (e) {
            console.log(`cannot pause the sound url`, e)
        }
    }

    stop() {
        try {
            SoundPlayer.stop();
        } catch (e) {
            console.log(`cannot stop the sound url`, e)
        }
    }
}

const SoundService = new Sound();
Object.freeze(SoundService);

export { SoundService };
