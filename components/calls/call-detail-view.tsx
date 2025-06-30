"use client";

import type { Call } from "@/lib/types";
import type { SummarizeCallTranscriptOutput } from "@/ai/flows/summarize-call-transcript";
import type { PerformSentimentAnalysisOutput } from "@/ai/flows/perform-sentiment-analysis";
import type { AutoTagCallOutput } from "@/ai/flows/auto-tag-calls";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Clock, MapPin, Languages, Bot, Percent, FileText, Sparkles, Tag, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";


type CallDetailViewProps = {
    call: Call;
    summary: SummarizeCallTranscriptOutput;
    sentiment: PerformSentimentAnalysisOutput;
    tags: AutoTagCallOutput;
};

export function CallDetailView({ call, summary, sentiment, tags }: CallDetailViewProps) {
    const { toast } = useToast();

    return (
        <div className="space-y-8">
            <div>
                <Button variant="outline" asChild>
                    <Link href="/calls">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Call Explorer
                    </Link>
                </Button>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-8">
                    {/* Call Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Call Information</CardTitle>
                            <CardDescription>ID: {call.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center"><User className="mr-3 h-4 w-4 text-muted-foreground" /> <span>User: {call.user.id}</span></div>
                            <div className="flex items-center"><Clock className="mr-3 h-4 w-4 text-muted-foreground" /> <span>{new Date(call.timestamp).toLocaleString()}</span></div>
                            <div className="flex items-center"><MapPin className="mr-3 h-4 w-4 text-muted-foreground" /> <span>Location: {call.user.location}</span></div>
                            <div className="flex items-center"><Languages className="mr-3 h-4 w-4 text-muted-foreground" /> <span>Language: {call.user.language}</span></div>
                            <Separator />
                            <div className="flex items-center"><Bot className="mr-3 h-4 w-4 text-muted-foreground" /> <span>Agent: {call.agent.id}</span></div>
                            <div className="flex items-center"><Percent className="mr-3 h-4 w-4 text-muted-foreground" /> <span>Agent Confidence: {(call.agent.confidence * 100).toFixed(0)}%</span></div>
                        </CardContent>
                    </Card>

                    {/* AI Analysis Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" /> AI Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Sentiment</h4>
                                <Badge variant={sentiment.overallSentiment === 'Positive' ? 'default' : sentiment.overallSentiment === 'Negative' ? 'destructive' : 'secondary'}>{sentiment.overallSentiment}</Badge>
                                <span className="ml-2 text-sm text-muted-foreground">Score: {sentiment.sentimentScore}</span>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Emotional Keywords</h4>
                                <div className="flex flex-wrap gap-1">
                                    {sentiment.emotionalKeywords.map(keyword => <Badge key={keyword} variant="outline">{keyword}</Badge>)}
                                </div>
                            </div>
                            <Separator />
                             <div>
                                <h4 className="font-semibold mb-2">Auto-Tagging</h4>
                                <div className="flex flex-wrap gap-1">
                                    {tags.tags.map(tag => (
                                        <Badge key={tag} variant={tag === 'Urgent' || tag === 'Complaint' ? 'destructive' : 'secondary'}>
                                            {tag === 'Urgent' && <AlertTriangle className="mr-1 h-3 w-3" />}
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <Button size="sm" variant="link" className="px-0 h-auto mt-2" onClick={() => toast({ title: "Tags updated!"})}>
                                    <Tag className="mr-2 h-4 w-4" /> Edit Tags
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                     {/* AI Summary Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> AI-Generated Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            <p>{summary.summary}</p>
                        </CardContent>
                    </Card>

                    {/* Transcript Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Full Transcript</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] rounded-md border p-4 text-sm">
                                {call.transcript.full.split(/(User:|Agent:)/).filter(Boolean).map((part, index) => {
                                    if (part === "User:" || part === "Agent:") {
                                        return <strong key={index} className={`block mt-2 ${part === "User:" ? "text-primary" : "text-accent"}`}>{part}</strong>
                                    }
                                    return <span key={index}>{part}</span>
                                })}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
