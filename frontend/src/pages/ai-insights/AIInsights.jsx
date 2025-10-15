import { useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TypographyH2,
  TypographyH5,
  TypographyMuted,
} from "@/custom/Typography";
import { mockAIInsights } from "../../data/mockData";

export const AIInsights = () => {
  const [selectedInsight, setSelectedInsight] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <TypographyH2>AI-Powered Insights</TypographyH2>
      <TypographyMuted>
        Get predictions, analysis, and recommendations powered by AI
      </TypographyMuted>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAIInsights.map((insight) => (
          <Dialog key={insight.id}>
            <DialogTrigger asChild>
              <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm hover:shadow-md transition-shadow rounded-xl cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-600 text-white">
                      {insight.type === "Yield Prediction" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <TypographyH5>{insight.title}</TypographyH5>
                      <TypographyMuted className="text-xs">
                        {insight.type}
                      </TypographyMuted>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-600 text-white text-xs"
                  >
                    {insight.confidence}% confident
                  </Badge>
                </div>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {insight.description}
                </p>
              </Card>
            </DialogTrigger>

            {/* Dialog for detailed view */}
            <DialogContent className="sm:max-w-lg w-full p-6">
              <DialogHeader>
                <DialogTitle>{insight.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <TypographyMuted>{insight.type}</TypographyMuted>
                <p className="text-gray-700">{insight.description}</p>

                {insight.confidence && (
                  <div>
                    <TypographyMuted className="mb-1">
                      Confidence
                    </TypographyMuted>
                    <Progress
                      value={insight.confidence}
                      className="h-3 rounded-lg"
                    />
                  </div>
                )}

                {insight.details && (
                  <div>
                    <TypographyMuted className="mb-1">
                      Detailed Analysis
                    </TypographyMuted>
                    <p className="text-gray-700">{insight.details}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setSelectedInsight(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};
