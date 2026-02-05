import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const countries = [
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+48", country: "PL", flag: "🇵🇱", name: "Poland" },
  { code: "+90", country: "TR", flag: "🇹🇷", name: "Turkey" },
  { code: "+62", country: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "+60", country: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "+63", country: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "+66", country: "TH", flag: "🇹🇭", name: "Thailand" },
  { code: "+84", country: "VN", flag: "🇻🇳", name: "Vietnam" },
  { code: "+92", country: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", country: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94", country: "LK", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", country: "NP", flag: "🇳🇵", name: "Nepal" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+234", country: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "+254", country: "KE", flag: "🇰🇪", name: "Kenya" },
];

interface PhoneInputProps {
  value?: string;
  countryCode?: string;
  onValueChange?: (phone: string) => void;
  onCountryChange?: (code: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, countryCode = "+91", onValueChange, onCountryChange, placeholder = "9876543210", className, disabled }, ref) => {
    const [open, setOpen] = React.useState(false);
    const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

    return (
      <div className={cn("flex gap-2", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className="flex items-center justify-between gap-1 h-11 px-3 rounded-md border border-input bg-background hover:bg-muted/50 transition-colors min-w-[110px] text-sm"
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="text-foreground font-medium">{selectedCountry.code}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[280px] p-0 bg-background border border-border shadow-lg z-[100]" 
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <ScrollArea className="h-[300px]">
              <div className="p-1">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onCountryChange?.(country.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left hover:bg-muted transition-colors",
                      countryCode === country.code && "bg-muted"
                    )}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">{country.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">{country.code}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <Input
          ref={ref}
          type="tel"
          value={value}
          onChange={(e) => onValueChange?.(e.target.value.replace(/\D/g, ''))}
          placeholder={placeholder}
          className="flex-1 h-11 bg-background text-foreground border-input"
          disabled={disabled}
          maxLength={15}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput, countries };
