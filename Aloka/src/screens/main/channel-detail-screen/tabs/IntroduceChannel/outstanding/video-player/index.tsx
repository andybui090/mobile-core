// import FastImageBackground from '@/components/FastImageBackground';
// import { screenStyles } from '@/configs';
// import { useEffect, useRef, useState } from 'react';
// import { View } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Video from 'react-native-video';

// type Props = {
//   URI: string;
//   posterURI: string;
//   isPlay: boolean;
//   playNext: () => void;
// };

// /*
//   Tinh toan ngung time trong 1500milisecond truoc khi play video khac
// */
// const MAX_TIME = 5;

// const VideoPlayer: React.FC<Props> = props => {
//   const playerRef = useRef<any>(null);

//   const { URI, isPlay, posterURI, playNext } = props;

//   const [isVideoErr, setIsVideoErr] = useState<boolean>(false);
//   const [paused, setPaused] = useState<boolean>(true);

//   const [videoUri, setVideoUri] = useState<string>('');
//   const [loaded, setLoaded] = useState<boolean>(false);

//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     if (isPlay) {
//       setVideoUri(URI);
//     }
//     setPaused(!isPlay);
//   }, [isPlay]);

//   //RENDER
//   const onLoad = (data: any) => {
//     setIsVideoErr(false);
//     setLoaded(true);
//     setDuration(data.duration);
//   };

//   const onVideoError = (e: any) => {
//     setIsVideoErr(true);
//     setPaused(true);
//   };

//   const onAudioBecomingNoisy = () => {
//     setPaused(true);
//   };

//   const onAudioFocusChanged = () => {
//     setPaused(true);
//   };

//   const onEnd = () => {
//     if (isPlay) {
//       if (duration != 0 && duration < MAX_TIME) {
//         playNext();
//       }
//     }
//   };

//   const _onProgress = (event: any) => {
//     if (duration > 0) {
//       let currentTime = event.currentTime;
//       if (duration > MAX_TIME) {
//         if (currentTime > MAX_TIME) {
//           setPaused(true);
//           playNext();
//         } else {
//           //xu ly tai onEnd
//         }
//       }
//     }
//   };

//   const customVideo = () => {
//     const isPauVideo = !isPlay || paused || videoUri == '';
//     return (
//       <View style={screenStyles.fillParent}>
//         <FastImageBackground style={screenStyles.fillParent} source={{ uri: posterURI }} />
//         <LinearGradient
//           style={{
//             position: 'absolute',
//             ...screenStyles.fillParent,
//           }}
//           colors={['transparent', 'rgba(0, 0, 0, 0.25)']}
//         />
//         {!isPauVideo && (
//           <View style={[screenStyles.absoluteFull, { zIndex: 1 }]}>
//             <Video
//               ref={playerRef}
//               style={[screenStyles.fillParent]}
//               source={{ uri: videoUri }}
//               controls={false}
//               resizeMode={"cover"}
//               paused={paused}
//               muted={false}
//               repeat={false}
//               onLoad={onLoad}
//               onEnd={onEnd}
//               onError={onVideoError}
//               onProgress={_onProgress}
//               onAudioBecomingNoisy={onAudioBecomingNoisy}
//               onAudioFocusChanged={onAudioFocusChanged}
//               volume={0.0}
//               fullscreen={false}
//               playWhenInactive={false}
//               useTextureView={false}
//               playInBackground={false}
//               disableFocus={true}
//               ignoreSilentSwitch={"ignore"}
//             />
//           </View>
//         )}
//       </View>
//     );
//   };

//   return <View style={screenStyles.flex1}>{customVideo()}</View>;
// };

// export default VideoPlayer;
