import { useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateOutreach } from "@/lib/gemini";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { UI_STRINGS } from "@/lib/constants";

export function OutreachGenerator({ recruiterContext }: { recruiterContext: string }) {
  const [candidateBio, setCandidateBio] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!candidateBio.trim()) return;
    setLoading(true);
    try {
      const outreach = await generateOutreach(recruiterContext, candidateBio);
      setResult(outreach);
    } catch (error) {
      setResult(UI_STRINGS.OUTREACH_GEN_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{UI_STRINGS.OUTREACH_GEN_LABEL}</label>
        <Textarea
          placeholder={UI_STRINGS.OUTREACH_GEN_PLACEHOLDER}
          className="min-h-[100px]"
          value={candidateBio}
          onChange={(e) => setCandidateBio(e.target.value)}
        />
      </div>
      <Button 
        className="w-full" 
        onClick={handleGenerate} 
        disabled={loading || !candidateBio.trim()}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SendHorizontal className="mr-2 h-4 w-4" />}
        {UI_STRINGS.OUTREACH_GEN_BUTTON}
      </Button>

      {result && (
        <Card className="mt-4 border-blue-100 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg">{UI_STRINGS.OUTREACH_GEN_RESULT_TITLE}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-700 prose prose-slate max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
