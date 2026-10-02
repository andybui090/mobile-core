import { ScreenWidth } from "@/configs";
import ImageCropPicker from "react-native-image-crop-picker";
import { MediaResult } from "./types/mediaResult";

export const withPickerHandling = async (pickerFn: () => Promise<any>): Promise<MediaResult> => {
  try {
    const imgRes = await pickerFn();
    return { isSuccess: true, imgRes, msg: null };
  } catch (err: any) {
    const msg =
      err.code === 'E_PICKER_CANCELLED'
        ? 'User cancelled picker'
        : err.message || 'Failed to open picker';
    return { isSuccess: false, imgRes: null, msg };
  }
};

export const showCamera = () =>
  withPickerHandling(() =>
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      multiple: false,
      cropperCircleOverlay: true,
      includeBase64: true,
      compressImageQuality: 1,
      width: ScreenWidth * 3,
      height: ScreenWidth * 1.2 * 3,
    })
  );

export const showPhotoLibrary = () =>
  withPickerHandling(() =>
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      multiple: false,
      cropperCircleOverlay: true,
      includeBase64: true,
      compressImageQuality: 1,
      width: ScreenWidth * 3,
      height: ScreenWidth * 1.2 * 3,
    })
  );

export const showPhotoLibraryDropThumnail = () =>
  withPickerHandling(() =>
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      multiple: false,
      cropperCircleOverlay: false,
      includeBase64: true,
      // compressImageQuality: 1,
      // height: (ScreenWidth / 3.5) * 1.33,
      // width: ScreenWidth / 3.5,
      width: 900,
      height: 1200,
      compressImageQuality: 0.7,
    })
  );

export const showPhotoVideoLibrary = () =>
  withPickerHandling(() =>
    ImageCropPicker.openPicker({
      multiple: true,
      includeBase64: true,
      // 🔥 Không mờ
      compressImageQuality: 0.65,
      // 🔥 Giảm dung lượng nhưng không mờ
      compressImageMaxWidth: 1280,
      compressImageMaxHeight: 1280,
      maxFiles: 50,
      compressVideoPreset: 'HighestQuality',
    })
  );

export const showCameraChat = () =>
  withPickerHandling(() =>
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      cropping: false,
      multiple: false,
      cropperCircleOverlay: true,
      includeBase64: true,
      compressImageQuality: 1,
    })
  );

export const showPhotoVideoComment = () =>
  withPickerHandling(() =>
    ImageCropPicker.openPicker({
      multiple: false,
      includeBase64: true,
      compressImageQuality: 1,
      maxFiles: 1,
    })
  );

export const showPhotoLibraryChangBackground = () =>
  withPickerHandling(() =>
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      includeBase64: true,
      compressImageQuality: 0.8,
      maxFiles: 1,
      compressVideoPreset: "HighestQuality"
    })
  );