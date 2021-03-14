package com.virjar.echo.android;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.virjar.echo.nat.bootstrap.ClientIdentifier;
import com.virjar.echo.nat.bootstrap.EchoBootstrap;
import com.virjar.echo.nat.log.EchoLogger;
import com.virjar.echo.nat.log.ILogger;

public class EchoReactModule extends ReactContextBaseJavaModule {
    public EchoReactModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "echoEngine";
    }

    /**
     * 启动echo引擎
     *
     * @param apiEntry 接入点，为一个http URL，目前官方demo部署在 http://echonew.virjar.com/
     * @param account  后台登录账号，echo系统通过账号进行服务访问鉴权(你只能访问自己账号下的代理服务资源)
     * @param apiToken APIToken是一组echo后台服务访问的鉴权凭证
     */
    @ReactMethod
    public void startEchoEngine(String apiEntry, String account, String apiToken) {
        new Thread("echo-startup") {
            @Override
            public void run() {
                super.run();
                EchoBootstrap.startup(apiEntry, account, apiToken);
            }
        }.start();
    }

    /**
     * 获取设备id，请注意设备id是echoSDK计算，然后在管理后台可见
     *
     * @return 设备id
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String echoClientId() {
        return ClientIdentifier.id();
    }

    /**
     * 开启日志,js层通过NativeEventEmitter监听echo发送过来的日志消息
     *
     * @param eventName java发送到js的event name
     * @see @link https://reactnative.dev/docs/native-modules-android#sending-events-to-javascript
     */
    @ReactMethod
    public void openLogEvent(String eventName) {
        ILogger originLogger = EchoLogger.getLogger();
        if (originLogger instanceof ReactEchoLogger) {
            originLogger = ((ReactEchoLogger) originLogger).getOriginLogger();
        }
        DeviceEventManagerModule.RCTDeviceEventEmitter deviceEventEmitter = getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

        EchoLogger.setLogger(new ReactEchoLogger(
                deviceEventEmitter, originLogger, eventName
        ));
    }
}
