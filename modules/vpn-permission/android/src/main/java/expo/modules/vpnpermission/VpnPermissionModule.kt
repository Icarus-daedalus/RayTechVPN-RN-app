package expo.modules.vpnpermission

import android.app.Activity
import android.net.VpnService
import expo.modules.kotlin.Promise
import expo.modules.kotlin.events.OnActivityResultPayload
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.atomic.AtomicReference

private const val VPN_PREPARE_REQUEST_CODE = 0x7e41

class VpnPermissionModule : Module() {
  private val pendingPermission = AtomicReference<Promise?>(null)

  override fun definition() = ModuleDefinition {
    Name("VpnPermission")

    OnActivityResult { _, payload: OnActivityResultPayload ->
      if (payload.requestCode == VPN_PREPARE_REQUEST_CODE) {
        val promise = pendingPermission.getAndSet(null)
        if (promise != null) {
          val context = appContext.reactContext
          if (payload.resultCode == Activity.RESULT_OK) {
            val stillNeedsConsent = context?.let { VpnService.prepare(it) }
            if (stillNeedsConsent == null) {
              promise.resolve(null)
            } else {
              promise.reject(
                "E_VPN_NOT_AUTHORIZED",
                "VPN consent did not complete; prepare() still returns an intent",
                null
              )
            }
          } else {
            promise.reject("E_VPN_PERMISSION_DENIED", "User denied VPN permission", null)
          }
        }
      }
    }

    AsyncFunction("ensureVpnPermission") { promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.reject("E_NO_CONTEXT", "React context unavailable", null)
        return@AsyncFunction
      }

      val prepareIntent = VpnService.prepare(context)
      if (prepareIntent == null) {
        promise.resolve(null)
        return@AsyncFunction
      }

      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("E_NO_ACTIVITY", "No activity to request VPN permission", null)
        return@AsyncFunction
      }

      val previous = pendingPermission.getAndSet(promise)
      previous?.reject(
        "E_VPN_PERMISSION_SUPERSEDED",
        "A newer VPN permission request replaced this one",
        null
      )

      @Suppress("DEPRECATION")
      activity.startActivityForResult(prepareIntent, VPN_PREPARE_REQUEST_CODE)
    }
  }
}
