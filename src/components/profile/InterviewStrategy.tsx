import { useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateInterviewStrategy } from "@/lib/gemini";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { UI_STRINGS } from "@/lib/constants";

export function InterviewStrategy({ recruiterContext }: { recruiterContext: string }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const strategy = await generateInterviewStrategy(recruiterContext);
      setResult(strategy);
    } catch (error) {
      setResult(UI_STRINGS.INTERVIEW_STRATEGY_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        {UI_STRINGS.INTERVIEW_STRATEGY_DESC}
      </p>
      <Button 
        className="w-full" 
        onClick={handleGenerate} 
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
        {UI_STRINGS.INTERVIEW_STRATEGY_BUTTON}
      </Button>

      {result && (
        <Card className="mt-4 border-amber-100 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="text-lg">{UI_STRINGS.INTERVIEW_STRATEGY_TITLE}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-700 prose prose-slate max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
