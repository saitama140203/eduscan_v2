"use client"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogoUploader } from "./LogoUploader"
import { ORG_TYPES } from "@/lib/constants"
import { PlusCircle } from "lucide-react"

export function CreateOrgDialog({ open, setOpen, formData, onInputChange, onFileChange, uploading, onCreate }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>Thêm tổ chức</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm tổ chức mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* ...Các trường form y như code bạn có... */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Tên</Label>
            <Input id="name" name="name" value={formData.name} onChange={onInputChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Địa chỉ</Label>
            <Input id="address" name="address" value={formData.address} onChange={onInputChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Loại tổ chức</Label>
            <select id="type" name="type" value={formData.type} onChange={onInputChange} className="col-span-3 border rounded p-2" required>
              {ORG_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logo_file" className="text-right">Logo</Label>
            <LogoUploader logo_url={formData.logo_url} uploading={uploading} onFileChange={onFileChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={onCreate} disabled={uploading}>Tạo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
