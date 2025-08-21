// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod screenshot;
use screenshot::{screenshot};
mod webdav;
mod fuzzy_search;
mod keywords;
use tauri::{
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager, WindowEvent, menu::{Menu, MenuItem}, RunEvent,
};
use webdav::{webdav_backup, webdav_sync, webdav_test, webdav_create_dir};
use fuzzy_search::{fuzzy_search, fuzzy_search_parallel};
use keywords::{rank_keywords};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let is_visible = window.is_visible().unwrap_or(false);
                let is_minimized = window.is_minimized().unwrap_or(false);
                if !is_visible {
                    let _ = window.show();
                    let _ = window.set_focus();
                    let _ = window.set_always_on_top(true);
                    let _ = window.set_always_on_top(false);
                } else if is_minimized {
                    let _ = window.unminimize();
                    std::thread::sleep(std::time::Duration::from_millis(100));
                    let _ = window.show();
                    let _ = window.set_focus();
                    let _ = window.set_always_on_top(true);
                    let _ = window.set_always_on_top(false);
                } else {
                    let _ = window.set_focus();
                    let _ = window.set_always_on_top(true);
                    let _ = window.set_always_on_top(false);
                }
            }
        }))
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // 创建托盘菜单
            let show_item = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        ..
                    } => {
                        if let Some(window) = tray.app_handle().get_webview_window("main") {
                            let is_visible = window.is_visible().unwrap_or(false);
                            if is_visible {
                                let _ = window.hide();
                                #[cfg(target_os = "macos")]
                                let _ = tray.app_handle().hide();
                            } else {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                                #[cfg(target_os = "macos")]
                                let _ = tray.app_handle().show();
                            }
                        }
                    }
                    _ => {}
                })
                .build(app)?;

            // 添加窗口事件监听器，处理关闭事件
            if let Some(window) = app.get_webview_window("main") {
                let window_clone = window.clone();
                let app_handle = app.handle().clone();
                window.on_window_event(move |event| {
                    match event {
                        WindowEvent::CloseRequested { api, .. } => {
                            // 阻止默认关闭行为
                            api.prevent_close();
                            // 隐藏窗口到托盘
                            let _ = window_clone.hide();
                            #[cfg(target_os = "macos")]
                            let _ = app_handle.hide();
                        }
                        _ => {}
                    }
                });
            }

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![
            screenshot,
            webdav_test,
            webdav_backup,
            webdav_sync,
            fuzzy_search,
            fuzzy_search_parallel,
            rank_keywords,
            webdav_create_dir,
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app_handle, event| match event {
            #[cfg(target_os = "macos")]
            RunEvent::Reopen { has_visible_windows, .. } => {
                if !has_visible_windows {
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                        let _ = app_handle.show();
                    }
                }
            }
            _ => {}
        });
}
