import { useState } from "react";
import { FileSearch, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeResume } from "@/lib/gemini";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import ReactMarkdown from "react-markdown";
import { UI_STRINGS } from "@/lib/constants";

// Set worker path for PDF.js using unpkg (more reliable for version 5.x)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function ResumeAnalyzer({ recruiterContext }: { recruiterContext: string }) {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setParsing(true);
    try {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        setResume(fullText);
        toast({ title: UI_STRINGS.RESUME_ANALYZER_SUCCESS });
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResume(result.value);
        toast({ title: UI_STRINGS.RESUME_ANALYZER_SUCCESS });
      } else {
        toast({ title: UI_STRINGS.ERR_UNSUPPORTED_FILE, description: UI_STRINGS.ERR_UNSUPPORTED_FILE_DESC, variant: "error" });
      }
    } catch (error) {
      console.error("File parsing error:", error);
      toast({ title: UI_STRINGS.ERR_PARSING_FILE, description: UI_STRINGS.ERR_PARSING_FILE_DESC, variant: "error" });
    } finally {
      setParsing(false);
      // Reset input
      event.target.value = "";
    }
  }

  async function handleAnalyze() {
    if (!resume.trim()) return;
    setLoading(true);
    try {
      const analysis = await analyzeResume(recruiterContext, resume);
      setResult(analysis);
    } catch (error) {
      setResult(UI_STRINGS.RESUME_ANALYZER_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{UI_STRINGS.RESUME_ANALYZER_LABEL}</label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={parsing || loading}
            />
            <Button variant="outline" size="sm" type="button" disabled={parsing || loading}>
              {parsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {UI_STRINGS.RESUME_ANALYZER_UPLOAD}
            </Button>
          </div>
        </div>
        <Textarea
          placeholder={UI_STRINGS.RESUME_ANALYZER_PLACEHOLDER}
          className="min-h-[200px]"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          disabled={parsing || loading}
        />
      </div>
      <Button 
        className="w-full" 
        onClick={handleAnalyze} 
        disabled={loading || parsing || !resume.trim()}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
        {UI_STRINGS.RESUME_ANALYZER_BUTTON}
      </Button>

      {result && (
        <Card className="mt-4 border-teal-100 bg-teal-50/30">
          <CardHeader>
            <CardTitle className="text-lg">{UI_STRINGS.RESUME_ANALYZER_RESULT_TITLE}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-700 prose prose-slate max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
