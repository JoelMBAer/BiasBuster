import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserCheck, Lightbulb } from "lucide-react";
import { Candidate } from "@/types/game";

interface ReflectionScreenProps {
  selectedCandidate: Candidate | null;
  onSubmit: (mainInfluence: string, reflectionNotes?: string) => void;
}

const ReflectionScreen = ({ selectedCandidate, onSubmit }: ReflectionScreenProps) => {
  const [influence, setInfluence] = useState("");
  const [reflectionNotes, setReflectionNotes] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!influence) return;
    onSubmit(influence, reflectionNotes);
  };
  
  if (!selectedCandidate) return null;
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-primary text-white">
          <CardTitle className="text-xl md:text-2xl font-heading font-bold">Decision Reflection</CardTitle>
          <CardDescription className="text-white/90">Take a moment to reflect on your decision factors</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-primary text-white h-12 w-12 rounded-full flex items-center justify-center text-xl">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold">You selected: <span>{selectedCandidate.name}</span></h3>
                <p className="text-sm text-neutral-400">This candidate is now part of your team</p>
              </div>
            </div>
            
            {/* Flash Card */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Lightbulb className="text-secondary mr-3 mt-1 h-5 w-5" />
                <div>
                  <h4 className="font-heading font-semibold text-neutral-500">Bias Insight</h4>
                  <p className="text-sm mt-1">Research shows that 42% of hiring managers unconsciously favor candidates with similar backgrounds to their own.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reflection Questions */}
          <form id="reflection-form" onSubmit={handleSubmit}>
            <h3 className="font-heading font-semibold text-lg mb-3">What influenced your decision most?</h3>
            
            <RadioGroup value={influence} onValueChange={setInfluence} className="space-y-3 mb-6">
              <div className="flex items-center">
                <RadioGroupItem value="experience" id="factor-1" className="mr-3" />
                <Label htmlFor="factor-1">Experience level</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="education" id="factor-2" className="mr-3" />
                <Label htmlFor="factor-2">Educational background</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="skills" id="factor-3" className="mr-3" />
                <Label htmlFor="factor-3">Technical skills</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="interview" id="factor-4" className="mr-3" />
                <Label htmlFor="factor-4">Interview responses</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="personal" id="factor-5" className="mr-3" />
                <Label htmlFor="factor-5">Personal impression</Label>
              </div>
            </RadioGroup>
            
            <div className="mb-6">
              <Label htmlFor="reflection-notes" className="block font-semibold mb-2">
                Additional reflections (optional)
              </Label>
              <Textarea 
                id="reflection-notes" 
                rows={3}
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="Share any additional thoughts about your decision..."
                className="w-full border border-neutral-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={!influence}>
                Continue to Next Round
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReflectionScreen;
