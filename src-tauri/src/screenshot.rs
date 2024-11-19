use tauri::{path::BaseDirectory, AppHandle, Manager};
use xcap::Monitor;

#[allow(dead_code)]
#[tauri::command]
pub fn screenshot_path(app: AppHandle) -> String {
  let monitors = Monitor::all().unwrap();
  let main_monitor = monitors.get(0).unwrap();
  let image = main_monitor.capture_image().unwrap();
  // 获取 app data 目录
  let file_path = app.path().resolve("temp_screenshot.png", BaseDirectory::AppData).unwrap();
  image.save(&file_path).unwrap();
  file_path.to_str().unwrap().to_string()
}

#[allow(dead_code)]
#[tauri::command]
pub fn screenshot_save(app: AppHandle) -> String {
  let monitors = Monitor::all().unwrap();
  let main_monitor = monitors.get(0).unwrap();
  let image = main_monitor.capture_image().unwrap();
  // 获取app目录
  let timestamp = chrono::Local::now().format("%Y%m%d%H%M%S").to_string();
  let file_path = app.path().resolve(format!("temp/{}.png", timestamp), BaseDirectory::AppData).unwrap();
  println!("{}", file_path.to_str().unwrap());
  image.save(&file_path).unwrap();
  file_path.to_str().unwrap().to_string()
}