import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResources, useTopics, useCreateResource, useDeleteResource, uploadResource } from '@/hooks/useInstructorData';
import { Plus, FileText, Trash2, Upload, Eye, Download, File, FileImage, FileSpreadsheet } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface ResourceUploaderProps {
  courseId: string;
}

const resourceTypes = [
  { value: 'note', label: 'Notes', icon: FileText },
  { value: 'ppt', label: 'Presentation', icon: FileImage },
  { value: 'pdf', label: 'PDF Document', icon: File },
  { value: 'assignment', label: 'Assignment', icon: FileSpreadsheet },
  { value: 'other', label: 'Other', icon: File },
];

export function ResourceUploader({ courseId }: ResourceUploaderProps) {
  const { data: resources = [], isLoading } = useResources(courseId);
  const { data: topics = [] } = useTopics(courseId);
  const createResource = useCreateResource();
  const deleteResource = useDeleteResource();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    topic_id: '',
    resource_type: 'note',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!newResource.title) {
        setNewResource({ ...newResource, title: file.name.replace(/\.[^/.]+$/, '') });
      }
      // Auto-detect type from extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        setNewResource(prev => ({ ...prev, resource_type: 'pdf' }));
      } else if (['ppt', 'pptx'].includes(ext || '')) {
        setNewResource(prev => ({ ...prev, resource_type: 'ppt' }));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !newResource.title.trim()) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 90));
      }, 150);

      const fileUrl = await uploadResource(selectedFile, courseId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      await createResource.mutateAsync({
        course_id: courseId,
        title: newResource.title,
        description: newResource.description || null,
        topic_id: newResource.topic_id || null,
        resource_type: newResource.resource_type,
        file_url: fileUrl,
        file_size_bytes: selectedFile.size,
        order_index: resources.length,
      });

      setNewResource({ title: '', description: '', topic_id: '', resource_type: 'note' });
      setSelectedFile(null);
      setIsAddOpen(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteResource.mutateAsync({ id, courseId });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getResourceIcon = (type: string) => {
    const found = resourceTypes.find(r => r.value === type);
    return found ? found.icon : File;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading resources...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Course Resources
            </CardTitle>
            <CardDescription>Upload notes, PPTs, and assignments</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Resource</DialogTitle>
                <DialogDescription>Add notes, presentations, or assignments</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.md"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="h-8 w-8 text-accent" />
                      <div className="text-left">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Click to select file</p>
                      <p className="text-xs text-muted-foreground">PDF, PPT, DOC up to 50MB</p>
                    </>
                  )}
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-center text-muted-foreground">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="resource-title">Title</Label>
                  <Input
                    id="resource-title"
                    placeholder="Resource title"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <Select
                    value={newResource.resource_type}
                    onValueChange={(value) => setNewResource({ ...newResource, resource_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resource-description">Description</Label>
                  <Textarea
                    id="resource-description"
                    placeholder="Brief description (optional)"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Link to Topic (optional)</Label>
                  <Select
                    value={newResource.topic_id}
                    onValueChange={(value) => setNewResource({ ...newResource, topic_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No topic</SelectItem>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={handleUpload} disabled={uploading || !selectedFile || createResource.isPending}>
                  {uploading ? 'Uploading...' : 'Upload Resource'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {resources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resources uploaded yet.</p>
            <p className="text-sm">Upload notes, PPTs, or assignments.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {resources.map((resource) => {
              const Icon = getResourceIcon(resource.resource_type);
              return (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{resource.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {resourceTypes.find(r => r.value === resource.resource_type)?.label}
                      </Badge>
                      <span>{formatFileSize(resource.file_size_bytes)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={resource.file_url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(resource.id)}
                      disabled={deleteResource.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
