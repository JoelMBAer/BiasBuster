import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface EducationalPopupProps {
  show: boolean;
  title: string;
  content: string;
  tip: string;
  onClose: () => void;
}

const EducationalPopup = ({ show, title, content, tip, onClose }: EducationalPopupProps) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="bg-secondary text-white p-4 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-2 font-heading font-bold">
            <Lightbulb className="h-5 w-5" />
            Bias Insight
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <h4 className="font-heading font-semibold mb-3">{title}</h4>
          <p className="mb-4">{content}</p>
          
          <div className="bg-neutral-100 p-3 rounded-lg mb-4">
            <h5 className="font-semibold text-sm mb-1">Quick Tip</h5>
            <p className="text-sm">{tip}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button className="w-full bg-secondary text-white" onClick={onClose}>
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EducationalPopup;
