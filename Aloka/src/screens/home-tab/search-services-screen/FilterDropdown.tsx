// import {ScreenHeight, screenStyles} from '@/configs';
// import {CText} from '@/utils';
// import {makeStyles, useTheme} from '@rneui/themed';
// import React, {useRef, useState} from 'react';
// import {useTranslation} from 'react-i18next';
// import {
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   Pressable,
//   ScrollView,
//   View,
// } from 'react-native';

// export type FilterState = {
//   location: string;
//   sort: string;
//   price: string;
//   rating: number | null;
// };

// type TabKey = 'location' | 'sort' | 'price' | 'rating';

// const defaultState: FilterState = {
//   location: 'near',
//   sort: 'rating',
//   price: 'desc',
//   rating: 5,
// };

// const FilterDropdown = ({onApply, onClose}: any) => {
//   const {
//     theme: {colors},
//   } = useTheme();
//   const {t} = useTranslation();

//   const TABS = [
//     {key: 'location', label: t('carely.location', 'Địa điểm')},
//     {key: 'sort', label: t('carely.popular', 'Phổ biến')},
//     {key: 'price', label: t('carely.priceRange', 'Khoảng giá') + '\n(VNĐ)'},
//     {key: 'rating', label: t('carely.rating', 'Đánh giá')},
//   ];

//   const styles = useStyles();
//   const [filters, setFilters] = useState(defaultState);
//   const [activeTab, setActiveTab] = useState<TabKey>('location');

//   const scrollRef = useRef<ScrollView>(null);

//   // 👉 lưu vị trí section
//   const sectionPositions = useRef<Record<string, number>>({});

//   const update = (key: keyof FilterState, value: any) => {
//     setFilters(prev => ({...prev, [key]: value}));
//   };

//   // 👉 click sidebar → scroll
//   const scrollToSection = (key: TabKey) => {
//     const y = sectionPositions.current[key] || 0;
//     scrollRef.current?.scrollTo({y, animated: true});
//     setActiveTab(key);
//   };

//   // 👉 detect scroll → update sidebar
//   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const offsetY = e.nativeEvent.contentOffset.y;

//     let current: TabKey = 'location';

//     for (const tab of TABS) {
//       const pos = sectionPositions.current[tab.key];
//       if (pos !== undefined && offsetY >= pos - 20) {
//         current = tab.key as TabKey;
//       }
//     }

//     setActiveTab(current);
//   };

//   const handleApply = () => {
//     onApply(filters);
//     onClose?.();
//   };

//   const handleReset = () => setFilters(defaultState);

//   // 👉 helper render section

//   const Row = ({children}: any) => {
//     return <View style={styles.row}>{children}</View>;
//   };

//   const Chip = ({label, active, onPress}: any) => {
//     return (
//       <Pressable
//         onPress={onPress}
//         style={({pressed}) => [
//           styles.chip,
//           active && styles.chipActive,
//           pressed && {opacity: 0.7},
//         ]}
//         hitSlop={10} // 👈 tăng vùng bấm
//       >
//         <CText h56 w400 color={active ? colors.c19A2A7 : colors.c667085}>
//           {label}
//         </CText>
//       </Pressable>
//     );
//   };

//   const renderSection = (
//     key: TabKey,
//     title: string,
//     content: React.ReactNode,
//   ) => (
//     <View
//       onLayout={e => {
//         sectionPositions.current[key] = e.nativeEvent.layout.y;
//       }}
//       style={{marginTop: 20}} // 👈 tăng từ 10 → 20
//     >
//       <CText h56 w500 color={colors.c101828} style={{marginBottom: 10}}>
//         {title}
//       </CText>
//       {content}
//     </View>
//   );

//   return (
//     <View style={styles.wrapper}>
//       <View style={styles.body}>
//         {/* SIDEBAR */}
//         <View style={styles.sidebar}>
//           {TABS.map(tab => {
//             const isActive = activeTab === tab.key;
//             return (
//               <Pressable
//                 key={tab.key}
//                 onPress={() => scrollToSection(tab.key as TabKey)}
//                 style={[styles.tab, isActive && styles.tabActive]}>
//                 <CText h56 color={isActive ? colors.c19A2A7 : colors.c667085}>
//                   {tab.label}
//                 </CText>
//               </Pressable>
//             );
//           })}
//         </View>
//         {/* CONTENT */}
//         <ScrollView
//           ref={scrollRef}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//           showsVerticalScrollIndicator={false}
//           style={styles.content}
//           contentContainerStyle={screenStyles.pB12}
//         >
//           {renderSection(
//             'location',
//             t('carely.location', 'Địa điểm'),
//             <Row>
//               <Chip
//                 label="Gần nhất"
//                 active={filters.location === 'near'}
//                 onPress={() => update('location', 'near')}
//               />
//               <Chip
//                 label="Bán kính <5km"
//                 active={filters.location === '5km'}
//                 onPress={() => update('location', '5km')}
//               />
//               <Chip
//                 label="Bán kính <10km"
//                 active={filters.location === '10km'}
//                 onPress={() => update('location', '10km')}
//               />
//               <Chip
//                 label="Tất cả"
//                 active={filters.location === 'all'}
//                 onPress={() => update('location', 'all')}
//               />
//             </Row>,
//           )}
//           {renderSection(
//             'sort',
//             t('carely.popular', 'Phổ biến'),
//             <Row>
//               <Chip
//                 label="Đặt nhiều nhất"
//                 active={filters.sort === 'booking'}
//                 onPress={() => update('sort', 'booking')}
//               />
//               <Chip
//                 label="Đánh giá cao nhất"
//                 active={filters.sort === 'rating'}
//                 onPress={() => update('sort', 'rating')}
//               />
//               <Chip
//                 label="Dịch vụ mới nhất"
//                 active={filters.sort === 'new'}
//                 onPress={() => update('sort', 'new')}
//               />
//               <Chip
//                 label="Được đề xuất nhất"
//                 active={filters.sort === 'new'}
//                 onPress={() => update('sort', 'new')}
//               />
//             </Row>,
//           )}
//           {renderSection(
//             'price',
//             t('carely.priceRange', 'Khoảng giá') + ' (VNĐ)',
//             <Row>
//               <Chip
//                 label="Từ thấp đến cao"
//                 active={filters.price === 'asc'}
//                 onPress={() => update('price', 'asc')}
//               />
//               <Chip
//                 label="Từ cao đến thấp"
//                 active={filters.price === 'desc'}
//                 onPress={() => update('price', 'desc')}
//               />
//             </Row>,
//           )}

//           {renderSection(
//             'rating',
//             t('carely.rating', 'Đánh giá'),
//             <Row>
//               {[5, 4, 3, 2, 1].map(r => (
//                 <Chip
//                   key={r}
//                   label={`${r} ⭐`}
//                   active={filters.rating === r}
//                   onPress={() => update('rating', r)}
//                 />
//               ))}
//             </Row>,
//           )}
//         </ScrollView>
//       </View>
//       {/* FOOTER */}
//       <View style={styles.footer}>
//         <Pressable style={styles.resetBtn} onPress={handleReset}>
//           <CText h5 w500 color={colors.c19A2A7}>
//             {t('carely.resetFilter', 'Thiết lập lại')}
//           </CText>
//         </Pressable>

//         <Pressable style={styles.applyBtn} onPress={handleApply}>
//           <CText h5 w500 color={colors.white}>
//             {t('common.apply')}
//           </CText>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// const useStyles = makeStyles(({colors}) => ({
//   wrapper: {
//     overflow: 'hidden',
//     flex: 1,
//   },
//   body: {
//     flexDirection: 'row',
//     maxHeight: ScreenHeight * 0.5,
//   },
//   sidebar: {
//     width: 110, // 👈 giảm từ 126
//     paddingTop: 12,
//     backgroundColor: '#F2F4F7', // 👈 xám nhẹ hơn
//   },
//   chip: {
//     width: '48%', // 👈 chia 2 cột
//     height: 36,
//     justifyContent: 'center',
//     alignItems: 'center', // 👈 căn giữa text
//     borderRadius: 4,
//     backgroundColor: '#F2F4F7',
//     marginBottom: 10,
//   },
//   chipActive: {
//     borderWidth: 1,
//     borderColor: colors.c19A2A7,
//     backgroundColor: '#fff',
//   },
//   footer: {
//     flexDirection: 'row',
//     padding: 16,
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     gap: 16,
//     backgroundColor: colors.white,
//   },
//   tab: {
//     paddingVertical: 14,
//     paddingLeft: 12,
//   },
//   tabActive: {
//     backgroundColor: '#fff',
//     borderLeftWidth: 3,
//     borderColor: colors.c19A2A7,
//   },
//   content: {
//     flex: 1,
//     padding: 14,
//     backgroundColor: colors.white,
//   },
//   row: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between', // 👈 quan trọng
//     marginTop: 10,
//   },
//   resetBtn: {
//     flex: 1,
//     paddingVertical: 8,
//     borderRadius: 4,
//     borderWidth: 1,
//     alignItems: 'center',
//     borderColor: colors.c19A2A7,
//     justifyContent: 'center',
//   },
//   applyBtn: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 4,
//     backgroundColor: colors.c19A2A7,
//     alignItems: 'center',
//   },
// }));

// export default FilterDropdown;
