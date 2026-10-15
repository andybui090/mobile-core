import { screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import { ScrollView, View } from 'react-native';
import useStyles from './styles';

type Props = {
  listData: any;
};

const Categories = ({listData}: Props) => {
  const {
    theme: {colors},
  } = useTheme();

  const styles = useStyles();

  return (
    <Row style={screenStyles.pV12}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[screenStyles.flexGrow1]}>
        {listData.map((item: any, index: number) => (
          <View
            key={index}
            style={[styles.tab, {backgroundColor: colors.cF2F4F7}]}>
            <CText h5 w400 color={colors.c667085}>
              {item?.name}
            </CText>
          </View>
        ))}
      </ScrollView>
    </Row>
  );
};

export default Categories;
