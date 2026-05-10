import { Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeAnalyzer } from "./ResumeAnalyzer";
import { InterviewStrategy } from "./InterviewStrategy";
import { OutreachGenerator } from "./OutreachGenerator";
import { UI_STRINGS } from "@/lib/constants";

export function AiFeatureTabs({ recruiterContext }: { recruiterContext: string }) {
  return (
    <Card className="mt-8 overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-600" />
          <div>
            <CardTitle className="text-xl">{UI_STRINGS.AI_TOOLKIT_TITLE}</CardTitle>
            <CardDescription>{UI_STRINGS.AI_TOOLKIT_DESC}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-slate-200 bg-transparent p-0">
            <TabsTrigger 
              value="resume" 
              className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {UI_STRINGS.RESUME_ANALYZER_TITLE}
            </TabsTrigger>
            <TabsTrigger 
              value="interview" 
              className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {UI_STRINGS.INTERVIEW_STRATEGY_TITLE}
            </TabsTrigger>
            <TabsTrigger 
              value="outreach" 
              className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {UI_STRINGS.OUTREACH_GEN_TITLE}
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="resume" className="mt-0 outline-none">
              <ResumeAnalyzer recruiterContext={recruiterContext} />
            </TabsContent>
            <TabsContent value="interview" className="mt-0 outline-none">
              <InterviewStrategy recruiterContext={recruiterContext} />
            </TabsContent>
            <TabsContent value="outreach" className="mt-0 outline-none">
              <OutreachGenerator recruiterContext={recruiterContext} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
