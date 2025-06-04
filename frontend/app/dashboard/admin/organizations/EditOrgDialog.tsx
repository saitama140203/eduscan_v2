"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogoUploader } from "./LogoUploader"
import { ORG_TYPES } from "@/lib/constants"

interface EditOrgDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  formData: {
    name?: string
    address?: string
    type?: string
    logo_url?: string
  }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading: boolean
  onUpdate: () => void
}

export function EditOrgDialog({
  open,
  setOpen,
  formData,
  onInputChange,
  onFileChange,
  uploading,
  onUpdate,
}: EditOrgDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tổ chức</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault()
            onUpdate()
          }}
          className="space-y-6"
        >
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Tên</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name || ""}
                onChange={onInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">Địa chỉ</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address || ""}
                onChange={onInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">Loại tổ chức</Label>
              <select
                id="edit-type"
                name="type"
                value={formData.type || ORG_TYPES[0].value}
                onChange={onInputChange}
                className="col-span-3 border rounded p-2"
                required
              >
                {ORG_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Logo</Label>
              <LogoUploader
                logo_url={formData.logo_url}
                uploading={uploading}
                onFileChange={onFileChange}
              />
            </div>
            {uploading && (
              <div className="text-blue-500 text-sm pl-24">Đang tải logo lên...</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={uploading}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
