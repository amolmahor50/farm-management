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
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useReplyToPost } from "@/hooks/useForum";

export const CommentsDrawer = ({ post, open, onClose, onCommentsUpdated }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [editCommentData, setEditCommentData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const replyMutation = useReplyToPost();

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    replyMutation.mutate(
      {
        id: post.id,
        userId: user?.id || "1",
        userName: user?.name || "Anonymous",
        content: commentText,
      },
      {
        onSuccess: () => {
          setCommentText("");
          onCommentsUpdated && onCommentsUpdated();
        },
      }
    );
  };

  const handleEditComment = () => {
    if (!editCommentData?.content?.trim()) return;
    replyMutation.mutate(
      {
        id: post.id,
        commentId: editCommentData.commentId,
        userId: user?.id || "1",
        userName: user?.name || "Anonymous",
        content: editCommentData.content,
        edit: true,
      },
      {
        onSuccess: () => {
          setEditCommentData(null);
          setEditingId(null);
          onCommentsUpdated && onCommentsUpdated();
        },
      }
    );
  };

  const handleDeleteComment = (commentId) => {
    replyMutation.mutate(
      {
        id: post.id,
        commentId,
        delete: true,
      },
      {
        onSuccess: () => {
          onCommentsUpdated && onCommentsUpdated();
        },
      }
    );
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="sm:max-w-md w-full flex flex-col p-6">
        <DrawerHeader>
          <DrawerTitle>Comments</DrawerTitle>
        </DrawerHeader>

        {/* Scrollable comments list */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {replyMutation.isLoading ? (
            <Skeleton className="w-full h-16" />
          ) : post?.comments?.length ? (
            post.comments.map((comment) => (
              <Card key={comment.id} className="p-3 gap-1 bg-secondary">
                <TypographySmall>{comment.userName}</TypographySmall>
                <TypographyMuted>{comment.content}</TypographyMuted>

                {comment.userId === user?.id && (
                  <div className="flex gap-2 mt-1">
                    <Dialog
                      open={editingId === comment.id}
                      onOpenChange={() =>
                        setEditingId(
                          editingId === comment.id ? null : comment.id
                        )
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditCommentData({
                              postId: post.id,
                              commentId: comment.id,
                              content: comment.content,
                            });
                            setEditingId(comment.id);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md w-full p-6">
                        <DialogHeader>
                          <DialogTitle>Edit Comment</DialogTitle>
                        </DialogHeader>
                        <Textarea
                          value={editCommentData?.content || ""}
                          onChange={(e) =>
                            setEditCommentData({
                              ...editCommentData,
                              content: e.target.value,
                            })
                          }
                          rows={4}
                        />
                        <DialogFooter>
                          <Button
                            onClick={() => {
                              setEditCommentData(null);
                              setEditingId(null);
                            }}
                            variant="destructive"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleEditComment}
                            disabled={replyMutation.isLoading}
                          >
                            {replyMutation.isLoading ? (
                              <Skeleton className="w-16 h-6" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={replyMutation.isLoading}
                    >
                      {replyMutation.isLoading ? (
                        <Skeleton className="w-8 h-6" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <TypographyMuted>No comments yet.</TypographyMuted>
          )}
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
            <Button
              onClick={handleAddComment}
              disabled={replyMutation.isLoading}
            >
              {replyMutation.isLoading ? (
                <Skeleton className="w-16 h-6" />
              ) : (
                "Comment"
              )}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
