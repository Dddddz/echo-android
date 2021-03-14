package com.virjar.echo.android;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.virjar.echo.nat.log.AndroidLogger;
import com.virjar.echo.nat.log.ILogger;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

public class ReactEchoLogger implements ILogger {
    private final DeviceEventManagerModule.RCTDeviceEventEmitter deviceEventEmitter;
    private final ILogger originLogger;
    private final String eventName;
    private static final String INFO = "INFO";
    private static final String WARNING = "WARN";
    private static final String ERROR = "ERROR";
    private static final String DEBUG = "DEBUG";


    public ReactEchoLogger(DeviceEventManagerModule.RCTDeviceEventEmitter deviceEventEmitter, ILogger originLogger, String eventName) {
        this.deviceEventEmitter = deviceEventEmitter;
        if (originLogger == null) {
            originLogger = new AndroidLogger();
        }
        this.originLogger = originLogger;
        this.eventName = eventName;

    }

    public ILogger getOriginLogger() {
        return originLogger;
    }

    private WritableMap createJsParam(String level, String msg, Throwable throwable) {
        WritableMap params = Arguments.createMap();
        params.putString("level", level);
        if (throwable == null) {
            params.putString("msg", msg);
        } else {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            throwable.printStackTrace(new PrintStream(byteArrayOutputStream));
            String finalMsg = msg + "\n" + byteArrayOutputStream.toString();
            params.putString("msg", finalMsg);
        }
        return params;
    }

    @Override
    public void info(String msg) {
        deviceEventEmitter.emit(eventName,
                createJsParam(INFO, msg, null)
        );
        originLogger.info(msg);
    }

    @Override
    public void info(String msg, Throwable throwable) {
        deviceEventEmitter.emit(eventName,
                createJsParam(INFO, msg, throwable)
        );
        originLogger.info(msg);
    }

    @Override
    public void warn(String msg) {
        deviceEventEmitter.emit(eventName,
                createJsParam(WARNING, msg, null)
        );
        originLogger.warn(msg);
    }

    @Override
    public void warn(String msg, Throwable throwable) {
        deviceEventEmitter.emit(eventName,
                createJsParam(WARNING, msg, throwable)
        );
        originLogger.warn(msg);
    }

    @Override
    public void error(String msg) {
        deviceEventEmitter.emit(eventName,
                createJsParam(ERROR, msg, null)
        );
        originLogger.error(msg);
    }

    @Override
    public void error(String msg, Throwable throwable) {
        deviceEventEmitter.emit(eventName,
                createJsParam(ERROR, msg, throwable)
        );
        originLogger.error(msg);
    }

    @Override
    public void debug(String msg) {
        deviceEventEmitter.emit(eventName,
                createJsParam(DEBUG, msg, null)
        );
        originLogger.debug(msg);
    }

    @Override
    public void debug(String msg, Throwable throwable) {
        deviceEventEmitter.emit(eventName,
                createJsParam(DEBUG, msg, throwable)
        );
        originLogger.debug(msg);
    }
}
