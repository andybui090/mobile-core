import {CInputTouch} from '@/components';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

const ItemWorkInformation = ({
  item,
  index,
  onPressItem,
  dataNurseInfo = {},
}: any) => {
  const {t} = useTranslation();

  //tinh toan gia tri chon
  const [value, setValue] = useState<string>('');
  useEffect(() => {
    const checkIdChoose = () => {
      let isFound = false;
      switch (item.code) {
        case 'award':
          isFound = false;
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].id === dataNurseInfo.awardId) {
              setValue(item.children[i].name);
              isFound = true;
              break;
            }
          }
          if (!isFound) {
            setValue('');
          }
          break;
        case 'academy_rank':
          isFound = false;
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].id === dataNurseInfo.academicId) {
              setValue(item.children[i].name);
              isFound = true;
              break;
            }
          }
          if (!isFound) {
            setValue('');
          }
          break;
        case 'degree':
          isFound = false;
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].id === dataNurseInfo.degreeId) {
              setValue(item.children[i].name);
              isFound = true;
              break;
            }
          }
          if (!isFound) {
            setValue('');
          }
          break;
      }
    };
    checkIdChoose();
  }, [item, dataNurseInfo]);

  return (
    <CInputTouch
      label={t(`onboarding.${item.code}`)}
      placeHolder={t(`onboarding.${item.code}`)}
      isRequire={item.code === 'occupation'}
      name={item.name}
      onTouch={() => onPressItem(item, index)}
      value={value}
    />
  );
};

export default ItemWorkInformation;
