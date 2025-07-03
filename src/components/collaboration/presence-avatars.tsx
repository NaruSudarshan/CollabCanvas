'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const users = [
  { name: "Alice Wonderland", initials: "AW", src: "https://placehold.co/40x40.png?text=AW", hint: "woman face" },
  { name: "Bob The Builder", initials: "BB", src: "https://placehold.co/40x40.png?text=BB", hint: "man face" },
  { name: "Charlie Chaplin", initials: "CC", src: "https://placehold.co/40x40.png?text=CC", hint: "person glasses" },
];

export function PresenceAvatars() {
  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {users.map((user, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Avatar className="border-2 border-card cursor-pointer hover:z-10 transition-all hover:scale-110">
                <AvatarImage src={`${user.src}&random=${index}`} alt={user.name} data-ai-hint={user.hint} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
         <Tooltip>
            <TooltipTrigger asChild>
                <Avatar className="border-2 border-card cursor-pointer hover:z-10 transition-all hover:scale-110 bg-muted">
                    <AvatarFallback>+2</AvatarFallback>
                </Avatar>
            </TooltipTrigger>
            <TooltipContent>
                <p>2 more users online</p>
            </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
