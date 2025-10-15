import { useState, useEffect } from "react";
import { Play, FileText, BookOpen, X } from "lucide-react";
import { dataStore } from "../../utils/dataStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  TypographyH2,
  TypographyMuted,
  TypographyH5,
} from "@/custom/Typography";

export const KnowledgeHub = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    setResources(dataStore.getKnowledgeResources());
  }, []);

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

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            {resource.thumbnail && (
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-2">
                {getIcon(resource.type)}
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {resource.type}
                </span>
              </div>
              <TypographyH5>{resource.title}</TypographyH5>
              <TypographyMuted>{resource.description}</TypographyMuted>
              {resource.duration && (
                <p className="text-sm text-red-500 mb-2">
                  Duration: {resource.duration}
                </p>
              )}

              {/* Dialog to view resource */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">View Resource</Button>
                </DialogTrigger>
                <DialogContent className=" min-h-[80vh] overflow-y-auto">
                  <DialogHeader className="flex justify-between items-center">
                    <DialogTitle>{resource.title}</DialogTitle>
                  </DialogHeader>

                  <div className="mt-4">
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
                        className="w-full h-[500px] border rounded-lg"
                      />
                    )}
                    {resource.type === "Book" && resource.summary && (
                      <div className="prose max-w-full">
                        <h4 className="font-semibold mb-2">Summary:</h4>
                        <p>{resource.summary}</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
