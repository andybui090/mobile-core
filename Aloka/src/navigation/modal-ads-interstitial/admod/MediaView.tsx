// import React, { useState } from "react";
// import { Dimensions } from "react-native";
// import { NativeMediaView } from "react-native-admob-native-ads";

// export const MediaView = ({ onEndVideoAd }: any) => {
//   const [paused, setPaused] = useState(false);

//   const onVideoPlay = () => {
//     console.log("Video is now playing");
//   };

//   const onVideoPause = () => {
//     console.log("Video is now paused");
//   };

//   const onVideoProgress = (event: any) => {
//     // console.log("PROGRESS UPDATE");
//   };

//   const onVideoEnd = () => {
//     console.log("Video end reached");
//     onEndVideoAd();
//   };

//   const onVideoMute = (muted: boolean) => {
//     console.log("Video MUTE", muted);
//   };

//   return <NativeMediaView
//     style={{
//       width: Dimensions.get("window").width,
//       height: '100%',
//       backgroundColor: "black",
//     }}
//     onVideoPause={onVideoPause}
//     onVideoPlay={onVideoPlay}
//     onVideoEnd={onVideoEnd}
//     onVideoProgress={onVideoProgress}
//     onVideoMute={onVideoMute}
//     muted={false}
//     paused={paused}
//   />
// };