"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/lib/firestore-services';
import { Template } from '@/models/types';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState({ title: "", description: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    getTemplates().then(setTemplates).finally(() => setLoading(false));
  }, [modalOpen, deleteId]);

  const openNew = () => {
    setEditTemplate(null);
    setForm({ title: "", description: "", content: "" });
    setModalOpen(true);
  };

  const openEdit = (template: Template) => {
    setEditTemplate(template);
    setForm({ title: template.title, description: template.description, content: template.content });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editTemplate) {
        await updateTemplate(editTemplate.id, form);
        toast({ title: "Template updated" });
      } else {
        await createTemplate(form);
        toast({ title: "Template created" });
      }
      setModalOpen(false);
    } catch (e) {
      toast({ title: "Error", description: "Failed to save template.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      await deleteTemplate(id);
      toast({ title: "Template deleted" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete template.", variant: "destructive" });
    }
    setDeleteId(null);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline text-3xl">Project Templates</CardTitle>
              <CardDescription>Kickstart your work with pre-designed templates for various needs.</CardDescription>
            </div>
            <Button onClick={openNew} variant="outline"><Plus className="mr-2 h-4 w-4" /> New Template</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Browse through our collection of customizable templates. Select one to get started quickly or customize it to fit your specific project requirements.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center">No templates yet. Create one!</div>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Copy className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-xl">{template.title}</CardTitle>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <Image 
                  src={`https://placehold.co/400x250.png`} 
                  alt={`${template.title} template placeholder`} 
                  width={400} 
                  height={250}
                  className="rounded-md object-cover w-full mb-4"
                />
                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" className="w-full" onClick={() => {navigator.clipboard.writeText(template.content); toast({ title: "Template copied!" });}}>
                    <Copy className="mr-2 h-4 w-4" /> Use Template
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => openEdit(template)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => setConfirmDelete(template.id)} disabled={deleteId === template.id}>
                    {deleteId === template.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal for create/edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTemplate ? "Edit Template" : "New Template"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Title"
            />
            <Input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description"
            />
            <textarea
              className="w-full border rounded p-2 min-h-[100px]"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Template content..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for delete */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template?</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this template? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(confirmDelete!)} disabled={deleteId === confirmDelete}>
              {deleteId === confirmDelete ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
