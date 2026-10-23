import UIKit
import Firebase

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  // Some SDKs still access the window through UIApplicationDelegate.
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()

    return true
  }
}
