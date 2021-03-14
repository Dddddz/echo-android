package com.virjar.echo.android;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.IBinder;

import com.virjar.echo.nat.log.EchoLogger;

import static android.app.PendingIntent.FLAG_UPDATE_CURRENT;

public class KeepAliveService extends Service {
    private static boolean start = false;

    public static void startService(Context context) {
        if (start) {
            return;
        }
        setNotifyChannel(context);
        Intent intent = new Intent(context, KeepAliveService.class);
        context.startService(intent);
    }

    private static void setNotifyChannel(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }
        String packageName = context.getPackageName();
        @SuppressLint("WrongConstant") NotificationChannel notificationChannel = new NotificationChannel(
                packageName + ":echo",
                "channel", NotificationManager.IMPORTANCE_HIGH);
        notificationChannel.enableLights(true);
        notificationChannel.setLightColor(Color.YELLOW);
        notificationChannel.setShowBadge(true);
        notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        NotificationManager manager = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
        if (manager == null) {
            return;
        }
        manager.createNotificationChannel(notificationChannel);
    }

    private void onServiceStartupInternal() {
        String packageName = getPackageName();
        PackageManager pm = getPackageManager();
        Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
        if (launchIntent == null) {
            EchoLogger.getLogger()
                    .warn("no launchIntent for package: " + getPackageName());
            return;
        }

        Bitmap icon;
        try {
            icon = drawableToBitmap(
                    pm.getPackageInfo(packageName, PackageManager.GET_META_DATA)
                            .applicationInfo.loadIcon(pm)
            );
        } catch (PackageManager.NameNotFoundException e) {
            throw new RuntimeException(e);
        }

        Notification.Builder builder = new Notification.Builder(this);
        // 设置PendingIntent
        builder.setContentIntent(PendingIntent.getActivity(this, 0, launchIntent, FLAG_UPDATE_CURRENT))
                .setLargeIcon(icon)
                .setContentTitle("echo service")
                .setContentText("to make sure echo service alive")
                .setWhen(System.currentTimeMillis());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder.setChannelId(packageName + ":echo");
        }

        Notification notification = builder.build();
        notification.defaults = Notification.DEFAULT_SOUND;
        startForeground(110, notification);
        start = true;
    }

    // 5. Drawable----> Bitmap
    public static Bitmap drawableToBitmap(Drawable drawable) {

        // 获取 drawable 长宽
        int width = drawable.getIntrinsicWidth();
        int heigh = drawable.getIntrinsicHeight();

        drawable.setBounds(0, 0, width, heigh);

        // 获取drawable的颜色格式
        Bitmap.Config config = drawable.getOpacity() != PixelFormat.OPAQUE ? Bitmap.Config.ARGB_8888
                : Bitmap.Config.RGB_565;
        // 创建bitmap
        Bitmap bitmap = Bitmap.createBitmap(width, heigh, config);
        // 创建bitmap画布
        Canvas canvas = new Canvas(bitmap);
        // 将drawable 内容画到画布中
        drawable.draw(canvas);
        return bitmap;
    }

    @Override
    public IBinder onBind(Intent intent) {
        onServiceStartupInternal();
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        onServiceStartupInternal();
        return START_STICKY;
    }
}
