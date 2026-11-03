import Foundation
import WidgetKit
let groupID = "TANDAI_GROUP_ID"
guard let folder = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: groupID) else { fputs("Shared widget container unavailable\n", stderr); exit(1) }
try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
let file = folder.appendingPathComponent("tasks.json")
if CommandLine.arguments.contains("--clear") { try? FileManager.default.removeItem(at: file) }
else { let data = FileHandle.standardInput.readDataToEndOfFile(); guard data.count <= 100_000 else { exit(2) }; _ = try JSONSerialization.jsonObject(with: data); try data.write(to: file, options: .atomic); try FileManager.default.setAttributes([.posixPermissions: 0o600], ofItemAtPath: file.path) }
WidgetCenter.shared.reloadTimelines(ofKind: "TandaiTasks")
