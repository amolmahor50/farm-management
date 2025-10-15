import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TypographySmall, TypographyMuted } from "@/custom/Typography";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { dataStore } from "../../utils/dataStore";

export const CommentsDrawer = ({ post, open, onClose, onCommentsUpdated }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [editCommentData, setEditCommentData] = useState(null);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    dataStore.addComment(post.id, {
      userId: user?.id || "1",
      userName: user?.name || "Anonymous",
      content: commentText,
    });
    setCommentText("");
    onCommentsUpdated();
  };

  const handleEditComment = (postId, commentId, content) => {
    dataStore.editComment(postId, commentId, content);
    setEditCommentData(null);
    onCommentsUpdated();
  };

  const handleDeleteComment = (postId, commentId) => {
    dataStore.deleteComment(postId, commentId);
    onCommentsUpdated();
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="sm:max-w-md w-full flex flex-col p-6">
        <DrawerHeader>
          <DrawerTitle>Comments</DrawerTitle>
        </DrawerHeader>

        {/* Scrollable comments list */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {post?.comments.map((comment) => (
            <Card key={comment.id} className="p-3 gap-1 bg-secondary">
              <TypographySmall>{comment.userName}</TypographySmall>
              <TypographyMuted>{comment.content}</TypographyMuted>

              {comment.userId === user?.id && (
                <div className="flex gap-2 mt-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md w-full p-6">
                      <DialogHeader>
                        <DialogTitle>Edit Comment</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        value={editCommentData?.content || comment.content}
                        onChange={(e) =>
                          setEditCommentData({
                            postId: post.id,
                            commentId: comment.id,
                            content: e.target.value,
                          })
                        }
                        rows={4}
                      />
                      <DialogFooter>
                        <Button
                          onClick={() => setEditCommentData(null)}
                          variant="destructive"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() =>
                            handleEditComment(
                              editCommentData.postId,
                              editCommentData.commentId,
                              editCommentData.content
                            )
                          }
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteComment(post.id, comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Fixed input area */}
        <div className="mt-auto">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            placeholder="Write your comment..."
          />
          <div className="flex gap-3 mt-2">
            <Button variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAddComment}>Comment</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
