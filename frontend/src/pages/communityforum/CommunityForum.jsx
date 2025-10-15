import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  TypographyH2,
  TypographyH5,
  TypographyMuted,
} from "@/custom/Typography";
import { Icon } from "@/custom/Icon";
import { NewPostDialog } from "./NewPostDialog";
import { CommentsDrawer } from "./CommentsDrawer";
import { dataStore } from "../../utils/dataStore";

export const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => setPosts(dataStore.getForumPosts());

  const handleLike = (postId) => {
    dataStore.likePost(postId);
    loadPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TypographyH2>Community Forum</TypographyH2>
        <NewPostDialog onPostCreated={loadPosts} />
      </div>

      <div className="space-y-4 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="gap-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <TypographyH5>{post.title}</TypographyH5>
                <TypographyMuted>
                  by {post.userName} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </TypographyMuted>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {post.category}
              </span>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <Icon name="ThumbsUp" /> {post.likes}
              </button>
              <button
                onClick={() => setSelectedPost(post)}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <Icon name="MessageCircle" /> {post.comments.length}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {selectedPost && (
        <CommentsDrawer
          post={selectedPost}
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          onCommentsUpdated={loadPosts}
        />
      )}
    </div>
  );
};
