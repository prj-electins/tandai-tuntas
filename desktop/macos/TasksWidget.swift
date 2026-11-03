import SwiftUI
import WidgetKit
import Foundation

let groupID = "TANDAI_GROUP_ID"
struct TaskItem: Codable, Identifiable { let id: String; let title: String; let dueDate: String; let workspaceId: String }
struct TaskSnapshot: Codable { let workspace: String; let tasks: [TaskItem]; let updatedAt: String }
struct TaskEntry: TimelineEntry { let date: Date; let snapshot: TaskSnapshot? }
struct Provider: TimelineProvider {
 func placeholder(in context: Context) -> TaskEntry { TaskEntry(date: Date(), snapshot: TaskSnapshot(workspace: "Hari ini", tasks: ["Rencanakan hal penting", "Tinjau naskah video", "Siapkan perlengkapan", "Lanjutkan proyek utama", "Periksa hasil akhir", "Susun rencana berikutnya"].enumerated().map { TaskItem(id: "preview-\($0.offset)", title: $0.element, dueDate: "", workspaceId: "") }, updatedAt: "")) }
 func getSnapshot(in context: Context, completion: @escaping (TaskEntry) -> Void) { completion(context.isPreview ? placeholder(in: context) : read()) }
 func getTimeline(in context: Context, completion: @escaping (Timeline<TaskEntry>) -> Void) { completion(Timeline(entries: [read()], policy: .after(Date().addingTimeInterval(900)))) }
 func read() -> TaskEntry {
  let folder = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: groupID)
  let data = folder.flatMap { try? Data(contentsOf: $0.appendingPathComponent("tasks.json")) }
  let snapshot = data.flatMap { try? JSONDecoder().decode(TaskSnapshot.self, from: $0) }
  return TaskEntry(date: Date(), snapshot: snapshot)
 }
}
struct TasksView: View {
 let entry: TaskEntry
 @Environment(\.widgetFamily) var family
 var limit: Int { family == .systemSmall ? 2 : family == .systemLarge ? 6 : 3 }
 var body: some View {
  VStack(alignment: .leading, spacing: 9) {
   HStack { Image(systemName: "checkmark.square.fill").foregroundStyle(.purple); Text("Tandai Tuntas").font(.headline).lineLimit(1).minimumScaleFactor(0.8); Spacer() }
   if let snapshot = entry.snapshot {
    Text(snapshot.workspace).font(.caption).foregroundStyle(.secondary).lineLimit(1)
    if snapshot.tasks.isEmpty { Text("Semua beres untuk sekarang.").font(.subheadline) }
    ForEach(Array(snapshot.tasks.prefix(limit))) { task in
     Link(destination: taskURL(task)) { HStack(alignment: .top, spacing: 8) { Image(systemName: "circle").font(.caption).foregroundStyle(.purple); VStack(alignment: .leading, spacing: 2) { Text(task.title).font(.system(size: family == .systemSmall ? 12 : 13, weight: .medium)).lineLimit(2); if !task.dueDate.isEmpty { Text(dateLabel(task.dueDate)).font(.caption2).foregroundStyle(.secondary) } }; Spacer(minLength: 0) } }
    }
   } else { Text("Pilih ruang kerja di pengaturan widget aplikasi.").font(.subheadline).foregroundStyle(.secondary) }
   Spacer(minLength: 0)
   if let snapshot = entry.snapshot, snapshot.tasks.count > limit { Text("+\(snapshot.tasks.count - limit) tugas lainnya").font(.caption2).foregroundStyle(.secondary) }
  }.containerBackground(.fill.tertiary, for: .widget).widgetURL(URL(string: "tandaituntas://open"))
 }
 func dateLabel(_ value: String) -> String { let parser = DateFormatter(); parser.locale = Locale(identifier: "en_US_POSIX"); parser.dateFormat = "yyyy-MM-dd"; guard let date = parser.date(from: value) else { return value }; let display = DateFormatter(); display.locale = Locale(identifier: "id_ID"); display.dateFormat = "d MMM"; return display.string(from: date) }
 func taskURL(_ task: TaskItem) -> URL { var parts = URLComponents(); parts.scheme = "tandaituntas"; parts.host = "task"; parts.queryItems = [URLQueryItem(name: "workspace", value: task.workspaceId), URLQueryItem(name: "id", value: task.id)]; return parts.url! }
}
@main struct TandaiTasksWidget: Widget {
 let kind = "TandaiTasks"
 var body: some WidgetConfiguration { StaticConfiguration(kind: kind, provider: Provider()) { TasksView(entry: $0) }.configurationDisplayName("Tugas Tandai Tuntas").description("Lihat tugas dan buka detailnya langsung dari desktop.").supportedFamilies([.systemSmall, .systemMedium, .systemLarge]) }
}
