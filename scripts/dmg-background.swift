import AppKit
import Foundation
let out = CommandLine.arguments[1]
let scale: CGFloat = CommandLine.arguments.count > 2 ? 2 : 1
let width: CGFloat = 660, height: CGFloat = 420
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(width*scale), pixelsHigh: Int(height*scale), bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState(); NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
let context = NSGraphicsContext.current!.cgContext; context.scaleBy(x: scale, y: scale)
NSColor(calibratedRed: 0.97, green: 0.96, blue: 0.99, alpha: 1).setFill();NSRect(x:0,y:0,width:width,height:height).fill()
func text(_ value:String,_ y:CGFloat,_ size:CGFloat,_ color:NSColor,_ weight:NSFont.Weight = .regular){let attrs:[NSAttributedString.Key:Any]=[.font:NSFont.systemFont(ofSize:size,weight:weight),.foregroundColor:color];let size=(value as NSString).size(withAttributes:attrs);(value as NSString).draw(at:NSPoint(x:(width-size.width)/2,y:y),withAttributes:attrs)}
text("Tandai Tuntas",340,28,NSColor(calibratedWhite:0.16,alpha:1),.semibold)
text("Seret aplikasi ke folder Applications",307,15,NSColor(calibratedWhite:0.42,alpha:1))
NSColor(calibratedRed:0.48,green:0.38,blue:0.85,alpha:1).setStroke();let arrow=NSBezierPath();arrow.lineWidth=3;arrow.lineCapStyle = .round;arrow.lineJoinStyle = .round;arrow.move(to:NSPoint(x:292,y:210));arrow.line(to:NSPoint(x:368,y:210));arrow.move(to:NSPoint(x:354,y:224));arrow.line(to:NSPoint(x:368,y:210));arrow.line(to:NSPoint(x:354,y:196));arrow.stroke()
text("Dikembangkan oleh arashy dev",48,12,NSColor(calibratedWhite:0.48,alpha:1))
NSGraphicsContext.restoreGraphicsState();try rep.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:out))
