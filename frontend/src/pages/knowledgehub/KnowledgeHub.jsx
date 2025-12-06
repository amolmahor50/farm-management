import { Play, FileText, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TypographyH2,
  TypographyMuted,
  TypographyH5,
  TypographySmall,
} from "@/custom/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useKnowledge, useDeleteKnowledge } from "@/hooks/useKnowledge";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/custom/Icon";

export const KnowledgeHub = () => {
  const { data: resources = [], isLoading } = useKnowledge();
  const deleteKnowledgeMutation = useDeleteKnowledge();

  const resourcesArr = Array.isArray(resources)
    ? resources
    : Array.isArray(resources?.data)
    ? resources.data
    : [];

  const getIcon = (type) => {
    switch (type) {
      case "Video":
        return <Play className="w-5 h-5" />;
      case "PDF":
        return <FileText className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <TypographyH2>Knowledge Hub</TypographyH2>

      {isLoading ? (
        <Loading />
      ) : resourcesArr.length > 0 ? (
        <>
          {/* Resource Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesArr.map((resource) => (
              <Card
                key={resource._id}
                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {resource.thumbnail && (
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-col gap-3 flex-1 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getIcon(resource.type)}
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {resource.type}
                    </span>
                  </div>
                  <TypographyH5>{resource.title}</TypographyH5>
                  <TypographyMuted>{resource.description}</TypographyMuted>
                  {resource.duration && (
                    <TypographySmall className="text-red-500 mb-2">
                      Duration: {resource.duration}
                    </TypographySmall>
                  )}

                  {/* Dialog to view resource */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-auto">View Resource</Button>
                    </DialogTrigger>
                    <DialogContent className="min-h-[80vh] overflow-y-auto max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{resource.title}</DialogTitle>
                      </DialogHeader>

                      <div className="mt-4 space-y-4">
                        <div>
                          <TypographySmall className="text-gray-600">
                            {resource.description}
                          </TypographySmall>
                        </div>
                        {resource.type === "Video" && resource.url && (
                          <video
                            src={resource.url}
                            controls
                            className="w-full h-[400px] bg-black rounded-lg"
                          />
                        )}
                        {resource.type === "PDF" && resource.url && (
                          <iframe
                            src={resource.url}
                            title={resource.title}
                            className="w-full h-[600px] bg-white rounded-lg"
                          />
                        )}
                        {resource.type === "Article" && (
                          <div
                            className="prose max-w-full"
                            dangerouslySetInnerHTML={{
                              __html: resource.content,
                            }}
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Icon name="BookOpen" size={32} />}
          title="No Resources Available"
          description="No knowledge resources available at the moment."
        />
      )}
    </div>
  );
};
