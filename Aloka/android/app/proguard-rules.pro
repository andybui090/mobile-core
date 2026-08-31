# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Device info
-keepclassmembers class com.android.installreferrer.api.** {
  *;
}
-keep class com.google.android.gms.common.** {*;}
-keep class com.google.android.play.core.** { *; }
#-keep class com.facebook.hermes.unicode.** { *; }
#-keep class com.facebook.jni.** { *; }
# end

# fastimage
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}