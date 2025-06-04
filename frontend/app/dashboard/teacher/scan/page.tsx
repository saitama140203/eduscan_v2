"use client"

import { useState, useRef } from 'react';
import { Upload, Camera, FileText, Scan, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - sẽ thay bằng real API calls
const mockExams = [
  { maKiemTra: 1, tieuDe: "Kiểm tra Toán 15 phút", tenLop: "10A1", soLuongCau: 10 },
  { maKiemTra: 2, tieuDe: "Kiểm tra Lý 1 tiết", tenLop: "10A1", soLuongCau: 20 },
  { maKiemTra: 3, tieuDe: "Kiểm tra Hóa cuối kỳ", tenLop: "11B2", soLuongCau: 40 },
];

const mockScannedSheets = [
  {
    id: 1,
    maHocSinh: "HS001",
    tenHocSinh: "Nguyễn Văn An",
    thoiGianQuet: "2024-01-15 14:30",
    trangThai: "success",
    doTinCay: 95,
    diem: 8.5,
    soLuongDung: 17,
    tongSoCau: 20
  },
  {
    id: 2,
    maHocSinh: "HS002", 
    tenHocSinh: "Trần Thị Bình",
    thoiGianQuet: "2024-01-15 14:32",
    trangThai: "warning",
    doTinCay: 78,
    diem: null,
    soLuongDung: null,
    tongSoCau: 20,
    loi: "Một số ô trả lời không rõ ràng"
  },
  {
    id: 3,
    maHocSinh: "HS003",
    tenHocSinh: "Lê Văn Cường", 
    thoiGianQuet: "2024-01-15 14:35",
    trangThai: "error",
    doTinCay: 45,
    diem: null,
    soLuongDung: null,
    tongSoCau: 20,
    loi: "Không nhận diện được thông tin học sinh"
  }
];

export default function TeacherScanPage() {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedSheets, setScannedSheets] = useState(mockScannedSheets);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleStartScan = async () => {
    if (!selectedExam || uploadedFiles.length === 0) return;

    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }

    // Simulate processing results
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsScanning(false);
    setScanProgress(0);
    setUploadedFiles([]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRetrySheet = (sheetId: number) => {
    // Logic retry scan cho sheet có lỗi
    console.log('Retrying sheet:', sheetId);
  };

  const handleEditSheet = (sheetId: number) => {
    // Logic edit manual cho sheet có warning
    console.log('Editing sheet:', sheetId);
  };

  const handleExportResults = () => {
    // Logic xuất kết quả
    console.log('Exporting results...');
  };

  const getStatusColor = (trangThai: string) => {
    switch (trangThai) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (trangThai: string) => {
    switch (trangThai) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quét phiếu trả lời</h1>
          <p className="text-muted-foreground">
            Upload và xử lý phiếu trả lời học sinh bằng AI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportResults}>
            <Download className="mr-2 h-4 w-4" />
            Xuất kết quả
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Quét phiếu mới</TabsTrigger>
          <TabsTrigger value="results">Kết quả đã quét</TabsTrigger>
        </TabsList>

        {/* Tab: Quét phiếu mới */}
        <TabsContent value="scan" className="space-y-6">
          {/* Chọn bài kiểm tra */}
          <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Chọn bài kiểm tra
              </CardTitle>
              <CardDescription>
                Chọn bài kiểm tra để quét phiếu trả lời tương ứng
              </CardDescription>
          </CardHeader>
            <CardContent>
              <div className="space-y-4">
            <div className="space-y-2">
                  <Label htmlFor="exam-select">Bài kiểm tra</Label>
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bài kiểm tra..." />
                </SelectTrigger>
                <SelectContent>
                      {mockExams.map((exam) => (
                        <SelectItem key={exam.maKiemTra} value={exam.maKiemTra.toString()}>
                          {exam.tieuDe} - {exam.tenLop} ({exam.soLuongCau} câu)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

                {selectedExam && (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Đã chọn: {mockExams.find(e => e.maKiemTra.toString() === selectedExam)?.tieuDe}
                    </AlertDescription>
                  </Alert>
                )}
            </div>
          </CardContent>
        </Card>

          {/* Upload phiếu */}
          <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload phiếu trả lời
              </CardTitle>
              <CardDescription>
                Kéo thả hoặc chọn file ảnh phiếu trả lời (PNG, JPG, PDF)
              </CardDescription>
          </CardHeader>
          <CardContent>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Kéo thả file vào đây</h3>
                <p className="text-muted-foreground mb-4">
                  hoặc <span className="text-primary cursor-pointer">chọn file từ máy tính</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Hỗ trợ: PNG, JPG, JPEG, PDF (tối đa 10MB mỗi file)
                </p>
                <input
                  ref={fileInputRef}
                      type="file"
                      multiple
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                      className="hidden"
                />
              </div>

              {/* Hiển thị files đã chọn */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Files đã chọn:</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="outline">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nút bắt đầu quét */}
          <Card>
            <CardContent className="pt-6">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Scan className="h-5 w-5 animate-pulse" />
                    <span className="font-medium">Đang xử lý phiếu trả lời...</span>
                  </div>
                  <Progress value={scanProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {scanProgress < 100 ? `Đang quét... ${scanProgress}%` : 'Đang phân tích kết quả...'}
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={handleStartScan}
                  disabled={!selectedExam || uploadedFiles.length === 0}
                  className="w-full"
                  size="lg"
                >
                  <Scan className="mr-2 h-5 w-5" />
                  Bắt đầu quét phiếu ({uploadedFiles.length} file)
                </Button>
              )}
            </CardContent>
          </Card>
              </TabsContent>

        {/* Tab: Kết quả đã quét */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả quét phiếu</CardTitle>
              <CardDescription>
                Danh sách phiếu đã được quét và kết quả xử lý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scannedSheets.map((sheet) => (
                  <div key={sheet.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(sheet.trangThai)}
                        <span className="font-medium">{sheet.tenHocSinh}</span>
                        <Badge variant="outline">{sheet.maHocSinh}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {sheet.thoiGianQuet}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Độ tin cậy</span>
                        <div className="flex items-center gap-2">
                          <Progress value={sheet.doTinCay} className="h-2" />
                          <span className="text-sm font-medium">{sheet.doTinCay}%</span>
                        </div>
                      </div>
                      
                      {sheet.diem !== null && (
                        <>
                          <div>
                            <span className="text-sm text-muted-foreground">Điểm</span>
                            <div className="text-lg font-bold text-primary">{sheet.diem}</div>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Số câu đúng</span>
                            <div className="text-lg font-bold">{sheet.soLuongDung}/{sheet.tongSoCau}</div>
                          </div>
                        </>
                      )}
                    </div>

                    {sheet.loi && (
                      <Alert className="mb-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{sheet.loi}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                      {sheet.trangThai === 'warning' && (
                        <Button variant="outline" size="sm" onClick={() => handleEditSheet(sheet.id)}>
                          Sửa thủ công
                        </Button>
                      )}
                      {sheet.trangThai === 'error' && (
                        <Button variant="outline" size="sm" onClick={() => handleRetrySheet(sheet.id)}>
                          Quét lại
                        </Button>
                      )}
                    </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
