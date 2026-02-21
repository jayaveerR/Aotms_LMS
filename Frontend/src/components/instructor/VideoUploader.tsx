import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useVideos,
  useTopics,
  useCreateVideo,
  useDeleteVideo,
  uploadVideo,
} from "@/hooks/useInstructorData";
import {
  Plus,
  Video,
  Trash2,
  Upload,
  Eye,
  Clock,
  PlayCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

interface VideoUploaderProps {
  courseId: string;
}

export function VideoUploader({ courseId }: VideoUploaderProps) {
  const { data: videos = [], isLoading } = useVideos(courseId);
  const { data: topics = [] } = useTopics(courseId);
  const createVideo = useCreateVideo();
  const deleteVideo = useDeleteVideo();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    topic_id: "",
    is_published: false,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!newVideo.title) {
        setNewVideo({ ...newVideo, title: file.name.replace(/\.[^/.]+$/, "") });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !newVideo.title.trim()) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const videoUrl = await uploadVideo(selectedFile, courseId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      await createVideo.mutateAsync({
        course_id: courseId,
        title: newVideo.title,
        description: newVideo.description || null,
        topic_id: newVideo.topic_id || null,
        video_url: videoUrl,
        thumbnail_url: null,
        duration_seconds: 0,
        order_index: videos.length,
        is_published: newVideo.is_published,
      });

      setNewVideo({
        title: "",
        description: "",
        topic_id: "",
        is_published: false,
      });
      setSelectedFile(null);
      setIsAddOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteVideo.mutateAsync({ id, courseId });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading videos...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Course Videos
            </CardTitle>
            <CardDescription>
              Upload and manage recorded lectures
            </CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Video</DialogTitle>
                <DialogDescription>
                  Add a new video to your course
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <Video className="h-8 w-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        Click to select video
                      </p>
                      <p className="text-xs text-muted-foreground">
                        MP4, WebM up to 500MB
                      </p>
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
                  <Label htmlFor="video-title">Title</Label>
                  <Input
                    id="video-title"
                    placeholder="Video title"
                    value={newVideo.title}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-description">Description</Label>
                  <Textarea
                    id="video-description"
                    placeholder="Video description (optional)"
                    value={newVideo.description}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Link to Topic (optional)</Label>
                  <Select
                    value={newVideo.topic_id}
                    onValueChange={(value) =>
                      setNewVideo({ ...newVideo, topic_id: value })
                    }
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

                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Publish immediately</Label>
                  <Switch
                    id="published"
                    checked={newVideo.is_published}
                    onCheckedChange={(checked) =>
                      setNewVideo({ ...newVideo, is_published: checked })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile || createVideo.isPending}
                >
                  {uploading ? "Uploading..." : "Upload Video"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {videos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <PlayCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No videos uploaded yet.</p>
            <p className="text-sm">Upload your first video to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((video, idx) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="h-16 w-24 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <PlayCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{video.title}</h4>
                    <Badge
                      variant={video.is_published ? "default" : "secondary"}
                    >
                      {video.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  {video.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {video.duration_seconds > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(video.duration_seconds)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(video.id)}
                    disabled={deleteVideo.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
