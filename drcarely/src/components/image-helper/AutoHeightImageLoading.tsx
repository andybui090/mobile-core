// import React, { useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import AutoHeightImage from 'react-native-auto-height-image';
// import { Blurhash } from 'react-native-blurhash';

// interface AutoHeightImageLoadingProps {
//     width: number;
//     source: { uri: string };
//     maxHeight?: number;
//     callBackLoading?: any;
// }

// const AutoHeightImageLoading: React.FC<AutoHeightImageLoadingProps> = ({ width, source, maxHeight, callBackLoading }) => {
//     const [loading, setLoading] = useState(true);

//     const renderLoading = () => {
//         return (
//             <Blurhash
//                 blurhash={'LGFFaXYk^6#M@-5c,1J5@[or[Q6.'}
//                 decodeAsync={false}
//                 style={styles.blurHashDe}
//                 resizeMode="cover"
//             />
//         );
//     };

//     return (
//         <View style={styles.container}>
//             {loading && renderLoading()}
//             <AutoHeightImage
//                 width={width}
//                 maxHeight={maxHeight}
//                 source={source}
//                 onLoadEnd={() => { setLoading(false); callBackLoading && callBackLoading(); }} // Ẩn loading sau khi ảnh load xong
//                 style={loading ? { opacity: 0 } : { opacity: 1 }} // Ẩn ảnh khi đang loading
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         position: 'relative',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     blurHashDe: {
//         position: 'absolute',
//         zIndex: 1,
//         width: '100%',
//         height: '100%',
//     },
// });

// export default AutoHeightImageLoading;